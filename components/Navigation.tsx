import React from 'react';
import { Tab } from '../types';
import { LayoutDashboard, CalendarDays, Map, ClipboardCheck } from 'lucide-react';

interface Props {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation: React.FC<Props> = ({ currentTab, onTabChange }) => {
  const items = [
    { id: 'daily', label: 'Hoy', icon: <LayoutDashboard size={20} /> },
    { id: 'weekly', label: 'Semana', icon: <CalendarDays size={20} /> },
    { id: 'quarterly', label: 'Visión', icon: <Map size={20} /> },
    { id: 'checkin', label: 'Check-in', icon: <ClipboardCheck size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-50">
      <div className="flex justify-around items-end max-w-md mx-auto">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Tab)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-full
                ${isActive ? 'text-terra-600 -translate-y-2' : 'text-stone-400 hover:text-stone-600'}
              `}
            >
              <div className={`
                p-1.5 rounded-full mb-1 transition-all duration-300
                ${isActive ? 'bg-terra-50 ring-4 ring-white' : 'bg-transparent'}
              `}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};