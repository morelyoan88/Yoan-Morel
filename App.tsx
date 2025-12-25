
import React, { useState } from 'react';
import Header from './components/Header';
import QuizProfessor from './components/QuizProfessor';
import ShareButton from './components/ShareButton';
import { QuizCategory } from './types';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);

  const categories = [
    { 
      id: QuizCategory.FOOD, 
      name: 'Food Manual', 
      desc: 'Causas, Ceviches, Sushi, Arroces y Glosario.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.082.477-4 1.253" />
        </svg>
      )
    },
    { 
      id: QuizCategory.DRINKS, 
      name: 'Drinks Manual', 
      desc: 'Pisco Sours, Chilcanos, Coctelería de Autor y Cervezas.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: QuizCategory.WINE, 
      name: 'Wine List', 
      desc: 'Variedades de Blancos, Tintos, Rosados y Espumosos.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        {!selectedCategory ? (
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight px-4">
                Domina el Arte de la <span className="text-blue-600">Hospitalidad Peruana</span>
              </h2>
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto px-4">
                Selecciona un manual para comenzar tu sesión de estudio con el Manager. Prepárate para preguntas sobre ingredientes, métodos y maridaje.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="group relative bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col items-start"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-6">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{cat.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{cat.desc}</p>
                  <div className="flex items-center text-blue-600 font-bold text-sm mt-auto">
                    Empezar Quiz
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-50 border border-blue-100 rounded-3xl p-6 md:p-8">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-blue-900 font-bold text-lg italic">"Un buen mesero conoce su menú de memoria."</h4>
                <p className="text-blue-700/80 text-sm">Comparte esta herramienta con tu equipo para elevar el nivel de servicio.</p>
              </div>
              <ShareButton variant="full" />
            </div>
          </div>
        ) : (
          <QuizProfessor 
            category={selectedCategory} 
            onReset={() => setSelectedCategory(null)} 
          />
        )}
      </main>

      <footer className="py-8 border-t border-slate-100 text-center px-4">
        <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-widest">
          &copy; 2026 CVI.CHE 105 Official Training Platform | Web-Based App
        </p>
      </footer>
    </div>
  );
};

export default App;
