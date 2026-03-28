import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completed: boolean;
  category: string;
}

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { isPremium, aiBoostsRemaining, useAIBoost, purchaseAIBoost } = useSubscription();
  
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Meditation',
      emoji: '🧘‍♂️',
      streak: 28,
      completed: true,
      category: 'Mindfulness',
    },
    {
      id: '2',
      name: 'Gym Workout',
      emoji: '💪',
      streak: 12,
      completed: false,
      category: 'Fitness',
    },
    {
      id: '3',
      name: 'Read 30 Minutes',
      emoji: '📚',
      streak: 35,
      completed: true,
      category: 'Learning',
    },
    {
      id: '4',
      name: 'Drink 8 Glasses Water',
      emoji: '💧',
      streak: 19,
      completed: true,
      category: 'Health',
    },
    {
      id: '5',
      name: 'Journal Writing',
      emoji: '✍️',
      streak: 22,
      completed: true,
      category: 'Productivity',
    },
    {
      id: '6',
      name: 'Learn Spanish',
      emoji: '🇪🇸',
      streak: 7,
      completed: false,
      category: 'Learning',
    },
    {
      id: '7',
      name: 'Evening Walk',
      emoji: '🚶‍♂️',
      streak: 14,
      completed: true,
      category: 'Health',
    },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed, streak: !habit.completed ? habit.streak + 1 : habit.streak }
        : habit
    ));
  };

  const handleAIBoost = () => {
    if (isPremium) {
      Alert.alert('AI Boost', 'You have unlimited AI insights with Premium!');
      return;
    }

    if (aiBoostsRemaining > 0) {
      const success = useAIBoost();
      if (success) {
        Alert.alert('AI Boost Used', 'Generating personalized insight...');
      }
    } else {
      Alert.alert(
        'No AI Boosts Left',
        'You have used all your free AI boosts. Purchase more to continue getting personalized insights.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseAIBoost() },
        ]
      );
    }
  };

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: colors.text }]}>Luna Rising</Text>
            <Text style={[styles.userName, { color: colors.textSecondary }]}>Alex Chen</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{completedToday}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalHabits}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {Math.round((completedToday / totalHabits) * 100)}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.quoteText, { color: colors.text }]}>
            "In the depth of winter, I finally learned that within me there lay an invincible summer."
          </Text>
          <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>- Albert Camus</Text>
        </View>

        {/* Habits List */}
        <View style={styles.habitsSection}>
          <View style={styles.habitsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Habits</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={20} color={colors.background} />
            </TouchableOpacity>
          </View>

          {habits.map((habit) => (
            <View
              key={habit.id}
              style={[
                styles.habitCard,
                { 
                  backgroundColor: colors.surface,
                  borderColor: habit.completed ? colors.success : colors.border,
                }
              ]}
            >
              <View style={styles.habitLeft}>
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <View>
                  <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
                  <Text style={[styles.habitStreak, { color: colors.textSecondary }]}>
                    🔥 {habit.streak} day streak
                  </Text>
                </View>
              </View>
              <View style={styles.habitRight}>
                <TouchableOpacity style={styles.shareButton}>
                  <Ionicons name="share-outline" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    { 
                      backgroundColor: habit.completed ? colors.success : 'transparent',
                      borderColor: habit.completed ? colors.success : colors.textSecondary,
                    }
                  ]}
                  onPress={() => toggleHabit(habit.id)}
                >
                  {habit.completed && <Ionicons name="checkmark" size={16} color={colors.background} />}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* AI Boost Button */}
        <TouchableOpacity
          style={[styles.aiBoostButton, { backgroundColor: colors.primary }]}
          onPress={handleAIBoost}
        >
          <Ionicons name="flash" size={20} color={colors.background} />
          <Text style={[styles.aiBoostText, { color: colors.background }]}>
            AI Boost ({isPremium ? 'Unlimited' : `${aiBoostsRemaining} left`})
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="bar-chart-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="target-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>
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
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
  },
  progressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  quoteCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
  },
  habitsSection: {
    marginBottom: 20,
  },
  habitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitStreak: {
    fontSize: 14,
    marginTop: 2,
  },
  habitRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  aiBoostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  aiBoostText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default HomeScreen;

