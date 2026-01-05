import React from 'react';
import { DAYS_CONFIG } from '../constants';

export const WeeklyView: React.FC = () => {
  // Sort days: Monday (1) to Sunday (0)
  const sortedDays = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-800">El Ritmo Semanal</h1>
        <p className="text-stone-500 mt-2">Logística doméstica y estudio integrados.</p>
      </header>

      <div className="space-y-4">
        {sortedDays.map((dayNum, idx) => {
          const config = DAYS_CONFIG[dayNum];
          return (
            <div 
              key={dayNum}
              className={`
                relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:shadow-md
                bg-white border-stone-100
              `}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${config.color.split(' ')[0]}`} />
              
              <div className="pl-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-stone-800">{config.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.color.replace('border-', '')}`}>
                    {config.focus}
                  </span>
                </div>
                
                <p className="text-sm font-serif italic text-stone-600 mb-2">"{config.mantra}"</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {config.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-stone-100 rounded-xl">
        <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase">Guía Rápida Batch Cooking</h4>
        <ul className="text-sm text-stone-600 space-y-2 list-disc list-inside">
          <li><strong>Domingo (1.5h):</strong> Base (Arroz/Pasta), Proteína (Pollo/Huevos), Vegetales asados. Cubre Lun-Mié.</li>
          <li><strong>Miércoles (1h):</strong> Base (Puré/Sopa), Rápido (Pescado/Tortilla), Fruta. Cubre Jue-Vie.</li>
        </ul>
      </div>
    </div>
  );
};
