export interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completed: boolean;
  category: string;
  createdAt: Date;
  lastCompleted?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Insight {
  id: string;
  title: string;
  confidence: number;
  content: string;
  type: 'forecast' | 'analysis' | 'recommendation' | 'prediction';
  color: string;
  icon: string;
  createdAt: Date;
}

export interface ProgressStats {
  totalCompletions: number;
  bestStreak: number;
  activeHabits: number;
  successRate: number;
  completedToday: number;
  totalHabits: number;
}

export interface HabitCategory {
  name: string;
  percentage: number;
  color: string;
  habits: Habit[];
}

