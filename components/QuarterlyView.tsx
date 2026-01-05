import React from 'react';
import { QUARTERS } from '../constants';
import { Target, Leaf, Sprout, HeartHandshake } from 'lucide-react';

export const QuarterlyView: React.FC = () => {
  const currentMonth = new Date().getMonth(); // 0-11
  // Determine current quarter roughly
  let currentQ = 'Q1';
  if (currentMonth >= 3 && currentMonth <= 5) currentQ = 'Q2';
  if (currentMonth >= 6 && currentMonth <= 8) currentQ = 'Q3';
  if (currentMonth >= 9) currentQ = 'Q4';

  const getIcon = (id: string) => {
    switch(id) {
      case 'Q1': return <Sprout className="w-5 h-5" />;
      case 'Q2': return <Target className="w-5 h-5" />;
      case 'Q3': return <Leaf className="w-5 h-5" />;
      case 'Q4': return <HeartHandshake className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-800">Visión Macro</h1>
        <p className="text-stone-500 mt-2">El foco cambia según la estación, pero la base de salud se mantiene.</p>
      </header>

      <div className="space-y-8">
        {QUARTERS.map((q, idx) => {
          const isCurrent = q.id === currentQ;
          return (
            <div 
              key={q.id} 
              className={`
                relative p-6 rounded-2xl border transition-all duration-300
                ${isCurrent ? 'bg-white border-terra-300 shadow-md ring-1 ring-terra-100' : 'bg-stone-50 border-stone-200 opacity-90 grayscale-[0.3] hover:grayscale-0 hover:bg-white'}
              `}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-6 bg-terra-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Estación Actual
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${isCurrent ? 'bg-terra-100 text-terra-700' : 'bg-stone-200 text-stone-600'}`}>
                  {getIcon(q.id)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800">{q.focus}</h2>
                  <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">{q.name}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Objetivos Clave</h3>
                  <ul className="space-y-2">
                    {q.goals.map((g, i) => (
                      <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-stone-400 flex-shrink-0" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Hábitos a Consolidar</h3>
                  <div className="flex flex-wrap gap-2">
                    {q.habits.map((h, i) => (
                      <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md border border-stone-200">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
