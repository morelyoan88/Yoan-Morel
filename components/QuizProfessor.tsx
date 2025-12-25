
import React, { useState, useEffect, useRef } from 'react';
import { QuizCategory, QuizMessage } from '../types';
import { generateQuestion, evaluateAnswer } from '../services/geminiService';

interface Props {
  category: QuizCategory;
  onReset: () => void;
}

const QuizProfessor: React.FC<Props> = ({ category, onReset }) => {
  const [messages, setMessages] = useState<QuizMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initQuiz = async () => {
    setIsLoading(true);
    try {
      const q = await generateQuestion(category);
      setMessages([{ role: 'professor', content: q }]);
    } catch (err) {
      setMessages([{ role: 'professor', content: "I seem to be having trouble remembering the menu. Can we restart?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const currentQuestion = [...messages].reverse().find(m => m.role === 'professor')?.content || "";
    const userMsg: QuizMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);

    try {
      const evaluation = await evaluateAnswer(category, currentQuestion, userMsg.content);
      const feedbackMsg: QuizMessage = { 
        role: 'professor', 
        content: evaluation.feedback,
        isCorrect: evaluation.isCorrect
      };
      
      if (evaluation.isCorrect) setScore(s => s + 1);
      
      setMessages(prev => [...prev, feedbackMsg]);

      // Trigger next question after a brief delay
      setTimeout(async () => {
        setIsLoading(true);
        const nextQ = await generateQuestion(category);
        setMessages(prev => [...prev, { role: 'professor', content: nextQ }]);
        setIsLoading(false);
      }, 1500);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'professor', content: "Something went wrong. Let's try another question." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Category</span>
          <h2 className="text-lg font-bold">{category} Manual</h2>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Current Score</span>
          <p className="text-xl font-bold text-yellow-500">{score}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : m.isCorrect === true 
                  ? 'bg-green-100 border border-green-200 text-green-900'
                  : m.isCorrect === false
                    ? 'bg-red-100 border border-red-200 text-red-900'
                    : 'bg-white border border-slate-200 text-slate-800'
            }`}>
              {m.role === 'professor' && <p className="text-[10px] uppercase font-bold mb-1 opacity-60">Manager</p>}
              <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 animate-pulse flex space-x-2 items-center">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
        <button 
          type="button"
          onClick={onReset}
          className="bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default QuizProfessor;
