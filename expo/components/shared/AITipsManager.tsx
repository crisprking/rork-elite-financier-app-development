import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Heart, Share2, Bookmark, MessageCircle, TrendingUp, DollarSign, X, Copy, Check } from 'lucide-react-native';
import FinSageLogo from './FinSageLogo';
import { useTheme } from '@/contexts/ThemeContext';
import { useHasPremiumAccess, useSubscription } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography, spacing, borderRadius } from '@/constants/colors';

type ContentPart = { type: 'text'; text: string } | { type: 'image'; image: string };
type CoreMessage = { role: 'system' | 'user' | 'assistant'; content: string | ContentPart[] };

interface AITipsManagerProps {
  visible: boolean;
  onClose: () => void;
  initialAdvice: string;
  calculatorType: 'mortgage' | 'car-loan';
  calculationData: any;
  testID?: string;
}

interface SavedTip {
  id: string;
  advice: string;
  timestamp: number;
  calculatorType: string;
  liked: boolean;
}

export default function AITipsManager({
  visible,
  onClose,
  initialAdvice,
  calculatorType,
  calculationData,
  testID
}: AITipsManagerProps) {
  const { colors: themeColors } = useTheme();
  const hasPremiumAccess = useHasPremiumAccess();
  const { canUseAI, recordAIUse, getAIRemaining, aiDailyCount, aiDailyLimit } = useSubscription();
  const [currentAdvice, setCurrentAdvice] = useState<string>(initialAdvice);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [, setConversationHistory] = useState<CoreMessage[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    console.log('AI tip liked - engagement metric');
  }, [isLiked]);

  const handleSave = useCallback(async () => {
    try {
      const gate = await canUseAI(1);
      if (!gate.allowed) {
        Alert.alert('FinSage Pro Required', gate.reason ?? 'Upgrade to FinSage Pro to continue.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
        ]);
        return;
      }

      const savedTip: SavedTip = {
        id: Date.now().toString(),
        advice: currentAdvice,
        timestamp: Date.now(),
        calculatorType,
        liked: isLiked
      };

      const key = '@finsage_saved_tips';
      const existingRaw = await AsyncStorage.getItem(key);
      const existing: SavedTip[] = existingRaw ? (JSON.parse(existingRaw) as SavedTip[]) : [];
      const next = [savedTip, ...existing].slice(0, 200);
      await AsyncStorage.setItem(key, JSON.stringify(next));

      await recordAIUse(1);
      setIsSaved(true);
      Alert.alert('Saved', 'AI tip saved to your library.');
    } catch {
      Alert.alert('Error', 'Could not save tip.');
    }
  }, [currentAdvice, calculatorType, isLiked, canUseAI, recordAIUse]);

  const handleShare = useCallback(async () => {
    try {
      const shareContent = `FinSage AI Insight:\n\n${currentAdvice}`;
      if (Platform.OS === 'web') {
        try {
          if (typeof navigator !== 'undefined' && 'share' in navigator && (navigator as any).canShare) {
            await (navigator as any).share({ title: 'FinSage AI Tip', text: shareContent });
          } else if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareContent);
            Alert.alert('Copied', 'Advice copied to clipboard');
          } else {
            Alert.alert('Share Unavailable', 'Press Cmd/Ctrl+C to copy.');
          }
        } catch (err: any) {
          if (err.name === 'NotAllowedError') {
            try {
              await navigator.clipboard.writeText(shareContent);
              Alert.alert('Copied', 'Advice copied to clipboard');
            } catch {
              Alert.alert('Copy to Clipboard', shareContent);
            }
          } else {
            Alert.alert('Copy to Clipboard', shareContent);
          }
        }
      } else {
        await Share.share({ message: shareContent, title: 'FinSage AI Tip' });
      }
      console.log('AI tip shared - viral metric');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [currentAdvice]);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(currentAdvice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentAdvice]);

  const askFollowUp = useCallback(async (question: string) => {
    const gate = await canUseAI(1);
    if (!gate.allowed) {
      Alert.alert(
        'FinSage Pro Required',
        gate.reason ?? 'Daily AI limit reached. Upgrade for unlimited.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
        ]
      );
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      setIsLoading(true);

      const messages: CoreMessage[] = [
        { role: 'system', content: 'You are a helpful, concise financial assistant. Keep answers to 3-5 tight bullets. Avoid fluff.' },
        { role: 'user', content: `Previous advice: ${currentAdvice}\n\nFollow-up question: ${question}\n\nCalculator data: ${JSON.stringify(calculationData)}` }
      ];
      
      const res = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      
      if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
      const json = await res.json();
      const text = (json?.completion as string) ?? '';
      
      setCurrentAdvice(text);
      setConversationHistory(prev => [...prev, ...messages, { role: 'assistant', content: text }]);
      await recordAIUse(1);
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        Alert.alert('Timeout', 'AI response took too long. Please try again.');
      } else {
        Alert.alert('Error', 'Unable to get follow-up advice. Please try again.');
      }
      console.error('Follow-up AI error:', error?.message ?? error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [currentAdvice, calculationData, canUseAI, recordAIUse]);

  const quickQuestions = useMemo(() => [
    'Top 3 actions to lower payment',
    'Key risks to watch',
    'Tax implications?',
    'Better alternatives?'
  ], []);

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
      <View style={[styles.container, { backgroundColor: themeColors.surface.primary }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.aiIcon, { backgroundColor: 'rgba(0, 230, 122, 0.1)' }]}>
                <Sparkles size={20} color="#00E67A" />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>AI Financial Advisor</Text>
                <Text style={[styles.headerSubtitle, { color: themeColors.text.secondary }]}>Personalized insights</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={themeColors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.adviceCard, { backgroundColor: themeColors.surface.secondary }]}>
            <LinearGradient
              colors={['rgba(0, 230, 122, 0.05)', 'rgba(0, 230, 122, 0.02)']}
              style={styles.adviceGradient}
            >
              <Text style={[styles.adviceText, { color: themeColors.text.primary }]}>
                {currentAdvice}
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity 
              onPress={handleLike} 
              style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            >
              <Heart size={18} color={isLiked ? '#FF6B6B' : themeColors.text.tertiary} fill={isLiked ? '#FF6B6B' : 'none'} />
              <Text style={[styles.actionText, { color: isLiked ? '#FF6B6B' : themeColors.text.tertiary }]}>Like</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSave} style={[styles.actionButton, isSaved && styles.actionButtonActive]}>
              <Bookmark size={18} color={isSaved ? '#F59E0B' : themeColors.text.tertiary} fill={isSaved ? '#F59E0B' : 'none'} />
              <Text style={[styles.actionText, { color: isSaved ? '#F59E0B' : themeColors.text.tertiary }]}>Save</Text>
              {!hasPremiumAccess && getAIRemaining() <= 0 && (
                <FinSageLogo variant="icon" size="small" premium={true} testID="save-premium-indicator" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Share2 size={18} color={themeColors.text.tertiary} />
              <Text style={[styles.actionText, { color: themeColors.text.tertiary }]}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
              {copied ? (
                <Check size={18} color="#10B981" />
              ) : (
                <Copy size={18} color={themeColors.text.tertiary} />
              )}
              <Text style={[styles.actionText, { color: copied ? '#10B981' : themeColors.text.tertiary }]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickQuestionsSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Ask Follow-up Questions</Text>
            <View style={styles.quickQuestions}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => askFollowUp(question)}
                  style={[styles.quickQuestionButton, { backgroundColor: themeColors.surface.tertiary }]}
                  disabled={isLoading}
                >
                  <MessageCircle size={14} color="#00E67A" />
                  <Text style={[styles.quickQuestionText, { color: themeColors.text.secondary }]}>{question}</Text>
                  {!hasPremiumAccess && getAIRemaining() <= 0 && (
                    <FinSageLogo variant="icon" size="small" premium={true} testID="question-premium-indicator" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {!hasPremiumAccess && (
            <View style={styles.premiumUpsell}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.premiumGradient}
              >
                <FinSageLogo variant="icon" size="medium" premium={true} testID="premium-upsell-logo" />
                <View style={styles.premiumContent}>
                  <Text style={styles.premiumTitle}>Unlock FinSage Pro Intelligence</Text>
                  <Text style={styles.premiumSubtitle}>
                    • Unlimited AI conversations{'\n'}• Save your financial wisdom library{'\n'}• Advanced investment strategies{'\n'}• Priority AI responses{'\n'}• Professional financial reports
                  </Text>
                  <TouchableOpacity
                    style={styles.premiumButton}
                    onPress={() => {
                      onClose();
                      router.push('/paywall');
                    }}
                  >
                    <Text style={styles.premiumButtonText}>Upgrade to Pro</Text>
                    <TrendingUp size={16} color="#000" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {!hasPremiumAccess && (
            <View style={[styles.usageCounter, { backgroundColor: themeColors.surface.tertiary }]}>
              <DollarSign size={16} color={themeColors.text.tertiary} />
              <Text style={[styles.usageText, { color: themeColors.text.tertiary }]} testID="ai-usage-counter">
                {aiDailyCount}/{aiDailyLimit} free AI interactions used today
              </Text>
            </View>
          )}
        </ScrollView>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00E67A" />
            <Text style={[styles.loadingText, { color: themeColors.text.primary }]}>Getting AI insights...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: borderRadius['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 230, 122, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    lineHeight: typography.size.lg * typography.lineHeight.tight,
  },
  headerSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    opacity: 0.7,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceCard: {
    margin: spacing[5],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  adviceGradient: {
    padding: spacing[5],
  },
  adviceText: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    fontWeight: typography.weight.medium,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[5],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(0, 230, 122, 0.1)',
  },
  actionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  quickQuestionsSection: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[5],
  },
  sectionTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[3],
  },
  quickQuestions: {
    gap: spacing[2],
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  quickQuestionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
  premiumUpsell: {
    margin: spacing[5],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: spacing[5],
    alignItems: 'center',
  },
  premiumContent: {
    alignItems: 'center',
    marginTop: spacing[3],
  },
  premiumTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: typography.size.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.lg,
  },
  premiumButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: '#000000',
  },
  usageCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    margin: spacing[5],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  usageText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    borderRadius: borderRadius['2xl'],
  },
  loadingText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
});