
import React from 'react';
import ShareButton from './ShareButton';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          C
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">CVI.CHE 105</h1>
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest leading-none">Training Academy</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden lg:block text-sm font-medium text-slate-400 italic mr-4">
          "Excellence in every detail"
        </div>
        <ShareButton />
      </div>
    </header>
  );
};

export default Header;
