import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Platform, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Save, FileText, Share, MoreHorizontal, Car, TrendingUp, Calculator, DollarSign, Target, BarChart3, Sparkles, Zap, ArrowRight } from 'lucide-react-native';
import SageMascot from '@/components/shared/SageMascot';
import FinSageLogo from '@/components/shared/FinSageLogo';
import { MASCOT_URL } from '@/constants/branding';
import * as Haptics from 'expo-haptics';
import InputField from '@/components/shared/InputField';
import SliderInput from '@/components/shared/SliderInput';
import ResultCard from '@/components/shared/ResultCard';
import ShareActionSheet from '@/components/shared/ShareActionSheet';
import AITipsManager from '@/components/shared/AITipsManager';
import EmotionalFeedback from '@/components/shared/EmotionalFeedback';
import { useCarLoanCalculator } from '@/hooks/useCarLoanCalculator';
import { formatCurrency, formatPercent } from '@/utils/calculations';
import { shareResults, exportToPDF, exportToCSV } from '@/utils/shareUtils';
import colors, { typography, spacing, borderRadius } from '@/constants/colors';
import { useHasPremiumAccess, useSubscription } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SimpleThemeToggle } from '@/components/shared/ThemeToggle';
import { CarLoanInputs } from '@/types/financial';

export default function CarLoanCalculator() {
  const { inputs, calculation, updateInput, error } = useCarLoanCalculator();
  const hasPremiumAccess = useHasPremiumAccess();
  const { subscriptionType } = useSubscription();
  const { colors: themeColors, isDark } = useTheme();
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'celebration' | 'encouragement' | 'progress'>('success');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [showAITipsManager, setShowAITipsManager] = useState<boolean>(false);

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
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

  const carLoanData = useMemo(() => {
    if (!calculation) return null;
    return {
      vehiclePrice: inputs.vehiclePrice,
      downPayment: inputs.downPayment,
      tradeInValue: inputs.tradeInValue,
      interestRate: inputs.interestRate,
      loanTerm: inputs.loanTerm,
      monthlyPayment: calculation.monthlyPayment,
      loanAmount: calculation.loanAmount,
      totalInterest: calculation.totalInterest,
      totalCost: calculation.totalCost,
      salesTax: calculation.salesTax,
      fees: calculation.fees,
    };
  }, [inputs, calculation]);

  const handleShare = useCallback(async () => {
    if (!carLoanData) return;
    await shareResults(carLoanData, 'car-loan');
  }, [carLoanData]);

  const handleExportPDF = useCallback(async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeature('Professional Report');
      return;
    }
    
    if (!carLoanData) return;
    await exportToPDF(carLoanData, 'car-loan');
  }, [hasPremiumAccess, handlePremiumFeature, carLoanData]);

  const handleExportCSV = useCallback(async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeature('Data Export');
      return;
    }
    
    if (!carLoanData) return;
    await exportToCSV(carLoanData, 'car-loan');
  }, [hasPremiumAccess, handlePremiumFeature, carLoanData]);

  const handleInputChange = useCallback((key: keyof CarLoanInputs, text: string) => {
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
    }
  }, [updateInput, inputs]);

  const potentialSavings = useMemo(() => {
    return calculation ? calculation.totalInterest * 0.12 : 0; // Potential 12% savings with better rates
  }, [calculation]);

  const askAI = useCallback(async () => {
    if (!calculation) return;
    try {
      setAiError('');
      setAiAdvice('');
      setAiLoading(true);
      const messages = [
        { role: 'system', content: 'You are a helpful, concise financial assistant. Provide practical, risk-aware advice.' },
        { role: 'user', content: `Give me tailored auto loan tips. Vehicle price ${inputs.vehiclePrice}, down ${inputs.downPayment}, trade-in ${inputs.tradeInValue}, rate ${inputs.interestRate}%, term ${inputs.loanTerm} yrs, sales tax ${inputs.salesTaxRate}%, fees ${inputs.fees}. Focus on: reducing monthly payment, cutting lifetime interest, better financing options, and actionable next steps in 3-5 bullets.` }
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
  }, [inputs, calculation]);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Auto Loan Calculator',
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
          {/* Professional Header with Mascot */}
          <View style={styles.profitHeader}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.profitHeaderGradient}
            >
              <View style={styles.profitHeaderContent}>
                <View style={[styles.logoContainer, {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 70,
                  padding: 20,
                  shadowColor: isDark ? '#667EEA' : '#000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: isDark ? 0.4 : 0.25,
                  shadowRadius: 24,
                  elevation: 18,
                  borderWidth: 3,
                  borderColor: isDark ? 'rgba(102, 126, 234, 0.4)' : 'rgba(0, 0, 0, 0.08)',
                }]}>
                  <SageMascot 
                    size={80} 
                    emotion="focused" 
                    premium={hasPremiumAccess}
                    animated={true}
                    testID="car-loan-mascot"
                    imageUrl={MASCOT_URL}
                  />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.headerTitle, {
                    color: '#FFFFFF',
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }]}>Auto Loan Calculator</Text>
                  <Text style={styles.headerSubtitle}>Smart vehicle financing analysis</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Profit Potential Banner */}
          <View style={styles.profitBanner}>
            <LinearGradient
              colors={['#F093FB', '#F5576C']}
              style={styles.profitBannerGradient}
            >
              <TrendingUp size={24} color="#FFF" />
              <View style={styles.profitBannerContent}>
                <Text style={styles.profitBannerTitle}>Potential Savings</Text>
                <Text style={styles.profitBannerAmount}>{formatCurrency(potentialSavings)}</Text>
                <Text style={styles.profitBannerSubtitle}>With better financing</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Car size={24} color="#667EEA" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { 
                color: themeColors.text.primary,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                lineHeight: typography.size.lg * typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
                marginLeft: 16,
              }]}>Vehicle Details</Text>
            </View>
            
            <InputField
              label="Vehicle Price"
              value={inputs.vehiclePrice.toString()}
              onChangeText={(text) => handleInputChange('vehiclePrice', text)}
              keyboardType="numeric"
              prefix="$"
              testID="vehicle-price-input"
            />

            <SliderInput
              label="Down Payment"
              value={inputs.downPayment}
              onValueChange={(value) => updateInput('downPayment', value)}
              minimumValue={0}
              maximumValue={inputs.vehiclePrice * 0.5}
              step={500}
              formatValue={formatCurrency}
              testID="down-payment-slider"
            />

            <InputField
              label="Trade-in Value"
              value={inputs.tradeInValue.toString()}
              onChangeText={(text) => handleInputChange('tradeInValue', text)}
              keyboardType="numeric"
              prefix="$"
              testID="trade-in-input"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calculator size={24} color="#667EEA" strokeWidth={2.5} />
              <Text style={[styles.sectionTitle, { 
                color: themeColors.text.primary,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                lineHeight: typography.size.lg * typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
                marginLeft: 16,
              }]}>Loan Terms</Text>
            </View>
            
            <SliderInput
              label="Interest Rate"
              value={inputs.interestRate}
              onValueChange={(value) => updateInput('interestRate', value)}
              minimumValue={2.0}
              maximumValue={15.0}
              step={0.1}
              formatValue={formatPercent}
              testID="interest-rate-slider"
            />

            <SliderInput
              label="Loan Term"
              value={inputs.loanTerm}
              onValueChange={(value) => updateInput('loanTerm', value)}
              minimumValue={2}
              maximumValue={8}
              step={0.5}
              formatValue={(val) => `${val} years`}
              testID="loan-term-slider"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={24} color="#667EEA" strokeWidth={2.5} />
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
              label="Sales Tax Rate"
              value={inputs.salesTaxRate}
              onValueChange={(value) => updateInput('salesTaxRate', value)}
              minimumValue={0}
              maximumValue={12.0}
              step={0.01}
              formatValue={formatPercent}
              testID="sales-tax-slider"
            />

            <InputField
              label="Fees & Documentation"
              value={inputs.fees.toString()}
              onChangeText={(text) => handleInputChange('fees', text)}
              keyboardType="numeric"
              prefix="$"
              testID="fees-input"
            />
          </View>

          {/* Professional Results */}
          {calculation && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <BarChart3 size={24} color="#667EEA" strokeWidth={2.5} />
                <Text style={[styles.sectionTitle, { 
                  color: themeColors.text.primary,
                  fontSize: typography.size.lg,
                  fontWeight: typography.weight.bold,
                  lineHeight: typography.size.lg * typography.lineHeight.tight,
                  letterSpacing: typography.letterSpacing.tight,
                  marginLeft: 16,
                }]}>Financial Analysis</Text>
              </View>
              
              <View style={styles.resultsGrid}>
                <ResultCard
                  title="Monthly Payment"
                  value={formatCurrency(calculation.monthlyPayment)}
                  subtitle={`For ${inputs.loanTerm} years`}
                  gradient={['#667EEA', '#764BA2']}
                  testID="monthly-payment-result"
                />
                
                <ResultCard
                  title="Loan Amount"
                  value={formatCurrency(calculation.loanAmount)}
                  subtitle="Amount financed"
                  gradient={['#00FF88', '#00CC69']}
                  testID="loan-amount-result"
                />
                
                <ResultCard
                  title="Total Interest"
                  value={formatCurrency(calculation.totalInterest)}
                  subtitle={`Over ${inputs.loanTerm} years`}
                  gradient={['#F093FB', '#F5576C']}
                  testID="total-interest-result"
                />
                
                <ResultCard
                  title="Total Cost"
                  value={formatCurrency(calculation.totalCost)}
                  subtitle="Vehicle + Interest + Taxes + Fees"
                  gradient={['#8B5CF6', '#7C3AED']}
                  testID="total-cost-result"
                />
              </View>
            </View>
          )}

          {/* Loan Breakdown */}
          {calculation && (
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['#1a1a1a', '#2a2a2a']}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryTitle}>Loan Breakdown</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Vehicle Price:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(calculation.vehiclePrice)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Down Payment:</Text>
                  <Text style={styles.summaryValue}>-{formatCurrency(calculation.downPayment)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Trade-in Value:</Text>
                  <Text style={styles.summaryValue}>-{formatCurrency(calculation.tradeInValue)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Sales Tax:</Text>
                  <Text style={styles.summaryValue}>+{formatCurrency(calculation.salesTax)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fees:</Text>
                  <Text style={styles.summaryValue}>+{formatCurrency(calculation.fees)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>Amount Financed:</Text>
                  <Text style={styles.summaryTotalValue}>{formatCurrency(calculation.loanAmount)}</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Clean Professional Insight */}
          {calculation && (
            <View style={styles.insightCard}>
              <View style={[styles.insightCardContent, { backgroundColor: themeColors.surface.secondary }]}>
                <View style={styles.insightHeader}>
                  <View style={[styles.aiIconContainer, {
                    backgroundColor: calculation.loanAmount > inputs.vehiclePrice * 0.9 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                  }]}>
                    <Target size={24} color={calculation.loanAmount > inputs.vehiclePrice * 0.9 ? '#EF4444' : '#10B981'} />
                  </View>
                  <View style={styles.insightTitleContainer}>
                    <Text style={[styles.insightTitle, { color: themeColors.text.primary }]}>Professional Analysis</Text>
                    <View style={styles.aiIndicator}>
                      <Sparkles size={14} color="#667EEA" />
                      <Text style={styles.aiText}>AI-Powered</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.insightContent}>
                  <Text style={[styles.insightMainText, { color: themeColors.text.primary }]}>
                    {calculation.loanAmount > inputs.vehiclePrice * 0.9 
                      ? `Financing Optimization Available`
                      : `Smart Financing Structure`}
                  </Text>
                  
                  <Text style={[styles.insightDetailText, { color: themeColors.text.secondary }]}>
                    {calculation.loanAmount > inputs.vehiclePrice * 0.9 
                      ? `Your loan-to-value ratio is high. Consider increasing your down payment to reduce monthly payments and save on interest.`
                      : `Excellent financing approach! Your down payment strategy minimizes interest costs while maintaining healthy cash flow.`}
                  </Text>
                  
                  <View style={styles.insightMetrics}>
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricLabel, { color: themeColors.text.tertiary }]}>Monthly Savings</Text>
                      <Text style={[styles.metricValue, {
                        color: calculation.loanAmount > inputs.vehiclePrice * 0.9 ? '#EF4444' : '#10B981'
                      }]}>
                        {calculation.loanAmount > inputs.vehiclePrice * 0.9 
                          ? formatCurrency((calculation.monthlyPayment * 0.15))
                          : formatCurrency(calculation.monthlyPayment * 0.05)}
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricLabel, { color: themeColors.text.tertiary }]}>Financing Grade</Text>
                      <Text style={[styles.metricValue, {
                        color: calculation.loanAmount > inputs.vehiclePrice * 0.9 ? '#F59E0B' : '#10B981'
                      }]}>
                        {calculation.loanAmount > inputs.vehiclePrice * 0.9 ? 'B+' : 'A'}
                      </Text>
                    </View>
                  </View>
                  
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
                  >
                    {aiLoading ? (
                      <ActivityIndicator color="#667EEA" />
                    ) : (
                      <>
                        <Text style={styles.insightActionText}>
                          {aiAdvice ? 'View AI Tips' : 'Ask AI for tips'}
                        </Text>
                        <ArrowRight size={16} color="#667EEA" />
                      </>
                    )}
                  </TouchableOpacity>

                  {aiError ? (
                    <Text style={[styles.insightDetailText, { color: '#EF4444' }]}>{aiError}</Text>
                  ) : null}
                  
                  {hasPremiumAccess && (
                    <TouchableOpacity style={[styles.insightActionButton, { marginTop: spacing[2] }]}>
                      <Text style={styles.insightActionText}>View Rate Comparison</Text>
                      <ArrowRight size={16} color="#667EEA" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}

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
                  testID="car-loan-premium-logo"
                />
                <Text style={styles.premiumTitle}>Unlock FinSage Pro</Text>
                <Text style={styles.premiumSubtitle}>
                  Rate comparison • Payment scenarios • Professional reports
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
              <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.actionGradient}>
                <Share size={20} color="#FFF" />
                <Text style={styles.actionText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setShowShareSheet(true)}
            >
              <LinearGradient 
                colors={hasPremiumAccess ? ['#00FF88', '#00CC69'] : ['#E5E5E5', '#D4D4D4']} 
                style={styles.actionGradient}
              >
                <FileText size={20} color={hasPremiumAccess ? "#000" : "#999"} />
                <Text style={[styles.actionText, { color: hasPremiumAccess ? "#000" : "#999" }]}>
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
          calculatorType="car-loan"
        />
        
        <AITipsManager
          visible={showAITipsManager}
          onClose={() => setShowAITipsManager(false)}
          initialAdvice={aiAdvice}
          calculatorType="car-loan"
          calculationData={carLoanData}
          testID="car-loan-ai-tips"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
  summaryCard: {
    marginBottom: spacing[6],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: spacing[5],
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.2)',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    lineHeight: 20,
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 20,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(102,126,234,0.3)',
    marginTop: spacing[2],
    paddingTop: spacing[4],
  },
  summaryTotalLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 22,
  },
  summaryTotalValue: {
    fontSize: 18,
    color: '#667EEA',
    fontWeight: '800',
    lineHeight: 22,
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
    borderColor: 'rgba(102, 126, 234, 0.2)',
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
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(102,126,234,0.1)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  aiText: {
    fontSize: 12,
    color: '#667EEA',
    fontWeight: '500',
    lineHeight: 14,
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
    backgroundColor: 'rgba(102,126,234,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.3)',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  insightActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667EEA',
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
});