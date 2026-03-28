import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Platform, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Save, FileText, Share, MoreHorizontal, Home, TrendingUp, Calculator, DollarSign, Target, BarChart3, Sparkles, Zap, ArrowRight } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import FinSageLogo from '@/components/shared/FinSageLogo';
import { MASCOT_URL, BRAND_COLORS } from '@/constants/branding';
import * as Haptics from 'expo-haptics';
import InputField from '@/components/shared/InputField';
import SliderInput from '@/components/shared/SliderInput';
import ResultCard from '@/components/shared/ResultCard';
import PaymentBreakdown from '@/components/shared/PaymentBreakdown';
import ShareActionSheet from '@/components/shared/ShareActionSheet';
import AITipsManager from '@/components/shared/AITipsManager';
import EmotionalFeedback from '@/components/shared/EmotionalFeedback';
import { useMortgageCalculator } from '@/hooks/useMortgageCalculator';
import { formatCurrency, formatPercent } from '@/utils/calculations';
import { shareResults, exportToPDF, exportToCSV } from '@/utils/shareUtils';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { useHasPremiumAccess, useSubscription } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SimpleThemeToggle } from '@/components/shared/ThemeToggle';
import { MortgageInputs } from '@/types/financial';

type ContentPart = { type: 'text'; text: string } | { type: 'image'; image: string };
type CoreMessage = { role: 'system' | 'user' | 'assistant'; content: string | Array<ContentPart> };


