import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, Target, TrendingUp, Star, Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BRAND_COLORS, ENGAGEMENT_ELEMENTS } from '@/constants/branding';
import FinSageLogo from './FinSageLogo';
import { typography, spacing, borderRadius } from '@/constants/colors';

interface ViralEngagementProps {
  calculationsCount: number;
  streakDays: number;
  onStreakTap?: () => void;
  onAchievementTap?: () => void;
  testID?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const ViralEngagement: React.FC<ViralEngagementProps> = ({
  calculationsCount,
  streakDays,
  onStreakTap,
  onAchievementTap,
  testID
}) => {
  const { colors: themeColors } = useTheme();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showCelebration, setShowCelebration] = useState(false);

  const achievements = useMemo<Achievement[]>(() => [
    {
      id: 'first_calc',
      title: 'First Steps',
      description: 'Complete your first calculation',
      icon: <Target size={16} color={BRAND_COLORS.success} />,
      unlocked: calculationsCount >= 1,
      progress: Math.min(calculationsCount, 1),
      maxProgress: 1
    },
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: '3-day financial wisdom streak',
      icon: <Flame size={16} color={BRAND_COLORS.premium} />,
      unlocked: streakDays >= 3,
      progress: Math.min(streakDays, 3),
      maxProgress: 3
    },
    {
      id: 'calc_master',
      title: 'Calculator Master',
      description: 'Complete 10 calculations',
      icon: <Trophy size={16} color={BRAND_COLORS.trust} />,
      unlocked: calculationsCount >= 10,
      progress: Math.min(calculationsCount, 10),
      maxProgress: 10
    },
    {
      id: 'streak_week',
      title: 'Wisdom Warrior',
      description: '7-day streak champion',
      icon: <Star size={16} color={BRAND_COLORS.premium} />,
      unlocked: streakDays >= 7,
      progress: Math.min(streakDays, 7),
      maxProgress: 7
    }
  ], [calculationsCount, streakDays]);

  useEffect(() => {
    if (streakDays > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [streakDays, pulseAnim]);

  useEffect(() => {
    const newlyUnlocked = achievements.filter(a => a.unlocked && a.progress === a.maxProgress);
    if (newlyUnlocked.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [calculationsCount, streakDays, achievements]);

  const getStreakMessage = () => {
    if (streakDays === 0) return ENGAGEMENT_ELEMENTS.streaks.messages.start;
    if (streakDays === 1) return 'Great start! Keep building wealth! 💪';
    if (streakDays < 7) return `${streakDays} days strong! ${ENGAGEMENT_ELEMENTS.streaks.messages.maintain}`;
    if (streakDays < 30) return `${streakDays} days of wisdom! You're becoming a financial genius! 🏆`;
    return `${streakDays} days - ${ENGAGEMENT_ELEMENTS.streaks.messages.celebrate}`;
  };

  const getMotivationalQuote = () => {
    const quotes = [
      'Every calculation brings you closer to financial freedom 💰',
      'Small steps today, millionaire mindset tomorrow 🚀',
      'Your future wealthy self will thank you 🙏',
      'Building generational wealth, one decision at a time 💎',
      'Financial wisdom is your superpower - use it! ⚡',
      'You\'re not just calculating - you\'re transforming your life 🌟',
      'Smart money moves = smart life moves 🧠',
      'Every expert was once a beginner - keep going! 💪'
    ];
    return quotes[calculationsCount % quotes.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface.secondary }]} testID={testID}>
      {/* Streak Counter */}
      <TouchableOpacity onPress={onStreakTap} style={styles.streakContainer}>
        <LinearGradient
          colors={streakDays > 0 ? [BRAND_COLORS.premium, BRAND_COLORS.premiumDark] : ['#E5E7EB', '#D1D5DB']}
          style={styles.streakGradient}
        >
          <Animated.View style={[styles.streakContent, { transform: [{ scale: pulseAnim }] }]}>
            <Flame size={20} color={streakDays > 0 ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.streakNumber, { color: streakDays > 0 ? '#FFFFFF' : '#9CA3AF' }]}>
              {streakDays}
            </Text>
          </Animated.View>
        </LinearGradient>
        <Text style={[styles.streakText, { color: themeColors.text.secondary }]}>
          {getStreakMessage()}
        </Text>
      </TouchableOpacity>

      {/* Progress Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: themeColors.surface.tertiary }]}>
          <TrendingUp size={16} color={BRAND_COLORS.success} />
          <Text style={[styles.statNumber, { color: themeColors.text.primary }]}>{calculationsCount}</Text>
          <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Calculations</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: themeColors.surface.tertiary }]}>
          <Zap size={16} color={BRAND_COLORS.trust} />
          <Text style={[styles.statNumber, { color: themeColors.text.primary }]}>
            {achievements.filter(a => a.unlocked).length}
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Achievements</Text>
        </View>
      </View>

      {/* Achievements Preview */}
      <TouchableOpacity onPress={onAchievementTap} style={styles.achievementsContainer}>
        <Text style={[styles.achievementsTitle, { color: themeColors.text.primary }]}>Recent Achievements</Text>
        <View style={styles.achievementsList}>
          {achievements.slice(0, 2).map((achievement) => (
            <View key={achievement.id} style={[styles.achievementItem, { 
              backgroundColor: achievement.unlocked ? 'rgba(0, 230, 122, 0.1)' : 'rgba(156, 163, 175, 0.1)'
            }]}>
              {achievement.icon}
              <View style={styles.achievementContent}>
                <Text style={[styles.achievementTitle, { 
                  color: achievement.unlocked ? themeColors.text.primary : themeColors.text.tertiary 
                }]}>
                  {achievement.title}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    backgroundColor: achievement.unlocked ? BRAND_COLORS.success : BRAND_COLORS.premium
                  }]} />
                </View>
              </View>
              {achievement.unlocked && (
                <Star size={12} color={BRAND_COLORS.premium} fill={BRAND_COLORS.premium} />
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {/* Motivational Quote */}
      <View style={[styles.quoteContainer, { backgroundColor: themeColors.surface.tertiary }]}>
        <FinSageLogo variant="icon" size="small" animated={true} testID="quote-logo" />
        <Text style={[styles.quote, { color: themeColors.text.secondary }]}>
          {getMotivationalQuote()}
        </Text>
      </View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.9)', 'rgba(217, 119, 6, 0.9)']}
            style={styles.celebrationGradient}
          >
            <Trophy size={32} color="#FFFFFF" />
            <Text style={styles.celebrationText}>Achievement Unlocked! 🎉</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    marginVertical: spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  streakGradient: {
    borderRadius: borderRadius.full,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  streakNumber: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  streakText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    gap: spacing[1],
  },
  statNumber: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  achievementsContainer: {
    marginBottom: spacing[4],
  },
  achievementsTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[2],
  },
  achievementsList: {
    gap: spacing[2],
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginBottom: spacing[1],
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
  },
  quote: {
    flex: 1,
    fontSize: typography.size.sm,
    fontStyle: 'italic',
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  celebrationGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  celebrationText: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
});

export default ViralEngagement;