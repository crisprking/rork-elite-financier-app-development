import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Moon, 
  Sun, 
  Smartphone, 
  Shield, 
  HelpCircle,
  Crown,
  Star,
  Share2,
  Download,
  Trash2,
  ChevronRight,
  CreditCard,
  FileText
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscription, useSubscriptionStatusText, useHasPremiumAccess } from '@/contexts/SubscriptionContext';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

import { spacing, borderRadius, typography } from '@/constants/colors';

interface SettingsItemProps {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
  premium?: boolean;
  destructive?: boolean;
  testID?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon: IconComponent,
  title,
  subtitle,
  onPress,
  rightComponent,
  showChevron = true,
  premium = false,
  destructive = false,
  testID
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        {
          backgroundColor: colors.surface.primary,
          borderBottomColor: colors.border.light,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[
          styles.iconContainer,
          { 
            backgroundColor: premium 
              ? 'rgba(245, 158, 11, 0.1)' 
              : destructive 
                ? 'rgba(239, 68, 68, 0.1)'
                : colors.surface.secondary
          }
        ]}>
          <IconComponent
            size={20}
            color={
              premium 
                ? '#F59E0B' 
                : destructive 
                  ? '#EF4444'
                  : colors.text.secondary
            }
            strokeWidth={2}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.settingsTitle,
              { color: destructive ? '#EF4444' : colors.text.primary }
            ]}>
              {title}
            </Text>
            {premium && (
              <Crown size={14} color="#F59E0B" style={{ marginLeft: 4 }} />
            )}
          </View>
          {subtitle && (
            <Text style={[
              styles.settingsSubtitle,
              { color: colors.text.tertiary }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent || (showChevron && onPress && (
        <ChevronRight size={20} color={colors.text.tertiary} />
      ))}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { colors, themeMode } = useTheme();
  const { isPro, restorePurchases } = useSubscription();
  const statusText = useSubscriptionStatusText();
  const hasPremiumAccess = useHasPremiumAccess();

  const getThemeDescription = () => {
    switch (themeMode) {
      case 'light': return 'Always light theme';
      case 'dark': return 'Always dark theme';
      case 'system': return 'Follow system setting';
      default: return 'Follow system setting';
    }
  };

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      Alert.alert('Success', 'Purchases restored successfully!');
    } catch {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const handleExportData = () => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'FinSage Pro Required',
        'Data export requires FinSage Pro. Upgrade to access professional features.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: handleUpgrade }
        ]
      );
      return;
    }
    
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF Report', onPress: () => console.log('Export PDF') },
        { text: 'CSV Data', onPress: () => console.log('Export CSV') }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your calculations and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const handleRateApp = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id123456789',
      android: 'https://play.google.com/store/apps/details?id=com.finsage.app',
      default: 'https://finsage.app'
    });
    
    Alert.alert(
      'Rate FinSage',
      'Love using FinSage? Please rate us on the App Store!',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => console.log('Open store:', storeUrl) }
      ]
    );
  };

  const handleShare = () => {
    const shareText = 'Check out FinSage - the professional financial calculator app that helped me optimize my finances! Download it now: https://finsage.app';
    console.log('Share:', shareText);
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Need help? Contact our support team:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => console.log('Open email: support@finsage.app') },
        { text: 'FAQ', onPress: () => console.log('Open FAQ') }
      ]
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: colors.surface.secondary }
    ]}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.surface.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.text.primary,
          },
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={[
          styles.profileSection,
          { backgroundColor: colors.surface.primary }
        ]}>
          <View style={[styles.profileIcon, {
            backgroundColor: hasPremiumAccess ? '#F59E0B' : '#00E67A'
          }]}>
            <Shield size={32} color="#FFF" />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileTitle, { color: colors.text.primary }]}>
              FinSage Pro
            </Text>
            <Text style={[styles.profileSubtitle, { color: colors.text.secondary }]}>
              {statusText}
            </Text>
            
            {!isPro && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                testID="upgrade-button"
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.upgradeGradient}
                >
                  <Crown size={14} color="#FFF" />
                  <Text style={styles.upgradeText}>Upgrade to Pro</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.secondary }
          ]}>
            Account
          </Text>
          
          <View style={[
            styles.sectionContent,
            { backgroundColor: colors.surface.primary }
          ]}>
            {!isPro && (
              <SettingsItem
                icon={Crown}
                title="Upgrade to Pro"
                subtitle="Unlock advanced features and unlimited calculations"
                onPress={handleUpgrade}
                premium
                testID="upgrade-setting"
              />
            )}
            
            <SettingsItem
              icon={CreditCard}
              title="Restore Purchases"
              subtitle="Restore your previous purchases"
              onPress={handleRestore}
              testID="restore-setting"
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.secondary }
          ]}>
            Appearance
          </Text>
          
          <View style={[
            styles.sectionContent,
            { backgroundColor: colors.surface.primary }
          ]}>
            <SettingsItem
              icon={themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Smartphone}
              title="Theme"
              subtitle={getThemeDescription()}
              rightComponent={<ThemeToggle size="sm" />}
              showChevron={false}
              testID="settings-theme"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.secondary }
          ]}>
            Data
          </Text>
          
          <View style={[
            styles.sectionContent,
            { backgroundColor: colors.surface.primary }
          ]}>
            <SettingsItem
              icon={Download}
              title="Export Data"
              subtitle="Export calculations as PDF or CSV"
              onPress={handleExportData}
              premium={!hasPremiumAccess}
              testID="export-setting"
            />
            
            <SettingsItem
              icon={Trash2}
              title="Clear All Data"
              subtitle="Permanently delete all calculations"
              onPress={handleClearData}
              destructive
              testID="clear-data-setting"
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.secondary }
          ]}>
            Support
          </Text>
          
          <View style={[
            styles.sectionContent,
            { backgroundColor: colors.surface.primary }
          ]}>
            <SettingsItem
              icon={Star}
              title="Rate FinSage"
              subtitle="Help us improve with your feedback"
              onPress={handleRateApp}
              testID="rate-setting"
            />
            
            <SettingsItem
              icon={Share2}
              title="Share FinSage"
              subtitle="Tell your friends about FinSage"
              onPress={handleShare}
              testID="share-setting"
            />
            
            <SettingsItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help or contact support"
              onPress={handleSupport}
              testID="settings-help"
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.secondary }
          ]}>
            Legal
          </Text>
          
          <View style={[
            styles.sectionContent,
            { backgroundColor: colors.surface.primary }
          ]}>
            <SettingsItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => console.log('Privacy policy')}
              testID="privacy-setting"
            />
            
            <SettingsItem
              icon={FileText}
              title="Terms of Service"
              subtitle="Terms and conditions"
              onPress={() => console.log('Terms of service')}
              testID="terms-setting"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={[
          styles.appInfo,
          { borderTopColor: colors.border.light }
        ]}>
          <Text style={[styles.appInfoText, { color: colors.text.tertiary }]}>
            FinSage Pro v1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: colors.text.tertiary }]}>
            Professional Financial Calculator
          </Text>
          <Text style={[styles.appInfoText, { color: colors.text.tertiary }]}>
            Made with ❤️ for financial success
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[20],
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    borderRadius: borderRadius.xl,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  profileTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold as any,
    marginBottom: spacing[1],
  },
  profileSubtitle: {
    fontSize: typography.size.sm,
    marginBottom: spacing[2],
  },
  upgradeButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    gap: spacing[1],
  },
  upgradeText: {
    color: '#FFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold as any,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  section: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[3],
    marginHorizontal: spacing[4],
  },
  sectionContent: {
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium as any,
    lineHeight: typography.size.base * typography.lineHeight.snug,
  },
  settingsSubtitle: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    marginTop: spacing[1],
  },
  rightComponent: {
    marginLeft: spacing[3],
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: spacing[6],
    marginTop: spacing[6],
    borderTopWidth: 1,
    marginHorizontal: spacing[6],
  },
  appInfoText: {
    fontSize: typography.size.xs,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
});