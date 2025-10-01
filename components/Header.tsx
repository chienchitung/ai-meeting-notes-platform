
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: Record<string, string>;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">{t.appName}</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleToggle}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            <span>{t.language}</span>
            <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {e.preventDefault(); handleSelect(Language.EN)}}
                    className={`block px-4 py-2 text-sm hover:bg-gray-600 ${language === Language.EN ? 'text-cyan-400' : ''}`}
                  >
                    {t.english}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {e.preventDefault(); handleSelect(Language.ZH_TW)}}
                    className={`block px-4 py-2 text-sm hover:bg-gray-600 ${language === Language.ZH_TW ? 'text-cyan-400' : ''}`}
                  >
                    {t.traditionalChinese}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
