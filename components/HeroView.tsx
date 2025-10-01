
import React from 'react';
import { MicrophoneIcon } from './icons';

interface HeroViewProps {
  onStartMeeting: () => void;
  t: Record<string, string>;
}

export const HeroView: React.FC<HeroViewProps> = ({ onStartMeeting, t }) => {
  return (
    <div className="text-center py-16 sm:py-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
          {t.heroTitle}
        </h2>
        <p className="mt-5 text-xl text-gray-400">
          {t.heroSubtitle}
        </p>
        <div className="mt-12">
          <button
            onClick={onStartMeeting}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transform transition-transform hover:scale-105"
          >
            <MicrophoneIcon className="w-6 h-6 mr-3" />
            {t.startMeeting}
          </button>
        </div>
      </div>
    </div>
  );
};
