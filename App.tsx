import React, { useState } from 'react';
import { Tab } from './types';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { QuarterlyView } from './components/QuarterlyView';
import { CheckInView } from './components/CheckInView';
import { Navigation } from './components/Navigation';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  return (
    <div className="min-h-screen font-sans bg-warm-50 text-warm-800 selection:bg-terra-200">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative border-x border-stone-100">
        
        {/* Main Content Area */}
        <main className="p-6 h-full overflow-y-auto">
          {activeTab === 'daily' && <DailyView />}
          {activeTab === 'weekly' && <WeeklyView />}
          {activeTab === 'quarterly' && <QuarterlyView />}
          {activeTab === 'checkin' && <CheckInView />}
        </main>

        {/* Floating Gradient for Bottom Nav transition */}
        <div className="fixed bottom-[70px] left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10 max-w-md mx-auto" />

        <Navigation currentTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
