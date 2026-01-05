import React, { useState, useEffect } from 'react';
import { DailyTask, DayConfig } from '../types';
import { DAILY_ROUTINE_TEMPLATE, GOLDEN_RULE, DAYS_CONFIG } from '../constants';
import { getStoredTasks, saveTaskStatus } from '../services/storage';
import { CheckCircle2, Circle, Sun, BookOpen, Heart, Utensils, Wind, Loader2 } from 'lucide-react';

export const DailyView: React.FC = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dateStr = today.toISOString().split('T')[0];
  const dayConfig: DayConfig = DAYS_CONFIG[dayOfWeek];

  const [tasks, setTasks] = useState<DailyTask[]>(DAILY_ROUTINE_TEMPLATE);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const stored = await getStoredTasks(dateStr);
      setTasks(prev => prev.map(t => ({
        ...t,
        completed: stored[t.id] || false
      })));
      setLoading(false);
    };
    loadData();
  }, [dateStr]);

  const toggleTask = async (id: string) => {
    // 1. Optimistic Update (UI update immediately)
    const newTasks = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(newTasks);

    // 2. Persist to Firestore in background
    const task = newTasks.find(t => t.id === id);
    if (task) {
      await saveTaskStatus(dateStr, id, task.completed);
    }
  };

  // Helper for icons based on category
  const getIcon = (category: string) => {
    switch(category) {
      case 'fisiologia': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'trabajo': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'logistica': return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'vinculo': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'oxigenacion': return <Wind className="w-5 h-5 text-emerald-500" />;
      default: return <Circle className="w-5 h-5 text-stone-400" />;
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-stone-400 animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Sincronizando día...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header Context */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-serif italic text-stone-500">{today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <span className="text-xs font-bold px-2 py-1 bg-stone-200 text-stone-600 rounded-full uppercase tracking-wider">Hoy</span>
        </div>
        <div className={`p-6 rounded-2xl shadow-sm border ${dayConfig.color} transition-all duration-500`}>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-serif font-bold mb-1">{dayConfig.focus}</h1>
            <div className="opacity-50">{dayOfWeek === 0 || dayOfWeek === 6 ? <Sun /> : <BookOpen />}</div>
          </div>
          <p className="text-lg font-medium opacity-90 mb-3">"{dayConfig.mantra}"</p>
          <p className="text-sm opacity-80 leading-relaxed">{dayConfig.description}</p>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-stone-600">Progreso Diario</span>
          <span className="text-xl font-bold text-terra-500">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-terra-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Routine List */}
      <div className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-stone-800 px-1">Rutina de Activación</h2>
        {tasks.map((task, idx) => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`
              group flex items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none
              ${task.completed 
                ? 'bg-stone-50 border-stone-200 opacity-60' 
                : 'bg-white border-stone-100 shadow-sm hover:border-terra-200 hover:shadow-md hover:-translate-y-0.5'
              }
            `}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`mr-4 transition-transform duration-300 ${task.completed ? 'scale-110' : 'group-hover:scale-110'}`}>
              {task.completed 
                ? <CheckCircle2 className="w-6 h-6 text-terra-500" /> 
                : <Circle className="w-6 h-6 text-stone-300 group-hover:text-terra-300" />
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                {getIcon(task.category)}
                <span className={`text-xs font-bold uppercase tracking-wider ${task.completed ? 'text-stone-400' : 'text-stone-500'}`}>
                  {task.category}
                </span>
              </div>
              <p className={`font-medium ${task.completed ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                {task.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Golden Rule Footer */}
      <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
        <p className="text-sm text-orange-800 italic font-serif">
          "{GOLDEN_RULE}"
        </p>
      </div>
    </div>
  );
};