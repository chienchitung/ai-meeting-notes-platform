
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { generateSummary, QuotaExceededError } from '../services/geminiService';
import { LoadingSpinner, StopIcon } from './icons';
import { SummaryData, TranscriptionChunk, Language } from '../types';

// Helper functions for audio encoding, MUST be defined at the module level
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] < 0 ? data[i] * 32768 : data[i] * 32767;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface MeetingViewProps {
  onMeetingEnd: (finalTranscript: string) => void;
  onSummaryReady: (summary: SummaryData) => void;
  isSummarizing: boolean;
  t: Record<string, string>;
  language: Language;
}

export const MeetingView: React.FC<MeetingViewProps> = ({ onMeetingEnd, onSummaryReady, isSummarizing, t, language }) => {
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptionChunk[]>([]);
  
  const sessionPromiseRef = useRef<ReturnType<typeof ai.live.connect> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const stopMeeting = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      await audioContextRef.current.close();
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
    if(mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
    }
    
    if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current;
        session.close();
    }
    
    const finalTranscript = transcript.map(t => `[${t.timestamp}] ${t.text}`).join('\n');
    onMeetingEnd(finalTranscript);
  }, [transcript, onMeetingEnd]);


  useEffect(() => {
    const startTranscription = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => console.log('Session opened.'),
                    onmessage: (message: LiveServerMessage) => {
                        if(message.serverContent?.inputTranscription) {
                            const { text } = message.serverContent.inputTranscription;
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last && !last.isFinal) {
                                    const updatedLast = { ...last, text: last.text + text };
                                    return [...prev.slice(0, -1), updatedLast];
                                } else {
                                    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                    return [...prev, { text, isFinal: false, timestamp }];
                                }
                            });
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscript(prev => {
                                if (prev.length > 0) {
                                    const lastIndex = prev.length - 1;
                                    const last = prev[lastIndex];
                                    if (last && !last.isFinal) {
                                        const updated = [...prev];
                                        updated[lastIndex] = { ...last, isFinal: true };
                                        return updated;
                                    }
                                }
                                return prev;
                            });
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setError(t.apiError);
                    },
                    onclose: (e: CloseEvent) => console.log('Session closed.'),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                },
            });

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                if (sessionPromiseRef.current) {
                    sessionPromiseRef.current.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                }
            };

            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current.destination);

        } catch (err) {
            console.error(err);
            setError(t.micError);
        }
    };
    
    startTranscription();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
        stopMeeting();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(isSummarizing) {
        const finalTranscript = transcript.map(t => t.text).join('\n');
        generateSummary(finalTranscript, language)
            .then(onSummaryReady)
            .catch(err => {
                console.error(err);
                if (err instanceof QuotaExceededError) {
                    setError(t.quotaError);
                } else {
                    setError(t.apiError);
                }
            });
    }
  }, [isSummarizing, onSummaryReady, t.apiError, language, transcript, t.quotaError]);


  if (isSummarizing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg shadow-xl text-center h-96">
        <LoadingSpinner className="w-16 h-16 text-cyan-400 mb-6" />
        <h3 className="text-2xl font-bold text-white mb-2">{t.generatingSummary}</h3>
        <p className="text-gray-400 max-w-md">{t.generatingSummaryDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-cyan-400">{t.meetingInProgress}</h2>
        <button
          onClick={stopMeeting}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900"
        >
          <StopIcon className="w-5 h-5 mr-2" />
          {t.stopMeeting}
        </button>
      </div>

      {error && <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-md">{error}</div>}

      <div className="bg-gray-800 rounded-lg shadow-inner p-6 h-[50vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">{t.liveTranscript}</h3>
        <div className="space-y-4">
          {transcript.map((chunk, index) => (
            <div key={index} className="flex gap-x-4 items-start">
              <span className="font-mono text-xs text-gray-500 whitespace-nowrap pt-1">{chunk.timestamp}</span>
              <p className={`text-gray-300 ${!chunk.isFinal ? 'opacity-60' : ''}`}>{chunk.text}</p>
            </div>
          ))}
          {!transcript.length && <p className="text-gray-500">...</p>}
        </div>
      </div>
    </div>
  );
};