export type Tab = 'daily' | 'weekly' | 'quarterly' | 'checkin';

export interface DailyTask {
  id: string;
  text: string;
  category: 'fisiologia' | 'trabajo' | 'logistica' | 'oxigenacion' | 'vinculo';
  completed: boolean;
}

export interface DayConfig {
  name: string;
  focus: string;
  mantra: string;
  description: string;
  color: string;
}

export interface QuarterConfig {
  id: string;
  name: string;
  months: string;
  focus: string;
  goals: string[];
  habits: string[];
}

export interface CheckInArea {
  id: string;
  name: string;
  question: string;
  score: number; // 0 (unanswered), 1 (red), 2 (yellow), 3 (green)
}

export interface CheckInLog {
  date: string;
  scores: Record<string, number>; // areaId -> score
  note?: string;
}
