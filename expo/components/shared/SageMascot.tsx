import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SageMascotProps {
  size?: number;
  emotion?: 'confident' | 'analytical' | 'celebrating' | 'encouraging' | 'focused' | 'trustworthy';
  animated?: boolean;
  testID?: string;
  premium?: boolean;
  imageUrl?: string;
}

const SageMascot: React.FC<SageMascotProps> = ({
  size = 80,
  emotion = 'confident',
  animated = true,
  testID,
  premium = false,
  imageUrl
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    // Optimized animation system with proper cleanup
    const animations: Animated.CompositeAnimation[] = [];

    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );

    animations.push(bounceAnimation, scaleAnimation, blinkAnimation);
    
    bounceAnimation.start();
    scaleAnimation.start();
    blinkAnimation.start();

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [animated, bounceAnim, scaleAnim, blinkAnim]);

  const getEmotionColor = () => {
    switch (emotion) {
      case 'celebrating':
        return '#F59E0B';
      case 'analytical':
        return '#0EA5E9';
      case 'encouraging':
        return '#10B981';
      case 'focused':
        return '#8B5CF6';
      case 'trustworthy':
        return '#059669';
      default:
        return '#00E67A';
    }
  };

  const getEmotionExpression = () => {
    switch (emotion) {
      case 'celebrating':
        return { eyeSize: 8, mouthWidth: 16, mouthHeight: 4 };
      case 'analytical':
        return { eyeSize: 6, mouthWidth: 10, mouthHeight: 2 };
      case 'encouraging':
        return { eyeSize: 7, mouthWidth: 14, mouthHeight: 3 };
      case 'focused':
        return { eyeSize: 5, mouthWidth: 8, mouthHeight: 2 };
      case 'trustworthy':
        return { eyeSize: 7, mouthWidth: 12, mouthHeight: 3 };
      default:
        return { eyeSize: 6, mouthWidth: 12, mouthHeight: 3 };
    }
  };

  const eyeColor = getEmotionColor();
  const expression = getEmotionExpression();
  const gradientColors: [string, string] = premium 
    ? ['#F59E0B', '#D97706'] 
    : ['#00E67A', '#00D166'];

  const Container: any = animated ? Animated.View : View;
  const containerStyle = [
    styles.container,
    animated && {
      transform: [
        { translateY: bounceAnim },
        { scale: scaleAnim }
      ],
      opacity: blinkAnim,
    }
  ].filter(Boolean);

  return (
    <Container style={containerStyle} testID={testID}>
      <View style={[
        styles.glow, 
        { 
          width: size + 16, 
          height: size + 16,
          opacity: premium ? 0.4 : 0.2,
          backgroundColor: premium ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 230, 122, 0.15)'
        }
      ]} />
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size, borderRadius: size * 0.3 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors={true}
        />
      ) : (
        <LinearGradient
          colors={gradientColors}
          style={[styles.gradient, { width: size, height: size, borderRadius: size * 0.3 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.face, { width: size * 0.6, height: size * 0.6 }]}>
            <View style={styles.eyeContainer}>
              <View style={[styles.eye, { 
                backgroundColor: eyeColor,
                width: expression.eyeSize,
                height: expression.eyeSize,
                borderRadius: expression.eyeSize / 2
              }]} />
              <View style={[styles.eye, { 
                backgroundColor: eyeColor,
                width: expression.eyeSize,
                height: expression.eyeSize,
                borderRadius: expression.eyeSize / 2
              }]} />
            </View>
            <View style={[styles.mouth, { 
              backgroundColor: eyeColor,
              width: expression.mouthWidth,
              height: expression.mouthHeight,
              borderRadius: expression.mouthHeight,
              marginTop: 6
            }]} />
          </View>
        </LinearGradient>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  face: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eyeContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  eye: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  mouth: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  glow: {
    position: 'absolute',
    borderRadius: 50,
    top: -8,
    left: -8,
  },
});

export default SageMascot;
