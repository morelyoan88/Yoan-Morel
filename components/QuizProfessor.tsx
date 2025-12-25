
import React, { useState, useEffect, useRef } from 'react';
import { QuizCategory, QuizMessage, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateQuestion, evaluateAnswer, getProductImage } from '../services/geminiService';

interface Props {
  category: QuizCategory;
  language: Language;
  onReset: () => void;
}

const QuizProfessor: React.FC<Props> = ({ category, language, onReset }) => {
  const [messages, setMessages] = useState<QuizMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [awaitingCorrection, setAwaitingCorrection] = useState(false);
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  const triggerNextQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextQ = await generateQuestion(category, language);
      setMessages(prev => [...prev, { role: 'professor', content: nextQ }]);
    } catch (err) {
      console.error(err);
      setError(language === 'ES' ? "Error de conexión con la Academia. Verifique su API Key." : "Connection error with the Academy. Please check your API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const initQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setMessages([]);
    try {
      const q = await generateQuestion(category, language);
      setMessages([{ role: 'professor', content: q }]);
    } catch (err) {
      console.error(err);
      setError(language === 'ES' ? "Error al iniciar el examen. Verifique su conexión y API Key." : "Error starting exam. Check your connection and API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initQuiz();
  }, [category, language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || error) return;

    const currentQuestion = [...messages].reverse().find(m => m.role === 'professor' && !m.imageUrl && !m.content.startsWith(t.correctAnswerLabel))?.content || "";
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    const inputToEval = userInput;
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const evaluation = await evaluateAnswer(category, currentQuestion, inputToEval, language);
      const imgData = await getProductImage(evaluation.productName);

      const feedbackMsg: QuizMessage = { 
        role: 'professor', 
        content: evaluation.feedback,
        isCorrect: evaluation.isCorrect,
        imageUrl: imgData?.url
      };
      
      setMessages(prev => [...prev, feedbackMsg]);

      if (evaluation.isCorrect) {
        setScore(s => s + 1);
        setAwaitingCorrection(false);
        setTimeout(triggerNextQuestion, 3000);
      } else {
        setLastCorrectAnswer(evaluation.correctAnswer);
        setAwaitingCorrection(true);
      }

    } catch (err) {
      console.error(err);
      setError(language === 'ES' ? "No pudimos evaluar su respuesta. Intente de nuevo." : "Evaluation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setAwaitingCorrection(false);
  };

  const handleShowAnswer = () => {
    setAwaitingCorrection(false);
    setMessages(prev => [...prev, { 
      role: 'professor', 
      content: `${t.correctAnswerLabel} ${lastCorrectAnswer}` 
    }]);
    setTimeout(triggerNextQuestion, 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-bold">{t.categories[category].name}</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">PROFESOR CHIPOCO</p>
        </div>
        <div className="bg-white/10 px-4 py-1 rounded-full border border-white/20">
          <p className="text-sm font-bold text-yellow-500">PUNTAJE: {score}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
        {messages.length === 0 && !isLoading && !error && (
          <div className="flex justify-center items-center h-full">
            <p className="text-slate-400 font-medium italic">Preparando examen...</p>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-2xl shadow-md overflow-hidden ${
              m.role === 'user' ? 'bg-blue-600 text-white px-5 py-3' : 'bg-white border border-slate-200 text-slate-800'
            }`}>
              {m.role === 'professor' && (
                <div className={`px-5 py-3 ${m.isCorrect === true ? 'bg-green-50' : m.isCorrect === false ? 'bg-red-50' : 'bg-amber-50/20'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] uppercase font-black opacity-60 tracking-tighter">
                      {m.isCorrect === true ? '✅ EXCELENTE' : m.isCorrect === false ? '❌ DEFICIENTE' : 'ACADEMIA CHIPOCO'}
                    </p>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed font-medium">{m.content}</p>
                </div>
              )}
              {m.role === 'user' && <p className="text-sm md:text-base font-semibold">{m.content}</p>}
              
              {m.imageUrl && (
                <div className="relative border-t border-slate-100">
                  <img src={m.imageUrl} alt="Reference" className="w-full h-auto object-cover max-h-[300px]" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[9px] py-2 text-center font-black uppercase tracking-[0.2em]">
                    {t.manualRef}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4 mx-4">
            <p className="text-red-700 font-bold">{error}</p>
            <button onClick={initQuiz} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
              {language === 'ES' ? 'Reintentar Examen' : 'Retry Exam'}
            </button>
          </div>
        )}

        {awaitingCorrection && !isLoading && !error && (
          <div className="flex gap-2 p-2 animate-in fade-in slide-in-from-bottom-2">
            <button onClick={handleTryAgain} className="bg-white border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-50 transition-all shadow-sm">
              🔄 {t.tryAgain}
            </button>
            <button onClick={handleShowAnswer} className="bg-slate-800 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-700 transition-all shadow-sm">
              👁️ {t.showAnswer}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-slate-400 animate-pulse uppercase tracking-[0.3em]">
              {messages.length > 0 ? 'EVALUANDO...' : 'CONSULTANDO AL DIRECTOR...'}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-3 shrink-0">
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={error ? '...' : t.placeholder}
          disabled={awaitingCorrection || isLoading || !!error}
          className="flex-1 bg-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 font-medium"
        />
        <button 
          type="submit" 
          disabled={!userInput.trim() || isLoading || awaitingCorrection || !!error} 
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {t.send}
        </button>
      </form>
    </div>
  );
};

export default QuizProfessor;
