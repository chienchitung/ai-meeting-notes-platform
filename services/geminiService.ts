import { GoogleGenAI, Type } from '@google/genai';
import { SummaryData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSummary = async (transcript: string, language: string): Promise<SummaryData> => {
  const langInstruction = language === 'en' ? 'Respond in English.' : '請以繁體中文回應。';
  
  const prompt = `
    Based on the following meeting transcript, please provide a concise summary, a list of action items, and a list of key decisions.
    ${langInstruction}
    Format the output as a JSON object.

    Transcript:
    ---
    ${transcript}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A concise summary of the meeting.',
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'A list of action items identified during the meeting.',
            },
            keyDecisions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'A list of key decisions made during the meeting.',
            },
          },
          required: ['summary', 'actionItems', 'keyDecisions'],
        },
      },
    });

    let jsonString = response.text.trim();
    // Clean the response to ensure it's valid JSON.
    // Sometimes the model wraps the JSON in markdown code fences.
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3, -3).trim();
    }

    const parsedJson = JSON.parse(jsonString);
    return parsedJson as SummaryData;

  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary from Gemini API.");
  }
};