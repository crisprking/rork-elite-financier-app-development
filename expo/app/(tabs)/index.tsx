import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Car, Crown, ArrowRight, Calculator, Settings, CheckCircle2, Share2 } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/colors';
import { APP_NAME, TAGLINE, MASCOT_URL } from '@/constants/branding';
import { useSubscription, useSubscriptionStatusText, useHasPremiumAccess } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SimpleThemeToggle } from '@/components/shared/ThemeToggle';

export default function WelcomeScreen() {
  const { isPro, isTrialActive } = useSubscription();
  const statusText = useSubscriptionStatusText();
  const hasPremiumAccess = useHasPremiumAccess();
  const { colors: themeColors, isDark } = useTheme();

  const handleStartTrial = () => {
    router.push('/paywall');
  };

  const handleCalculatorPress = (type: 'mortgage' | 'car-loan') => {
    router.push(`/(tabs)/${type}` as const);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: themeColors.surface.primary, borderBottomColor: themeColors.border.light }]}>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={[styles.settingsButton, { backgroundColor: themeColors.surface.secondary }]}
          activeOpacity={0.7}
          testID="settings-button"
        >
          <Settings size={20} color={themeColors.text.secondary} strokeWidth={2} />
        </TouchableOpacity>
        <SimpleThemeToggle style={styles.themeToggle} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} testID="home-scroll">
        {/* Header */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isDark ? 'rgba(0, 230, 122, 0.1)' : 'rgba(0, 230, 122, 0.08)',
                borderColor: isDark ? 'rgba(0, 230, 122, 0.3)' : 'rgba(0, 230, 122, 0.2)'
              }
            ]}
          >
            <Calculator size={16} color="#00E67A" />
            <Text style={[styles.statusText, { color: '#00E67A' }]}>{statusText}</Text>
          </View>

          <View style={styles.brandContainer}>
            <View
              style={[
                styles.logoBackdrop,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 100,
                  padding: 24,
                  shadowColor: isDark ? '#00E67A' : '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: isDark ? 0.3 : 0.15,
                  shadowRadius: 16,
                  elevation: 12,
                  borderWidth: 2,
                  borderColor: isDark ? 'rgba(0, 230, 122, 0.2)' : 'rgba(0, 0, 0, 0.05)'
                }
              ]}
            >
              <SageMascot size={120} emotion={hasPremiumAccess ? 'celebrating' : 'confident'} premium={hasPremiumAccess} animated={true} testID="sage-mascot" imageUrl={MASCOT_URL} />
            </View>
            <View style={styles.appNameContainer}>
              <LinearGradient colors={isDark ? ['#000000', '#1A1A1A'] : ['#FFFFFF', '#F8F9FA']} style={[styles.appNameBadge, { borderColor: isDark ? 'rgba(0, 230, 122, 0.3)' : 'rgba(0, 0, 0, 0.1)', shadowColor: isDark ? '#00E67A' : '#000', shadowOpacity: isDark ? 0.4 : 0.1 }]}
              >
                <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#000000', fontWeight: '900', textShadowColor: isDark ? 'rgba(0, 230, 122, 0.3)' : 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>
                  {APP_NAME}
                </Text>
              </LinearGradient>
              <Text style={{ fontSize: typography.size.base, fontWeight: typography.weight.medium, lineHeight: typography.size.base * 1.2, opacity: 0.8, color: themeColors.text.secondary }}>{TAGLINE}</Text>
            </View>
          </View>
        </View>

        {/* Calculators */}
        <View style={styles.calculatorSection}>
          <Text style={[styles.calculatorSectionTitle, { color: themeColors.text.primary }]}>Financial Calculators</Text>
          <Text style={[styles.calculatorSectionSubtitle, { color: themeColors.text.secondary }]}>Quickly run mortgage and auto loan calculations.</Text>
          <HorizontalCalculators onOpen={handleCalculatorPress} />
        </View>

        {/* Pro */}
        {!isPro && (
          <View style={styles.premiumSection}>
            <View style={[styles.premiumCard, { backgroundColor: themeColors.surface.secondary }]}>
              <View style={styles.premiumHeader}>
                <View style={styles.premiumIconContainer}>
                  <Crown size={24} color="#F59E0B" />
                </View>
                <View style={styles.premiumTextContainer}>
                  <Text style={[styles.premiumTitle, { color: themeColors.text.primary }]}>FinSage Pro</Text>
                  <Text style={[styles.premiumDescription, { color: themeColors.text.secondary }]}>Exports and unlimited scenarios.</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.premiumButton} onPress={handleStartTrial} testID="open-paywall">
                <Text style={styles.premiumButtonText}>{isTrialActive ? 'Manage' : 'Start Trial'}</Text>
                <ArrowRight size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, { color: themeColors.text.primary }]}>Features</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? 'rgba(0, 230, 122, 0.15)' : 'rgba(0, 230, 122, 0.1)' }]}>
                <CheckCircle2 size={18} color="#00E67A" strokeWidth={2.5} />
              </View>
              <Text style={[styles.featureText, { color: themeColors.text.secondary }]}>Accurate mortgage and auto loan calculators</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? 'rgba(0, 230, 122, 0.15)' : 'rgba(0, 230, 122, 0.1)' }]}>
                <Share2 size={18} color="#00E67A" strokeWidth={2.5} />
              </View>
              <Text style={[styles.featureText, { color: themeColors.text.secondary }]}>Save, share, and export results (Pro)</Text>
            </View>
          </View>

          {hasPremiumAccess && (
            <View style={styles.premiumStatus}>
              <Crown size={24} color="#F59E0B" />
              <Text style={styles.premiumStatusText}>{isPro ? 'Pro Active' : 'Trial Active'}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_SPACING = 16 as const;
const CARD_WIDTH = 320 as const;

function HorizontalCalculators({ onOpen }: { onOpen: (type: 'mortgage' | 'car-loan') => void }) {
  const { colors: themeColors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState<number>(0);
  const data = useMemo(() => (
    [
      { key: 'mortgage' as const, title: 'Mortgage Calculator', subtitle: 'Complete home loan analysis', bg: 'rgba(0, 230, 122, 0.15)', icon: <Home size={28} color="#00E67A" strokeWidth={2.5} />, testID: 'open-mortgage' },
      { key: 'car-loan' as const, title: 'Auto Loan Calculator', subtitle: 'Smart vehicle financing', bg: 'rgba(102, 126, 234, 0.15)', icon: <Car size={28} color="#667EEA" strokeWidth={2.5} />, testID: 'open-car-loan' }
    ]
  ), []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    if (i !== index) setIndex(i);
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        testID="calculator-carousel"
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => onOpen(item.key)}
            activeOpacity={0.92}
            testID={item.testID}
            style={{ width: CARD_WIDTH, marginRight: CARD_SPACING }}
          >
            <View style={{ borderRadius: 16, marginBottom: 16, backgroundColor: themeColors.surface.secondary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16 }}>
                <View style={{ width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, backgroundColor: item.bg }}>
                  {item.icon}
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 4, lineHeight: 22, letterSpacing: -0.2, color: themeColors.text.primary }}>{item.title}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', lineHeight: 18, opacity: 0.8, color: themeColors.text.secondary }}>{item.subtitle}</Text>
                </View>
                <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={18} color={themeColors.text.tertiary} strokeWidth={2} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  settingsButton: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  themeToggle: {},
  scrollContent: { paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 120 : 100, gap: 24 },
  heroSection: { alignItems: 'center', paddingHorizontal: 24, marginBottom: 32 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, marginBottom: 24, borderWidth: 1 },
  statusText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, lineHeight: 16 },
  brandContainer: { alignItems: 'center' },
  logoBackdrop: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  appNameContainer: { alignItems: 'center', marginTop: 16 },
  appNameBadge: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, borderWidth: 1, marginBottom: 8, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 8 },
  appName: { fontSize: typography.size['2xl'], fontWeight: typography.weight.black, letterSpacing: typography.letterSpacing.tight, lineHeight: typography.size['2xl'] * 1, textAlign: 'center' },
  calculatorSection: { marginBottom: 24 },
  calculatorSectionTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8, paddingHorizontal: 20, letterSpacing: -0.3, lineHeight: 26 },
  calculatorSectionSubtitle: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20, opacity: 0.7, lineHeight: 18 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.15)' },
  dotActive: { backgroundColor: '#00E67A' },
  premiumSection: { paddingHorizontal: 20, marginBottom: 24 },
  premiumCard: { borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  premiumHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  premiumIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  premiumTextContainer: { flex: 1 },
  premiumTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4, lineHeight: 20, letterSpacing: -0.2 },
  premiumDescription: { fontSize: 14, fontWeight: '500', lineHeight: 18, opacity: 0.8 },
  premiumButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F59E0B', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  premiumButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF', lineHeight: 18 },
  featuresSection: { paddingHorizontal: 20 },
  featuresTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 24, letterSpacing: -0.3, lineHeight: 26 },
  featuresList: { gap: 16, marginBottom: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 16, fontWeight: '500', flex: 1, lineHeight: 20 },
  premiumStatus: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', padding: 16, borderRadius: 12 },
  premiumStatusText: { fontSize: 15, color: '#F59E0B', fontWeight: '600', flex: 1, lineHeight: 18 }
});
