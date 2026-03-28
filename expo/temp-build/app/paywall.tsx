import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Shield, Check } from 'lucide-react-native';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function PaywallScreen() {
  const { colors: themeColors } = useTheme();
  const { upgradeToPro, restorePurchases, isPro, isTrialActive, trialDaysLeft } = useSubscription();

  return (
    <View style={[styles.root, { backgroundColor: themeColors.background }]} testID="paywall-screen">
      <Stack.Screen
        options={{
          title: 'FinSage Pro',
          headerTransparent: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close" testID="close-paywall">
              <X color={themeColors.text.primary} size={22} />
            </TouchableOpacity>
          ),
        }}
      />

      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.hero}>
        <Text style={styles.title}>{isPro ? 'Pro Active' : 'Upgrade to Pro'}</Text>
        <Text style={styles.subtitle}>
          {isPro
            ? 'You have full access.'
            : isTrialActive
              ? `Trial: ${trialDaysLeft} days left`
              : 'Unlock exports and unlimited scenarios.'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        <View style={[styles.features, { backgroundColor: themeColors.surface.elevated, borderColor: themeColors.border.light }]}
          testID="pro-features">
          <View style={styles.featureItem}>
            <Check size={16} color="#00E67A" />
            <Text style={[styles.featureText, { color: themeColors.text.primary }]}>PDF and CSV export</Text>
          </View>
          <View style={styles.featureItem}>
            <Check size={16} color="#00E67A" />
            <Text style={[styles.featureText, { color: themeColors.text.primary }]}>Unlimited saved scenarios</Text>
          </View>
          <View style={styles.featureItem}>
            <Check size={16} color="#00E67A" />
            <Text style={[styles.featureText, { color: themeColors.text.primary }]}>Priority updates</Text>
          </View>
        </View>

        {!isPro && (
          <View>
            <View style={styles.pricingContainer}>
              <TouchableOpacity
                onPress={upgradeToPro}
                style={[styles.pricingCard, { backgroundColor: themeColors.surface.elevated, borderColor: themeColors.border.light }]}
                testID="upgrade-to-pro"
              >
                <View style={styles.pricingHeader}>
                  <Text style={[styles.pricingTitle, { color: themeColors.text.primary }]}>Monthly</Text>
                  <Text style={[styles.pricingPrice, { color: themeColors.text.primary }]}>$4.99</Text>
                  <Text style={[styles.pricingPeriod, { color: themeColors.text.secondary }]}>per month</Text>
                </View>
                <View style={styles.pricingFeatures}>
                  <Text style={[styles.pricingFeature, { color: themeColors.text.secondary }]}>• All Pro features</Text>
                  <Text style={[styles.pricingFeature, { color: themeColors.text.secondary }]}>• Cancel anytime</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={upgradeToPro}
                style={[styles.pricingCard, styles.pricingCardRecommended, { backgroundColor: themeColors.surface.elevated, borderColor: '#00E67A' }]}
                testID="upgrade-to-pro-annual"
              >
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>BEST VALUE</Text>
                </View>
                <View style={styles.pricingHeader}>
                  <Text style={[styles.pricingTitle, { color: themeColors.text.primary }]}>Annual</Text>
                  <Text style={[styles.pricingPrice, { color: themeColors.text.primary }]}>$29.99</Text>
                  <Text style={[styles.pricingPeriod, { color: themeColors.text.secondary }]}>per year</Text>
                </View>
                <View style={styles.pricingFeatures}>
                  <Text style={[styles.pricingFeature, { color: themeColors.text.secondary }]}>• All Pro features</Text>
                  <Text style={[styles.pricingFeature, { color: themeColors.text.secondary }]}>• Save 50% vs monthly</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton} testID="restore-purchases">
              <Text style={[styles.restoreText, { color: themeColors.text.secondary }]}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.footnote, { backgroundColor: themeColors.surface.secondary, borderColor: themeColors.border.light }]}>
          <Shield size={14} color="#00E67A" />
          <Text style={[styles.footnoteText, { color: themeColors.text.secondary }]}>No spam. Cancel anytime.</Text>
          {Platform.OS === 'web' && (
            <Text style={[styles.footnoteText, { color: themeColors.text.tertiary }]}>Purchases on mobile only.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { paddingTop: 96, paddingBottom: 24, paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  content: { flex: 1 },
  contentInner: { padding: 20, gap: 20 },
  features: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 15, fontWeight: '600' },
  pricingContainer: { gap: 12 },
  pricingCard: { borderRadius: 16, borderWidth: 2, padding: 20, position: 'relative' },
  pricingCardRecommended: { borderWidth: 2 },
  recommendedBadge: { 
    position: 'absolute', 
    top: -8, 
    left: 20, 
    right: 20, 
    backgroundColor: '#00E67A', 
    borderRadius: 12, 
    paddingVertical: 4, 
    alignItems: 'center' 
  },
  recommendedText: { 
    color: '#000', 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 0.5 
  },
  pricingHeader: { alignItems: 'center', marginBottom: 12 },
  pricingTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  pricingPrice: { fontSize: 32, fontWeight: '900', marginBottom: 2 },
  pricingPeriod: { fontSize: 14, fontWeight: '500' },
  pricingFeatures: { gap: 4 },
  pricingFeature: { fontSize: 13, fontWeight: '500' },
  restoreButton: { alignItems: 'center', paddingVertical: 12 },
  restoreText: { fontSize: 14, fontWeight: '600' },
  footnote: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, padding: 12, justifyContent: 'center' },
  footnoteText: { fontSize: 12, fontWeight: '500' },
});