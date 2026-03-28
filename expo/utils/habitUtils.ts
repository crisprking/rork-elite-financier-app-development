import { Habit, ProgressStats, HabitCategory } from '../types/habit';

export const calculateProgressStats = (habits: Habit[]): ProgressStats => {
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const bestStreak = Math.max(...habits.map(habit => habit.streak), 0);
  const activeHabits = habits.length;
  const completedToday = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const successRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return {
    totalCompletions,
    bestStreak,
    activeHabits,
    successRate,
    completedToday,
    totalHabits,
  };
};

export const groupHabitsByCategory = (habits: Habit[]): HabitCategory[] => {
  const categoryMap = new Map<string, Habit[]>();
  
  habits.forEach(habit => {
    if (!categoryMap.has(habit.category)) {
      categoryMap.set(habit.category, []);
    }
    categoryMap.get(habit.category)!.push(habit);
  });

  const categories: HabitCategory[] = [];
  const totalHabits = habits.length;

  categoryMap.forEach((habits, categoryName) => {
    const percentage = totalHabits > 0 ? Math.round((habits.length / totalHabits) * 100) : 0;
    const color = getCategoryColor(categoryName);
    
    categories.push({
      name: categoryName,
      percentage,
      color,
      habits,
    });
  });

  return categories.sort((a, b) => b.percentage - a.percentage);
};

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Learning': '#FFD700',
    'Health': '#4CAF50',
    'Fitness': '#2196F3',
    'Productivity': '#00BCD4',
    'Mindfulness': '#F44336',
    'Work': '#9C27B0',
    'Personal': '#FF9800',
    'Social': '#795548',
  };
  
  return colors[category] || '#666666';
};

export const getHabitEmoji = (category: string): string => {
  const emojis: { [key: string]: string } = {
    'Learning': '📚',
    'Health': '💧',
    'Fitness': '💪',
    'Productivity': '✍️',
    'Mindfulness': '🧘‍♂️',
    'Work': '💼',
    'Personal': '👤',
    'Social': '👥',
  };
  
  return emojis[category] || '⭐';
};

export const generateMotivationalQuote = (): string => {
  const quotes = [
    "In the depth of winter, I finally learned that within me there lay an invincible summer. - Albert Camus",
    "The secret of getting ahead is getting started. - Mark Twain",
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const calculateStreak = (lastCompleted: Date | undefined, completed: boolean): number => {
  if (!completed) return 0;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastCompletedDate = lastCompleted ? new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()) : null;
  
  if (!lastCompletedDate) return 1;
  
  const diffTime = today.getTime() - lastCompletedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1 ? 1 : 0; // Simple streak calculation
};

export const shouldShowCelebration = (habit: Habit): boolean => {
  // Show celebration for milestone streaks
  const milestones = [7, 14, 30, 50, 100];
  return milestones.includes(habit.streak);
};

