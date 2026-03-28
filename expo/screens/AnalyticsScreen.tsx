import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const AnalyticsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { isPremium } = useSubscription();

  const stats = {
    totalCompletions: 572,
    bestStreak: 35,
    activeHabits: 8,
    successRate: 238,
  };

  const habitStreaks = [
    { name: 'Read 30 Minutes', streak: 35, category: 'Learning' },
    { name: 'Healthy Breakfast', streak: 31, category: 'Health' },
    { name: 'Morning Meditation', streak: 28, category: 'Mindfulness' },
    { name: 'Journal Writing', streak: 22, category: 'Productivity' },
    { name: 'Drink 8 Glasses Water', streak: 19, category: 'Health' },
  ];

  const habitCategories = [
    { name: 'Learning', percentage: 25, color: '#FFD700' },
    { name: 'Health', percentage: 25, color: '#4CAF50' },
    { name: 'Fitness', percentage: 25, color: '#2196F3' },
    { name: 'Productivity', percentage: 13, color: '#00BCD4' },
    { name: 'Mindfulness', percentage: 13, color: '#F44336' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Track your transformation journey
            </Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
            <Text style={[styles.shareText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#8B4513' }]}>
            <Ionicons name="trophy" size={24} color={colors.text} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.totalCompletions}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Total Completions</Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>Habits completed</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#8B0000' }]}>
            <Ionicons name="flame" size={24} color={colors.text} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.bestStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Best Streak</Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>Days in a row</Text>
            <TouchableOpacity style={styles.cardShareButton}>
              <Ionicons name="share-outline" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#006400' }]}>
            <Ionicons name="target" size={24} color={colors.text} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.activeHabits}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Active Habits</Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
              {isPremium ? 'Unlimited' : 'Free tier'}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#4682B4' }]}>
            <Ionicons name="trending-up" size={24} color={colors.text} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.successRate}%</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Success Rate</Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>Last 30 days</Text>
          </View>
        </View>

        {/* 7-Day Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>7-Day Progress</Text>
          <View style={[styles.progressChart, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartPlaceholder, { color: colors.textSecondary }]}>
              📊 Progress chart will be displayed here
            </Text>
          </View>
        </View>

        {/* Top Habit Streaks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Habit Streaks</Text>
          <View style={styles.streaksContainer}>
            {habitStreaks.map((habit, index) => (
              <View key={index} style={styles.streakItem}>
                <View style={styles.streakBarContainer}>
                  <View
                    style={[
                      styles.streakBar,
                      {
                        height: (habit.streak / 35) * 100,
                        backgroundColor: colors.primary,
                      }
                    ]}
                  />
                </View>
                <View style={styles.streakInfo}>
                  <Text style={[styles.streakNumber, { color: colors.text }]}>{habit.streak}</Text>
                  <Text style={[styles.streakName, { color: colors.textSecondary }]}>
                    {habit.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Habit Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Categories</Text>
          <View style={styles.categoriesContainer}>
            <View style={styles.pieChart}>
              <Text style={[styles.pieChartText, { color: colors.textSecondary }]}>
                📊 Pie Chart
              </Text>
            </View>
            <View style={styles.legend}>
              {habitCategories.map((category, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: category.color }
                    ]}
                  />
                  <Text style={[styles.legendText, { color: colors.text }]}>
                    {category.percentage}% {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  shareText: {
    fontSize: 14,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    position: 'relative',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  cardShareButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressChart: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: 16,
  },
  streaksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  streakBarContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  streakBar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  streakName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  pieChartText: {
    fontSize: 14,
  },
  legend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});

export default AnalyticsScreen;

