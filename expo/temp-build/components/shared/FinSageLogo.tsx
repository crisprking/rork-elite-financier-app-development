import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import Svg, { Circle, Path, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

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
  
  const renderCleanIcon = () => (
    <View style={[styles.iconContainer, {
      width: config.mascotSize + 16,
      height: config.mascotSize + 16,
      borderRadius: (config.mascotSize + 16) / 2,
    }]}>
      <Svg
        width={config.mascotSize}
        height={config.mascotSize}
        viewBox="0 0 100 100"
        testID={`${testID}-icon`}
      >
        <Defs>
          <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00E67A" />
            <Stop offset="50%" stopColor="#059669" />
            <Stop offset="100%" stopColor="#047857" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Outer glow circle */}
        <Circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#gradient)"
          opacity="0.1"
        />
        
        {/* Main circle */}
        <Circle
          cx="50"
          cy="50"
          r="40"
          fill="url(#gradient)"
          opacity="0.9"
        />
        
        {/* Inner circle for depth */}
        <Circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Financial chart icon */}
        <G transform="translate(25, 25)">
          {/* Chart bars */}
          <Path
            d="M5 35 L15 25 L25 30 L35 15 L45 20"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          <Circle cx="5" cy="35" r="2" fill="#FFFFFF" />
          <Circle cx="15" cy="25" r="2" fill="#FFFFFF" />
          <Circle cx="25" cy="30" r="2" fill="#FFFFFF" />
          <Circle cx="35" cy="15" r="2" fill="#FFFFFF" />
          <Circle cx="45" cy="20" r="2" fill="#FFFFFF" />
          
          {/* AI circuit pattern */}
          <G opacity="0.6">
            <Path
              d="M10 10 L20 10 M15 5 L15 15 M30 5 L30 15 M25 10 L35 10"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <Circle cx="15" cy="10" r="1" fill="#FFFFFF" />
            <Circle cx="30" cy="10" r="1" fill="#FFFFFF" />
          </G>
        </G>
      </Svg>
    </View>
  );
  
  const renderWordmark = () => {
    if (!showText) return null;
    
    return (
      <View style={styles.wordmarkContainer}>
        <View style={styles.brandContainer}>
          <Text style={[styles.brandText, { 
            fontSize: config.fontSize * 1.4,
            color: '#FFFFFF',
            fontWeight: '700',
          }]}>
            FinSage
          </Text>
          <View style={styles.proBadge}>
            <Text style={[styles.proText, { 
              fontSize: config.fontSize * 0.6,
              color: '#00E67A',
            }]}>
              Pro
            </Text>
          </View>
        </View>
        <Text style={[styles.taglineText, { 
          fontSize: config.fontSize * 0.5,
          color: '#9CA3AF',
          marginTop: 4,
        }]}>
          Your AI Financial Advisor
        </Text>
        {premium && (
          <View style={[styles.premiumBadge, { marginTop: config.spacing * 0.4 }]}>
            <LinearGradient
              colors={['#00E67A', '#059669', '#047857']}
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
          {renderCleanIcon()}
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
            {renderCleanIcon()}
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
            {renderCleanIcon()}
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E67A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },
  brandText: {
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  proBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 230, 122, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 122, 0.3)',
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