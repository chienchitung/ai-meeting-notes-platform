
import React, { useState } from 'react';
import { SummaryData } from '../types';
import { ShareIcon, CheckIcon } from './icons';

interface SummaryViewProps {
  summary: SummaryData;
  transcript: string;
  onNewMeeting: () => void;
  t: Record<string, string>;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, transcript, onNewMeeting, t }) => {
  const [editableSummary, setEditableSummary] = useState(summary.summary);
  const [editableActionItems, setEditableActionItems] = useState(summary.actionItems.join('\n'));
  const [editableKeyDecisions, setEditableKeyDecisions] = useState(summary.keyDecisions.join('\n'));
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    const shareableContent = `
# ${t.meetingSummary}

## ${t.summary}
${editableSummary}

## ${t.actionItems}
${editableActionItems.split('\n').map(item => `- ${item}`).join('\n')}

## ${t.keyDecisions}
${editableKeyDecisions.split('\n').map(item => `- ${item}`).join('\n')}

---

## ${t.fullTranscript}
${transcript}
    `;
    navigator.clipboard.writeText(shareableContent.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const renderList = (items: string) => {
      return (
          <ul className="list-disc list-inside space-y-2">
              {items.split('\n').map((item, index) => item.trim() && <li key={index}>{item}</li>)}
          </ul>
      )
  };

  const commonTextareaClasses = "w-full p-2 bg-gray-900 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 transition";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-cyan-400">{t.meetingSummary}</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition"
          >
            {isCopied ? <CheckIcon className="w-5 h-5 mr-2 text-green-400" /> : <ShareIcon className="w-5 h-5 mr-2" />}
            {isCopied ? t.copiedToClipboard : t.share}
          </button>
          <button
            onClick={onNewMeeting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
          >
            {t.startAnotherMeeting}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-300">{t.summary}</h3>
            <textarea
              value={editableSummary}
              onChange={(e) => setEditableSummary(e.target.value)}
              rows={6}
              className={commonTextareaClasses}
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-300">{t.fullTranscript}</h3>
            <textarea
                value={transcript}
                readOnly
                rows={10}
                className={`${commonTextareaClasses} cursor-not-allowed opacity-70`}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-300">{t.actionItems}</h3>
             <textarea
              value={editableActionItems}
              onChange={(e) => setEditableActionItems(e.target.value)}
              rows={5}
              className={commonTextareaClasses}
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-300">{t.keyDecisions}</h3>
            <textarea
              value={editableKeyDecisions}
              onChange={(e) => setEditableKeyDecisions(e.target.value)}
              rows={5}
              className={commonTextareaClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
