import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MASCOT_URL } from '@/constants/branding';
import { useTheme } from '@/contexts/ThemeContext';

interface FinSageLogoProps {
  variant?: 'full' | 'icon' | 'wordmark' | 'premium';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  premium?: boolean;
  animated?: boolean;
  testID?: string;
}

const FinSageLogo: React.FC<FinSageLogoProps> = ({
  variant = 'full',
  size = 'medium',
  showText = false,
  premium = false,
  animated = false,
  testID
}) => {
  const { isDark, colors } = useTheme();
  
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { mascotSize: 32, fontSize: 16, spacing: 8 };
      case 'large':
        return { mascotSize: 64, fontSize: 24, spacing: 16 };
      default:
        return { mascotSize: 48, fontSize: 20, spacing: 12 };
    }
  };
  
  const config = getSizeConfig();
  
  const renderMascot = () => (
    <View style={[styles.mascotContainer, {
      width: config.mascotSize + 8,
      height: config.mascotSize + 8,
      borderRadius: (config.mascotSize + 8) / 2,
      backgroundColor: isDark ? 'rgba(5, 150, 105, 0.1)' : 'rgba(5, 150, 105, 0.05)',
      borderWidth: 2,
      borderColor: isDark ? 'rgba(5, 150, 105, 0.3)' : 'rgba(5, 150, 105, 0.2)',
    }]}>
      <Image
        source={{ uri: MASCOT_URL }}
        style={{
          width: config.mascotSize,
          height: config.mascotSize,
        }}
        resizeMode="contain"
        testID={`${testID}-mascot`}
      />
    </View>
  );
  
  const renderWordmark = () => {
    if (!showText) return null;
    
    return (
      <View style={styles.wordmarkContainer}>
        <View style={[styles.modernContainer, {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          shadowColor: 'transparent',
        }]}>
          <View style={styles.brandContainer}>
            <Text style={[styles.brandText, { 
              fontSize: config.fontSize * 1.2,
              color: '#00E67A',
            }]}>
              FinSage
            </Text>
          </View>
        </View>
        {premium && (
          <View style={[styles.premiumBadge, { marginTop: config.spacing * 0.4 }]}>
            <LinearGradient
              colors={['#059669', '#047857', '#065f46']}
              style={styles.premiumGradient}
            >
              <Text style={[styles.premiumText, { fontSize: config.fontSize * 0.35 }]}>✨ PREMIUM UNLOCKED</Text>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };
  
  switch (variant) {
    case 'icon':
      return (
        <View style={styles.container} testID={testID}>
          {renderMascot()}
        </View>
      );
      
    case 'wordmark':
      return (
        <View style={styles.container} testID={testID}>
          {renderWordmark()}
        </View>
      );
      
    case 'premium':
      return (
        <View style={[styles.container, styles.premiumContainer]} testID={testID}>
          <View style={styles.premiumLayout}>
            {renderMascot()}
            <View style={{ marginLeft: config.spacing }}>
              {renderWordmark()}
            </View>
          </View>
        </View>
      );
      
    default: // 'full'
      return (
        <View style={styles.container} testID={testID}>
          <View style={[styles.fullLayout, { gap: config.spacing }]}>
            {renderMascot()}
            {renderWordmark()}
          </View>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullLayout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumContainer: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(5, 150, 105, 0.3)',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  premiumLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  wordmarkContainer: {
    alignItems: 'center',
  },
  modernContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  brandText: {
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  proContainer: {
    marginLeft: 8,
    marginTop: -4,
  },
  proGradient: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  proText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  taglineText: {
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    opacity: 0.85,
  },
  premiumBadge: {
    alignItems: 'center',
  },
  premiumGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default FinSageLogo;