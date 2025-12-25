
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import QuizProfessor from './components/QuizProfessor.tsx';
import ShareButton from './components/ShareButton.tsx';
import { QuizCategory, Language } from './types.ts';
import { TRANSLATIONS } from './constants.tsx';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [language, setLanguage] = useState<Language>('ES');

  const startQuiz = (cat: QuizCategory) => {
    setSelectedCategory(cat);
  };

  const t = TRANSLATIONS[language];
  const categoriesList = [
    { id: QuizCategory.FOOD, ...t.categories[QuizCategory.FOOD] },
    { id: QuizCategory.DRINKS, ...t.categories[QuizCategory.DRINKS] },
    { id: QuizCategory.WINE, ...t.categories[QuizCategory.WINE] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-500">
      <Header 
        language={language} 
        onLanguageChange={(lang) => setLanguage(lang)} 
      />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {!selectedCategory ? (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 pt-10">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                {t.heroTitle} <span className="text-blue-600 block">{t.heroSubtitle}</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                {t.heroDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startQuiz(cat.id)}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left group"
                >
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                  <span className="text-blue-600 font-bold text-sm border-b-2 border-transparent group-hover:border-blue-600 transition-all">
                    {t.startBtn}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
              <div className="text-white">
                <h4 className="font-bold text-xl italic">"{t.excellence}"</h4>
                <p className="text-blue-100 text-sm opacity-80">CVI.CHE 105 Team Only.</p>
              </div>
              <ShareButton variant="full" />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mb-4 text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors"
            >
              ← {language === 'ES' ? 'Volver' : 'Back'}
            </button>
            <QuizProfessor 
              category={selectedCategory} 
              language={language}
              onReset={() => setSelectedCategory(null)} 
            />
          </div>
        )}
      </main>

      <footer className="py-8 text-center border-t border-slate-200 mt-10">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-loose">
          CVI.CHE 105 Training Academy <br/> 
          <span className="opacity-50 tracking-normal font-medium">Powered by Gemini Flash Technology</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
