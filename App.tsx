
import React, { useState, useCallback } from 'react';
import { Language } from './types';
import { locales } from './constants/locales';
import { Header } from './components/Header';
import { MeetingView } from './components/MeetingView';
import { SummaryData } from './types';
import { SummaryView } from './components/SummaryView';
import { HeroView } from './components/HeroView';
import { MeetingStatus } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.ZH_TW);
  const [meetingStatus, setMeetingStatus] = useState<MeetingStatus>(MeetingStatus.NOT_STARTED);
  const [transcript, setTranscript] = useState<string>('');
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const t = locales[language];

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const handleMeetingStart = () => {
    setTranscript('');
    setSummary(null);
    setMeetingStatus(MeetingStatus.IN_PROGRESS);
  };

  const handleMeetingEnd = (finalTranscript: string) => {
    setTranscript(finalTranscript);
    setMeetingStatus(MeetingStatus.SUMMARIZING);
  };
  
  const handleSummaryReady = (summaryData: SummaryData) => {
    setSummary(summaryData);
    setMeetingStatus(MeetingStatus.FINISHED);
  };

  const handleNewMeeting = () => {
    setMeetingStatus(MeetingStatus.NOT_STARTED);
    setTranscript('');
    setSummary(null);
  };

  const renderContent = () => {
    switch (meetingStatus) {
      case MeetingStatus.NOT_STARTED:
        return <HeroView onStartMeeting={handleMeetingStart} t={t} />;
      case MeetingStatus.IN_PROGRESS:
      case MeetingStatus.SUMMARIZING:
        return (
          <MeetingView
            onMeetingEnd={handleMeetingEnd}
            onSummaryReady={handleSummaryReady}
            isSummarizing={meetingStatus === MeetingStatus.SUMMARIZING}
            t={t}
            // FIX: Pass language to MeetingView
            language={language}
          />
        );
      case MeetingStatus.FINISHED:
        return summary && <SummaryView summary={summary} transcript={transcript} onNewMeeting={handleNewMeeting} t={t} />;
      default:
        return <HeroView onStartMeeting={handleMeetingStart} t={t} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        t={t}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
