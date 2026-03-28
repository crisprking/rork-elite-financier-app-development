import React, { useEffect, useRef } from 'react';
    import { View, Animated, StyleSheet } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import Svg, { Circle, Path } from 'react-native-svg';
    import colors, { spacing } from '@/constants/colors';

    interface ProgressCelebrationProps {
      progress: number; // 0-1
      size?: number;
      showSparkles?: boolean;
      testID?: string;
    }

    const ProgressCelebration: React.FC<ProgressCelebrationProps> = ({
      progress,
      size = 120,
      showSparkles = true,
      testID
    }) => {
      const progressAnim = useRef(new Animated.Value(0)).current;
      const sparkleAnim1 = useRef(new Animated.Value(0)).current;
      const sparkleAnim2 = useRef(new Animated.Value(0)).current;
      const sparkleAnim3 = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 1000,
          useNativeDriver: false, // For strokeDasharray animation
        }).start();

        if (showSparkles && progress >= 0.8) {
          // Trigger sparkle animations when progress is high
          const sparkleSequence = Animated.stagger(200, [
            Animated.sequence([
              Animated.timing(sparkleAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(sparkleAnim1, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(sparkleAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(sparkleAnim2, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(sparkleAnim3, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(sparkleAnim3, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]),
          ]);

          sparkleSequence.start();
        }
      }, [progress, progressAnim, sparkleAnim1, sparkleAnim2, sparkleAnim3, showSparkles]);

      const circumference = 2 * Math.PI * 40; // radius = 40
      const strokeDasharray = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, circumference],
      });

      return (
        <View style={[styles.container, { width: size, height: size }]} testID={testID}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* Background circle */}
            <Circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={colors.neutral[200]}
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <AnimatedCircle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={colors.primary[500]}
              strokeWidth="8"
              strokeDasharray={`${strokeDasharray}, ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            
            {/* Center content */}
            <Circle cx="50" cy="50" r="25" fill={colors.primary[500]} />
            <Path d="M 42 50 L 47 55 L 58 44" stroke="#FFFFFF" strokeWidth="3" fill="none" />
          </Svg>

          {/* Sparkles */}
          {showSparkles && (
            <>
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle1,
                  {
                    opacity: sparkleAnim1,
                    transform: [{ scale: sparkleAnim1 }]
                  }
                ]}
              >
                <Svg width="20" height="20" viewBox="0 0 20 20">
                  <Path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={colors.accent.gold} />
                </Svg>
              </Animated.View>
              
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle2,
                  {
                    opacity: sparkleAnim2,
                    transform: [{ scale: sparkleAnim2 }]
                  }
                ]}
              >
                <Svg width="16" height="16" viewBox="0 0 16 16">
                  <Path d="M8 0 L9 6 L16 8 L9 10 L8 16 L7 10 L0 8 L7 6 Z" fill={colors.accent.emerald} />
                </Svg>
              </Animated.View>
              
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle3,
                  {
                    opacity: sparkleAnim3,
                    transform: [{ scale: sparkleAnim3 }]
                  }
                ]}
              >
                <Svg width="18" height="18" viewBox="0 0 18 18">
                  <Path d="M9 0 L10 7 L18 9 L10 11 L9 18 L8 11 L0 9 L8 7 Z" fill={colors.semantic.delight} />
                </Svg>
              </Animated.View>
            </>
          )}
        </View>
      );
    };

    // Animated Circle component for progress ring
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const styles = StyleSheet.create({
      container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      },
      sparkle: {
        position: 'absolute',
      },
      sparkle1: {
        top: 10,
        right: 15,
      },
      sparkle2: {
        bottom: 20,
        left: 10,
      },
      sparkle3: {
        top: 25,
        left: 20,
      },
    });

    export default ProgressCelebration;