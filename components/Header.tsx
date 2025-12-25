
import React from 'react';
import ShareButton from './ShareButton';
// Fix: Import Language from types.ts instead of constants.tsx as it is not exported from the latter.
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<Props> = ({ language, onLanguageChange }) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
          C
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 leading-none">CVI.CHE 105</h1>
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest leading-none mt-1">Academy</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => onLanguageChange('ES')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'ES' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ES
          </button>
          <button 
            onClick={() => onLanguageChange('EN')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'EN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            EN
          </button>
        </div>
        
        <div className="hidden lg:block text-sm font-medium text-slate-400 italic">
          "{t.excellence}"
        </div>
        <ShareButton />
      </div>
    </header>
  );
};

export default Header;
