import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Heart, Star, TrendingUp, Target, CheckCircle } from 'lucide-react-native';
import { typography, spacing } from '@/constants/colors';
import SageMascot from './SageMascot';

interface EmotionalFeedbackProps {
  type: 'success' | 'celebration' | 'encouragement' | 'progress' | 'milestone' | 'expert';
  message?: string;
  visible: boolean;
  onComplete?: () => void;
  testID?: string;
  premium?: boolean;
}

const EmotionalFeedback: React.FC<EmotionalFeedbackProps> = ({
  type,
  message,
  visible,
  onComplete,
  testID,
  premium = false
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const mascotScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Duolingo-style celebration sequence
      Animated.sequence([
        // Initial pop-in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            tension: 100,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(mascotScaleAnim, {
            toValue: 1.2,
            tension: 80,
            friction: 3,
            useNativeDriver: true,
          })
        ]),
        // Settle animation
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(mascotScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 4,
            useNativeDriver: true,
          })
        ]),
        // Celebration bounce
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -15,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ]).start();

      // Sparkle animation for celebration types
      if (type === 'celebration' || type === 'milestone') {
        const sparkleLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            })
          ])
        );
        sparkleLoop.start();
      }

      // Auto-hide with smooth exit
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start(() => {
          onComplete?.();
        });
      }, 3000);

      return () => {
        clearTimeout(timer);
        sparkleAnim.stopAnimation();
      };
    }
  }, [visible, fadeAnim, scaleAnim, bounceAnim, sparkleAnim, mascotScaleAnim, onComplete, type]);

  if (!visible) return null;

  const getFeedbackContent = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          mascotEmotion: 'confident' as const,
          color: '#10B981',
          defaultMessage: 'Perfect calculation!',
          gradient: ['#10B981', '#047857'] as [string, string],
          showMascot: true
        };
      case 'celebration':
        return {
          icon: Star,
          mascotEmotion: 'celebrating' as const,
          color: '#F59E0B',
          defaultMessage: 'Outstanding results!',
          gradient: ['#F59E0B', '#D97706'] as [string, string],
          showMascot: true
        };
      case 'encouragement':
        return {
          icon: Heart,
          mascotEmotion: 'encouraging' as const,
          color: '#8B5CF6',
          defaultMessage: 'You\'re making great progress!',
          gradient: ['#8B5CF6', '#7C3AED'] as [string, string],
          showMascot: true
        };
      case 'progress':
        return {
          icon: TrendingUp,
          mascotEmotion: 'focused' as const,
          color: '#00FF88',
          defaultMessage: 'Smart financial planning!',
          gradient: ['#00FF88', '#00CC69'] as [string, string],
          showMascot: false
        };
      case 'milestone':
        return {
          icon: Target,
          mascotEmotion: 'celebrating' as const,
          color: '#F59E0B',
          defaultMessage: 'Milestone achieved!',
          gradient: ['#F59E0B', '#D97706'] as [string, string],
          showMascot: true
        };
      case 'expert':
        return {
          icon: Sparkles,
          mascotEmotion: 'analytical' as const,
          color: '#0EA5E9',
          defaultMessage: 'Professional-level analysis!',
          gradient: ['#0EA5E9', '#0284C7'] as [string, string],
          showMascot: true
        };
      default:
        return {
          icon: CheckCircle,
          mascotEmotion: 'confident' as const,
          color: '#00FF88',
          defaultMessage: 'Well done!',
          gradient: ['#00FF88', '#00CC69'] as [string, string],
          showMascot: false
        };
    }
  };

  const content = getFeedbackContent();
  const IconComponent = content.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim }
          ]
        }
      ]}
      testID={testID}
    >
      <LinearGradient
        colors={content.gradient}
        style={styles.feedbackCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Sparkle effects for celebration */}
        {(type === 'celebration' || type === 'milestone') && (
          <>
            <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkleAnim }]}>
              <Sparkles size={16} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkleAnim }]}>
              <Sparkles size={12} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkleAnim }]}>
              <Sparkles size={14} color="#FFFFFF" />
            </Animated.View>
          </>
        )}
        
        <View style={styles.content}>
          {content.showMascot ? (
            <Animated.View style={{ transform: [{ scale: mascotScaleAnim }] }}>
              <SageMascot 
                size={48} 
                emotion={content.mascotEmotion}
                animated={true}
                premium={premium}
              />
            </Animated.View>
          ) : (
            <View style={styles.iconContainer}>
              <IconComponent size={24} color="#FFFFFF" />
            </View>
          )}
          
          <View style={styles.textContainer}>
            <Text style={styles.message}>
              {message || content.defaultMessage}
            </Text>
            {premium && (
              <Text style={styles.premiumBadge}>PRO</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? spacing[20] : spacing[16],
    left: spacing[4],
    right: spacing[4],
    zIndex: 1000,
    alignItems: 'center',
  },
  feedbackCard: {
    borderRadius: 24,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    minWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  message: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  premiumBadge: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.black,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    marginTop: spacing[1],
    letterSpacing: typography.letterSpacing.wider,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: spacing[2],
    right: spacing[3],
  },
  sparkle2: {
    top: spacing[4],
    left: spacing[3],
  },
  sparkle3: {
    bottom: spacing[3],
    right: spacing[5],
  },
});

export default EmotionalFeedback;