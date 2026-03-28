import { Achievement } from '../types/habit';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Created your first habit',
    icon: 'target',
    color: '#00BCD4',
    unlocked: false,
  },
  {
    id: 'habit_master',
    title: 'Habit Master',
    description: 'Created 6+ habits',
    icon: 'crown',
    color: '#FFD700',
    unlocked: false,
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: '7-day streak achieved',
    icon: 'flame',
    color: '#F44336',
    unlocked: false,
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: '30-day streak achieved',
    icon: 'trophy',
    color: '#4CAF50',
    unlocked: false,
  },
  {
    id: 'ai_enthusiast',
    title: 'AI Enthusiast',
    description: 'Used 10 AI insights',
    icon: 'bulb',
    color: '#9C27B0',
    unlocked: false,
  },
  {
    id: 'premium_member',
    title: 'Premium Member',
    description: 'Upgraded to premium',
    icon: 'diamond',
    color: '#FFD700',
    unlocked: false,
  },
  {
    id: 'streak_legend',
    title: 'Streak Legend',
    description: '100-day streak achieved',
    icon: 'star',
    color: '#FF6B6B',
    unlocked: false,
  },
  {
    id: 'habit_guru',
    title: 'Habit Guru',
    description: 'Completed 1000 habits',
    icon: 'medal',
    color: '#4CAF50',
    unlocked: false,
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

export const getUnlockedAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.unlocked);
};

export const getLockedAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => !achievement.unlocked);
};