export default function MortgageCalculator() {
  const { inputs, calculation, updateInput, error } = useMortgageCalculator();
  const hasPremiumAccess = useHasPremiumAccess();
  const { subscriptionType } = useSubscription();
  const { colors: themeColors, isDark } = useTheme();
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'celebration' | 'encouragement' | 'progress' | 'milestone' | 'expert'>('success');

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const lastCalculationRef = useRef<number>(0);

  const handlePremiumFeature = useCallback((featureName: string) => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'FinSage Pro Required',
        `${featureName} requires FinSage Pro. Unlock advanced financial tools and maximize your profit potential.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
        ]
      );
      return;
    }
    
    Alert.alert('Premium Feature', `${featureName} is available in the full version.`);
  }, [hasPremiumAccess]);

  const mortgageData = useMemo(() => ({
    homePrice: inputs.homePrice,
    downPayment: inputs.downPayment,
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTerm,
    monthlyPayment: calculation.monthlyPayment,
    totalMonthlyPayment: calculation.totalMonthlyPayment,
    totalInterest: calculation.totalInterest,
    loanToValue: calculation.loanToValue,
    breakdown: calculation.breakdown,
  }), [inputs, calculation]);

  const handleShare = useCallback(async () => {
    await shareResults(mortgageData, 'mortgage');
  }, [mortgageData]);

  const handleExportPDF = useCallback(async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeature('Professional Report');
      return;
    }
    
    await exportToPDF(mortgageData, 'mortgage');
  }, [hasPremiumAccess, handlePremiumFeature, mortgageData]);

  const handleExportCSV = useCallback(async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeature('Data Export');
      return;
    }
    
    await exportToCSV(mortgageData, 'mortgage');
  }, [hasPremiumAccess, handlePremiumFeature, mortgageData]);

  // Enhanced entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Pulsing animation for live indicator
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
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
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Gentle feedback on calculation changes - less overwhelming
  useEffect(() => {
    const currentTotal = calculation.totalMonthlyPayment;
    if (currentTotal > 0 && currentTotal !== lastCalculationRef.current) {
      lastCalculationRef.current = currentTotal;
      
      // Subtle haptic feedback only on significant changes
      if (Platform.OS !== 'web' && Math.abs(currentTotal - lastCalculationRef.current) > 100) {
        Haptics.selectionAsync(); // Gentler feedback
      }
      

    }
  }, [calculation.totalMonthlyPayment, calculation.loanToValue]); // More specific dependencies

  const handleInputChange = useCallback((key: keyof MortgageInputs, text: string) => {
    // Allow empty string to clear input
    if (text === '') {
      updateInput(key, 0);
      return;
    }
    
    // Clean input and parse
    const cleanText = text.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleanText);
    
    // Only update if we have a valid number and it's different from current value
    if (!isNaN(value) && isFinite(value) && value !== inputs[key]) {
      updateInput(key, value);
      
      // Minimal haptic feedback - less intrusive
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    }
  }, [updateInput, inputs]);

  const handleSliderChange = useCallback((key: keyof MortgageInputs, value: number) => {
    updateInput(key, value);
    
    // Gentle haptic feedback for sliders - less frequent
    if (Platform.OS !== 'web' && Math.abs(value - inputs[key]) > (key === 'interestRate' ? 0.1 : 1000)) {
      Haptics.selectionAsync();
    }
  }, [updateInput, inputs]);

  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [showAITipsManager, setShowAITipsManager] = useState<boolean>(false);

  const askAI = useCallback(async () => {
    try {
      setAiError('');
      setAiAdvice('');
      setAiLoading(true);
      const messages: CoreMessage[] = [
        { role: 'system', content: 'You are a helpful, concise financial assistant. Provide practical, risk-aware advice.' },
        { role: 'user', content: `Give me tailored mortgage tips. Home price ${inputs.homePrice}, down ${inputs.downPayment}, rate ${inputs.interestRate}%, term ${inputs.loanTerm} yrs, HOA ${inputs.hoaFees}/mo, tax rate ${inputs.propertyTaxRate}%, insurance rate ${inputs.homeInsuranceRate}%, PMI rate ${inputs.pmiRate}%. Focus on: reducing monthly payment, cutting lifetime interest, PMI elimination strategies, and actionable next steps in 3-5 bullets.` }
      ];
      const res = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
      const json = await res.json();
      const text = (json?.completion as string) ?? '';
      setAiAdvice(text);
    } catch (e: any) {
      setAiError('Unable to fetch AI advice right now. Please try again.');
      console.log('AI error', e?.message ?? e);
    } finally {
      setAiLoading(false);
    }
  }, [inputs]);

  const potentialSavings = useMemo(() => {
    return calculation.totalInterest * 0.15; // Potential 15% savings with optimization
  }, [calculation.totalInterest]);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Mortgage Calculator',
          headerStyle: { backgroundColor: themeColors.surface.primary },
          headerTintColor: themeColors.text.primary,
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => handlePremiumFeature('Save Analysis')} style={{ padding: 6 }}>
                <Save size={20} color={hasPremiumAccess ? themeColors.text.accent : themeColors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowShareSheet(true)} style={{ padding: 6 }}>
                <MoreHorizontal size={20} color={themeColors.text.primary} />
              </TouchableOpacity>
              <SimpleThemeToggle style={{ marginLeft: 8 }} />
            </View>
          )
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Emotional Feedback */}
          <EmotionalFeedback
            type={feedbackType}
            visible={showFeedback}
            onComplete={() => setShowFeedback(false)}
            testID="mortgage-feedback"
          />

          {/* Clean Professional Header with Mascot */}
          <Animated.View 
            style={[
              styles.profitHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#00E67A', '#00D166']}
              style={styles.profitHeaderGradient}
            >
              <View style={styles.profitHeaderContent}>
                <View style={[styles.logoContainer, {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 70,
                  padding: 20,
                  shadowColor: isDark ? '#00E67A' : '#000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: isDark ? 0.4 : 0.25,
                  shadowRadius: 24,
                  elevation: 18,
                  borderWidth: 3,
                  borderColor: isDark ? 'rgba(0, 230, 122, 0.4)' : 'rgba(0, 0, 0, 0.08)',
                }]}>
                  <SageMascot 
                    size={80} 
                    emotion="analytical" 
                    premium={hasPremiumAccess}
                    animated={true}
                    testID="mortgage-mascot"
                    imageUrl={MASCOT_URL}
                  />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.headerTitle, {
                    color: '#FFFFFF',
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }]}>Mortgage Calculator</Text>
                  <Text style={styles.headerSubtitle}>Professional home loan analysis</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Dynamic Profit Banner */}
          <Animated.View 
            style={[
              styles.profitBanner,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={calculation.loanToValue <= 80 ? ['#10B981', '#059669'] : ['#FF6B6B', '#EE5A24']}
              style={styles.profitBannerGradient}
            >
              <Zap size={24} color="#FFF" />
              <View style={styles.profitBannerContent}>
                <Text style={styles.profitBannerTitle}>
                  {calculation.loanToValue <= 80 ? 'Excellent Position' : 'Optimization Opportunity'}
                </Text>
                <Text style={styles.profitBannerAmount}>
                  {calculation.loanToValue <= 80 
                    ? formatCurrency(calculation.monthlyPayment * 12) 
                    : formatCurrency(potentialSavings)
                  }
                </Text>
                <Text style={styles.profitBannerSubtitle}>
                  {calculation.loanToValue <= 80 ? 'Annual payment' : 'Potential savings'}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Calculator size={24} color="#00E67A" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { 
                color: themeColors.text.primary,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                lineHeight: typography.size.lg * typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
                marginLeft: 16,
              }]}>Property Details</Text>
            </View>
            
            <InputField
              label="Home Price"
              value={inputs.homePrice.toString()}
              onChangeText={(text) => handleInputChange('homePrice', text)}
              keyboardType="numeric"
              prefix="$"
              testID="home-price-input"
            />

            <SliderInput
              label="Down Payment"
              value={inputs.downPayment}
              onValueChange={(value) => handleSliderChange('downPayment', value)}
              minimumValue={0}
              maximumValue={inputs.homePrice * 0.5}
              step={1000}
              formatValue={formatCurrency}
              testID="down-payment-slider"
            />

            <SliderInput
              label="Interest Rate"
              value={inputs.interestRate}
              onValueChange={(value) => handleSliderChange('interestRate', value)}
              minimumValue={3.0}
              maximumValue={10.0}
              step={0.05}
              formatValue={formatPercent}
              testID="interest-rate-slider"
            />

            <SliderInput
              label="Loan Term"
              value={inputs.loanTerm}
              onValueChange={(value) => handleSliderChange('loanTerm', value)}
              minimumValue={10}
              maximumValue={30}
              step={1}
              formatValue={(val) => `${val} years`}
              testID="loan-term-slider"
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <DollarSign size={24} color="#00E67A" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { 
                color: themeColors.text.primary,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                lineHeight: typography.size.lg * typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
                marginLeft: 16,
              }]}>Additional Costs</Text>
            </View>
            
            <SliderInput
              label="Property Tax Rate"
              value={inputs.propertyTaxRate}
              onValueChange={(value) => handleSliderChange('propertyTaxRate', value)}
              minimumValue={0.5}
              maximumValue={3.0}
              step={0.05}
              formatValue={formatPercent}
              testID="property-tax-slider"
            />

            <SliderInput
              label="Home Insurance Rate"
              value={inputs.homeInsuranceRate}
              onValueChange={(value) => handleSliderChange('homeInsuranceRate', value)}
              minimumValue={0.2}
              maximumValue={1.0}
              step={0.05}
              formatValue={formatPercent}
              testID="insurance-rate-slider"
            />

            {calculation.loanToValue > 80 && (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }}
              >
                <SliderInput
                  label="PMI Rate"
                  value={inputs.pmiRate}
                  onValueChange={(value) => handleSliderChange('pmiRate', value)}
                  minimumValue={0.3}
                  maximumValue={1.5}
                  step={0.05}
                  formatValue={formatPercent}
                  testID="pmi-rate-slider"
                />
              </Animated.View>
            )}

            <InputField
              label="HOA Fees (Monthly)"
              value={inputs.hoaFees.toString()}
              onChangeText={(text) => handleInputChange('hoaFees', text)}
              keyboardType="numeric"
              prefix="$"
              testID="hoa-fees-input"
            />
          </Animated.View>

          {/* Enhanced Results with Animations */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <BarChart3 size={24} color="#00E67A" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { 
                color: themeColors.text.primary,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                lineHeight: typography.size.lg * typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
                marginLeft: 16,
              }]}>Smart Analysis</Text>
              <View style={styles.liveIndicator}>
                <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={[styles.liveText, { 
                  color: themeColors.text.secondary,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.medium,
                }]}>Live</Text>
              </View>
            </View>
            
            <View style={styles.resultsGrid}>
              <ResultCard
                title="Monthly Payment"
                value={formatCurrency(calculation.monthlyPayment)}
                subtitle="Principal & Interest"
                gradient={['#00FF88', '#00CC69']}
                testID="monthly-payment-result"
              />
              
              <ResultCard
                title="Total Monthly"
                value={formatCurrency(calculation.totalMonthlyPayment)}
                subtitle="All costs included"
                gradient={['#667EEA', '#764BA2']}
                testID="total-monthly-payment-result"
              />
              
              <ResultCard
                title="Total Interest"
                value={formatCurrency(calculation.totalInterest)}
                subtitle={`Over ${inputs.loanTerm} years`}
                gradient={['#F093FB', '#F5576C']}
                testID="total-interest-result"
              />
              
              <ResultCard
                title="Loan-to-Value"
                value={`${calculation.loanToValue.toFixed(1)}%`}
                subtitle={calculation.loanToValue > 80 ? 'PMI Required' : 'Excellent Ratio'}
                gradient={calculation.loanToValue > 80 ? ['#EF4444', '#DC2626'] : ['#10B981', '#059669']}
                testID="ltv-result"
              />
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <PaymentBreakdown
              breakdown={calculation.breakdown}
              total={calculation.totalMonthlyPayment}
            />
          </Animated.View>

          {/* Clean Professional Insight */}
          <Animated.View 
            style={[
              styles.insightCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.insightCardContent, { backgroundColor: themeColors.surface.secondary }]}>
              <View style={styles.insightHeader}>
                <View style={[styles.aiIconContainer, {
                  backgroundColor: calculation.loanToValue <= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }]}>
                  <Target size={24} color={calculation.loanToValue <= 80 ? '#10B981' : '#EF4444'} />
                </View>
                <View style={styles.insightTitleContainer}>
                  <Text style={[styles.insightTitle, { color: themeColors.text.primary }]}>Professional Analysis</Text>
                  <View style={styles.aiIndicator}>
                    <Sparkles size={14} color="#00E67A" />
                    <Text style={styles.aiText}>AI-Powered</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.insightContent}>
                <Text style={[styles.insightMainText, { color: themeColors.text.primary }]}>
                  {calculation.loanToValue > 80 
                    ? `Optimization Opportunity`
                    : `Excellent Financial Position`}
                </Text>
                
                <Text style={[styles.insightDetailText, { color: themeColors.text.secondary }]}>
                  {calculation.loanToValue > 80 
                    ? `Your LTV is ${calculation.loanToValue.toFixed(1)}%. Consider increasing your down payment to eliminate PMI costs of ${formatCurrency(calculation.breakdown.pmi * 12)} annually.`
                    : `Your ${calculation.loanToValue.toFixed(1)}% LTV ratio is outstanding. You're avoiding PMI costs and building equity efficiently.`}
                </Text>
                
                <View style={styles.insightMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={[styles.metricLabel, { color: themeColors.text.tertiary }]}>Annual Savings</Text>
                    <Text style={[styles.metricValue, {
                      color: calculation.loanToValue > 80 ? '#EF4444' : '#10B981'
                    }]}>
                      {calculation.loanToValue > 80 
                        ? formatCurrency(calculation.breakdown.pmi * 12)
                        : formatCurrency(potentialSavings * 0.1)}
                    </Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={[styles.metricLabel, { color: themeColors.text.tertiary }]}>Risk Level</Text>
                    <Text style={[styles.metricValue, {
                      color: calculation.loanToValue > 80 ? '#F59E0B' : '#10B981'
                    }]}>
                      {calculation.loanToValue > 80 ? 'Moderate' : 'Low'}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: spacing[3] }}>
                  <TouchableOpacity 
                    style={styles.insightActionButton} 
                    onPress={async () => {
                      if (!aiAdvice) {
                        await askAI();
                      }
                      if (aiAdvice) {
                        setShowAITipsManager(true);
                      }
                    }} 
                    testID="mortgage-ask-ai"
                  >
                    {aiLoading ? (
                      <ActivityIndicator color="#00E67A" />
                    ) : (
                      <>
                        <Text style={styles.insightActionText}>
                          {aiAdvice ? 'View AI Tips' : 'Ask AI for tips'}
                        </Text>
                        <ArrowRight size={16} color="#00E67A" />
                      </>
                    )}
                  </TouchableOpacity>

                  {aiError ? (
                    <Text style={[styles.insightDetailText, { color: '#EF4444' }]}>{aiError}</Text>
                  ) : null}
                </View>
                
                {hasPremiumAccess && (
                  <TouchableOpacity style={[styles.insightActionButton, { marginTop: spacing[2] }]}>
                    <Text style={styles.insightActionText}>View Detailed Analysis</Text>
                    <ArrowRight size={16} color="#00E67A" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Premium Upgrade */}
          {!hasPremiumAccess && (
            <View style={styles.premiumCard}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.premiumGradient}
              >
                <FinSageLogo 
                  variant="premium" 
                  size="medium" 
                  premium={true} 
                  animated={true}
                  testID="mortgage-premium-logo"
                />
                <Text style={styles.premiumTitle}>Unlock FinSage Pro</Text>
                <Text style={styles.premiumSubtitle}>
                  Advanced analytics • Professional reports • Export capabilities
                </Text>
                <TouchableOpacity
                  style={styles.premiumButton}
                  onPress={() => router.push('/paywall')}
                >
                  <Text style={styles.premiumButtonText}>Start 7-Day Trial</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <LinearGradient colors={['#00FF88', '#00CC69']} style={styles.actionGradient}>
                <Share size={20} color="#000" />
                <Text style={styles.actionText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setShowShareSheet(true)}
            >
              <LinearGradient 
                colors={hasPremiumAccess ? ['#667EEA', '#764BA2'] : ['#E5E5E5', '#D4D4D4']} 
                style={styles.actionGradient}
              >
                <FileText size={20} color={hasPremiumAccess ? "#FFF" : "#999"} />
                <Text style={[styles.actionText, { color: hasPremiumAccess ? "#FFF" : "#999" }]}>
                  Export
                </Text>
                {!hasPremiumAccess && (
                  <View style={styles.actionBadge}>
                    <Crown size={12} color="#F59E0B" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePremiumFeature('Save Analysis')}
            >
              <LinearGradient 
                colors={hasPremiumAccess ? ['#F093FB', '#F5576C'] : ['#E5E5E5', '#D4D4D4']} 
                style={styles.actionGradient}
              >
                <Save size={20} color={hasPremiumAccess ? "#FFF" : "#999"} />
                <Text style={[styles.actionText, { color: hasPremiumAccess ? "#FFF" : "#999" }]}>
                  Save
                </Text>
                {!hasPremiumAccess && (
                  <View style={styles.actionBadge}>
                    <Crown size={12} color="#F59E0B" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <ShareActionSheet
          visible={showShareSheet}
          onClose={() => setShowShareSheet(false)}
          onShare={handleShare}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
          hasPremiumAccess={hasPremiumAccess}
          calculatorType="mortgage"
        />
        
        <AITipsManager
          visible={showAITipsManager}
          onClose={() => setShowAITipsManager(false)}
          initialAdvice={aiAdvice}
          calculatorType="mortgage"
          calculationData={mortgageData}
          testID="mortgage-ai-tips"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Softer dark background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: spacing[12],
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[4],
    alignItems: 'center',
  },
  profitHeader: {
    marginBottom: spacing[6],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  profitHeaderGradient: {
    padding: spacing[6],
    alignItems: 'center',
  },
  profitHeaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },

  profitBanner: {
    marginBottom: spacing[6],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  profitBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  profitBannerContent: {
    marginLeft: spacing[3],
  },
  profitBannerTitle: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: typography.weight.medium,
  },
  profitBannerAmount: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: '#FFF',
  },
  profitBannerSubtitle: {
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  resultsGrid: {
    gap: spacing[3],
  },
  insightCard: {
    marginBottom: spacing[6],
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightCardContent: {
    padding: spacing[5],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 122, 0.2)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 20,
  },
  insightContent: {
    gap: spacing[4],
  },
  insightMainText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  insightDetailText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  insightMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginTop: spacing[4],
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(0,230,122,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,230,122,0.3)',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  insightActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00E67A',
    lineHeight: 18,
  },
  premiumCard: {
    marginBottom: spacing[6],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: spacing[6],
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    lineHeight: 26,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    position: 'relative',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginLeft: 'auto',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    lineHeight: 14,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginLeft: 'auto',
    backgroundColor: 'rgba(0,255,136,0.1)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  aiText: {
    fontSize: 12,
    color: '#00E67A',
    fontWeight: '500',
    lineHeight: 14,
  },
});