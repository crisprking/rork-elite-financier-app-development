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

interface Insight {
  id: string;
  title: string;
  confidence: number;
  content: string;
  type: 'forecast' | 'analysis' | 'recommendation' | 'prediction';
  color: string;
  icon: string;
}

const InsightsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { isPremium, aiBoostsRemaining, useAIBoost, purchaseAIBoost } = useSubscription();
  
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      title: 'Weekly Forecast',
      confidence: 85,
      content: 'Based on your current patterns, you have an 85% chance of completing all habits this week. Your morning routine shows the strongest consistency.',
      type: 'forecast',
      color: '#4CAF50',
      icon: 'trending-up',
    },
    {
      id: '2',
      title: 'Success Factor Analysis',
      confidence: 92,
      content: 'Your habit completion rate is 23% higher on days when you complete your morning meditation first. Consider prioritizing this habit.',
      type: 'analysis',
      color: '#FFD700',
      icon: 'target',
    },
    {
      id: '3',
      title: 'Personalized Recommendation',
      confidence: 78,
      content: 'Users with similar patterns find success by adding a 5-minute evening reflection habit. This could boost your overall consistency by 15%.',
      type: 'recommendation',
      color: '#00BCD4',
      icon: 'bulb',
    },
    {
      id: '4',
      title: 'Achievement Prediction',
      confidence: 89,
      content: 'You\'re on track to unlock the \'Consistency King\' achievement in 12 days if you maintain your current 7-day streak momentum.',
      type: 'prediction',
      color: '#F44336',
      icon: 'trophy',
    },
  ]);

  const handleGenerateInsight = () => {
    if (isPremium) {
      Alert.alert('AI Insight', 'Generating personalized insight...');
      return;
    }

    if (aiBoostsRemaining > 0) {
      const success = useAIBoost();
      if (success) {
        Alert.alert('AI Insight Generated', 'Your personalized insight has been added!');
        // Add new insight to the list
        const newInsight: Insight = {
          id: Date.now().toString(),
          title: 'New AI Insight',
          confidence: Math.floor(Math.random() * 30) + 70,
          content: 'This is a newly generated AI insight based on your current habits and patterns.',
          type: 'recommendation',
          color: '#9C27B0',
          icon: 'sparkles',
        };
        setInsights(prev => [newInsight, ...prev]);
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'forecast': return 'trending-up';
      case 'analysis': return 'analytics';
      case 'recommendation': return 'bulb';
      case 'prediction': return 'trophy';
      default: return 'sparkles';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>AI Insights</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Personalized coaching powered by AI
            </Text>
          </View>
        </View>

        {/* AI Boosts Section */}
        <View style={[styles.boostsCard, { backgroundColor: '#8B4513' }]}>
          <View style={styles.boostsHeader}>
            <Ionicons name="flash" size={24} color={colors.text} />
            <Text style={[styles.boostsTitle, { color: colors.text }]}>⚡ AI Boosts Available</Text>
          </View>
          <Text style={[styles.boostsCount, { color: colors.primary }]}>
            {isPremium ? 'Unlimited' : aiBoostsRemaining} / {isPremium ? '∞' : '50'}
          </Text>
          <Text style={[styles.boostsSubtext, { color: colors.textSecondary }]}>
            {isPremium ? 'Unlimited daily insights' : 'Unlimited daily insights'}
          </Text>
        </View>

        {/* Generate AI Insight Button */}
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: colors.primary }]}
          onPress={handleGenerateInsight}
        >
          <Ionicons name="bulb" size={20} color={colors.background} />
          <Text style={[styles.generateButtonText, { color: colors.background }]}>
            Generate AI Insight
          </Text>
        </TouchableOpacity>

        {/* Your Insights Section */}
        <View style={styles.insightsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Insights</Text>
          
          {insights.map((insight) => (
            <View
              key={insight.id}
              style={[
                styles.insightCard,
                { 
                  backgroundColor: colors.surface,
                  borderLeftColor: insight.color,
                }
              ]}
            >
              <View style={styles.insightHeader}>
                <View style={styles.insightTitleRow}>
                  <Ionicons 
                    name={getInsightIcon(insight.type) as any} 
                    size={20} 
                    color={insight.color} 
                  />
                  <Text style={[styles.insightTitle, { color: colors.text }]}>
                    {insight.title}
                  </Text>
                </View>
                <View style={[styles.confidenceBadge, { backgroundColor: insight.color }]}>
                  <Ionicons name="sparkles" size={12} color={colors.background} />
                  <Text style={[styles.confidenceText, { color: colors.background }]}>
                    {insight.confidence}% confidence
                  </Text>
                </View>
              </View>
              <Text style={[styles.insightContent, { color: colors.textSecondary }]}>
                {insight.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Premium Upgrade Prompt */}
        {!isPremium && (
          <View style={[styles.premiumCard, { backgroundColor: colors.primary }]}>
            <Ionicons name="crown" size={24} color={colors.background} />
            <View style={styles.premiumContent}>
              <Text style={[styles.premiumTitle, { color: colors.background }]}>
                Upgrade to Premium
              </Text>
              <Text style={[styles.premiumSubtext, { color: colors.background }]}>
                Get unlimited AI insights and advanced analytics
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: colors.background }]}
              onPress={() => {/* Handle premium upgrade */}}
            >
              <Text style={[styles.premiumButtonText, { color: colors.primary }]}>
                Upgrade
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  boostsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  boostsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  boostsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  boostsCount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  boostsSubtext: {
    fontSize: 14,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  insightsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  insightCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  insightContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  premiumContent: {
    flex: 1,
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  premiumSubtext: {
    fontSize: 14,
  },
  premiumButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InsightsScreen;

