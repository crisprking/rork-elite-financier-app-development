import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ViewStyle, LayoutChangeEvent, PanResponder, Animated } from 'react-native';
import colors from '@/constants/colors';

interface BaseProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: ViewStyle;
  testID?: string;
}

const TRACK_HEIGHT = 8;
const THUMB_SIZE = 32;
const CONTAINER_PADDING = 16;
const TOUCH_AREA_EXPANSION = 20;

const PremiumSlider: React.FC<BaseProps> = React.memo(({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  minimumTrackTintColor = '#00E67A', // Softer green
  maximumTrackTintColor = 'rgba(245,245,245,0.15)', // Much softer track
  thumbTintColor = '#00E67A', // Softer green
  style,
  testID,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<number>(value);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const containerRef = useRef<View>(null);
  const lastEmittedValue = useRef<number>(value);
  const dragStartX = useRef<number>(0);
  const dragStartValue = useRef<number>(value);
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Sync internal value with external value changes
  useEffect(() => {
    if (!isDragging && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, isDragging, internalValue]);

  const normalizedValue = useMemo(() => {
    const range = maximumValue - minimumValue;
    if (range <= 0) return { value: minimumValue, percentage: 0 };
    
    const currentValue = isDragging ? internalValue : value;
    const clampedValue = Math.max(minimumValue, Math.min(currentValue, maximumValue));
    let finalValue = clampedValue;
    
    if (step > 0) {
      const steps = Math.round((clampedValue - minimumValue) / step);
      finalValue = minimumValue + (steps * step);
      finalValue = Math.max(minimumValue, Math.min(finalValue, maximumValue));
    }
    
    const percentage = ((finalValue - minimumValue) / range) * 100;
    return { value: finalValue, percentage };
  }, [internalValue, value, minimumValue, maximumValue, step, isDragging]);

  const calculateValueFromPosition = useCallback((x: number): number => {
    if (containerWidth <= CONTAINER_PADDING * 2) return minimumValue;
    
    const trackWidth = containerWidth - (CONTAINER_PADDING * 2);
    const clampedX = Math.max(0, Math.min(x - CONTAINER_PADDING, trackWidth));
    const ratio = trackWidth > 0 ? clampedX / trackWidth : 0;
    
    const range = maximumValue - minimumValue;
    const rawValue = minimumValue + (ratio * range);
    
    if (step > 0) {
      // Use more precise stepping for smoother control
      const steps = Math.round((rawValue - minimumValue) / step);
      const steppedValue = minimumValue + (steps * step);
      return Math.max(minimumValue, Math.min(steppedValue, maximumValue));
    }
    
    return Math.max(minimumValue, Math.min(rawValue, maximumValue));
  }, [containerWidth, minimumValue, maximumValue, step]);

  const calculateValueFromDelta = useCallback((deltaX: number): number => {
    if (containerWidth <= CONTAINER_PADDING * 2) return dragStartValue.current;
    
    const trackWidth = containerWidth - (CONTAINER_PADDING * 2);
    const range = maximumValue - minimumValue;
    const sensitivity = range / trackWidth;
    
    // Ultra-smooth sensitivity for comfortable control
    let sensitivityMultiplier = 1;
    if (step < 0.1) sensitivityMultiplier = 0.2; // Even more precise
    else if (step < 1) sensitivityMultiplier = 0.3; // More precise
    else if (step < 10) sensitivityMultiplier = 0.5; // Smoother
    else if (step < 100) sensitivityMultiplier = 0.7; // More controlled
    
    const adjustedDelta = deltaX * sensitivity * sensitivityMultiplier;
    const newValue = dragStartValue.current + adjustedDelta;
    
    if (step > 0) {
      const steps = Math.round((newValue - minimumValue) / step);
      const steppedValue = minimumValue + (steps * step);
      return Math.max(minimumValue, Math.min(steppedValue, maximumValue));
    }
    
    return Math.max(minimumValue, Math.min(newValue, maximumValue));
  }, [containerWidth, minimumValue, maximumValue, step]);

  const emitValueChange = useCallback((newValue: number) => {
    if (Math.abs(newValue - lastEmittedValue.current) > 0.001) {
      lastEmittedValue.current = newValue;
      onValueChange(newValue);
    }
  }, [onValueChange]);

  const throttledEmitValueChange = useCallback((newValue: number) => {
    if (throttleTimer.current) {
      clearTimeout(throttleTimer.current);
    }
    
    throttleTimer.current = setTimeout(() => {
      emitValueChange(newValue);
    }, 16); // ~60fps throttling
  }, [emitValueChange]);

  const handlePanStart = useCallback((evt: any) => {
    setIsDragging(true);
    dragStartX.current = evt.nativeEvent.locationX;
    dragStartValue.current = value;
    
    // Gentle animations for comfortable feedback
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.08, // Less dramatic scaling
        useNativeDriver: true,
        tension: 300, // Softer spring
        friction: 10, // More damping
      }),
      Animated.timing(glowAnim, {
        toValue: 0.8, // Softer glow
        duration: 200, // Slower transition
        useNativeDriver: false,
      })
    ]).start();
    
    const newValue = calculateValueFromPosition(evt.nativeEvent.locationX);
    setInternalValue(newValue);
    emitValueChange(newValue);
  }, [calculateValueFromPosition, emitValueChange, scaleAnim, glowAnim, value]);

  const handlePanMove = useCallback((evt: any) => {
    const deltaX = evt.nativeEvent.locationX - dragStartX.current;
    const newValue = calculateValueFromDelta(deltaX);
    
    setInternalValue(newValue);
    throttledEmitValueChange(newValue);
  }, [calculateValueFromDelta, throttledEmitValueChange]);

  const handlePanEnd = useCallback(() => {
    setIsDragging(false);
    
    // Clear any pending throttled updates
    if (throttleTimer.current) {
      clearTimeout(throttleTimer.current);
      throttleTimer.current = null;
    }
    
    // Gentle end animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300, // Softer spring
        friction: 10, // More damping
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300, // Slower fade out
        useNativeDriver: false,
      })
    ]).start();
    
    // Ensure final value is emitted immediately
    emitValueChange(internalValue);
  }, [scaleAnim, glowAnim, emitValueChange, internalValue]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Ultra-sensitive movement detection for smooth control
      return Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1;
    },
    onPanResponderGrant: handlePanStart,
    onPanResponderMove: handlePanMove,
    onPanResponderRelease: handlePanEnd,
    onPanResponderTerminate: handlePanEnd,
    onPanResponderTerminationRequest: () => false, // Don't allow termination during drag
  }), [handlePanStart, handlePanMove, handlePanEnd]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  const thumbPosition = useMemo(() => {
    if (containerWidth <= CONTAINER_PADDING * 2) return 0;
    const trackWidth = containerWidth - (CONTAINER_PADDING * 2);
    const position = (normalizedValue.percentage / 100) * trackWidth;
    return Math.max(0, Math.min(position, trackWidth));
  }, [containerWidth, normalizedValue.percentage]);

  return (
    <View
      ref={containerRef}
      testID={testID}
      onLayout={onLayout}
      style={[styles.container, style]}
      {...panResponder.panHandlers}
    >
      {/* Expanded Touch Area */}
      <View style={styles.touchArea} />
      
      {/* Track Background */}
      <View style={[styles.track, { 
        height: TRACK_HEIGHT, 
        backgroundColor: maximumTrackTintColor,
        borderRadius: TRACK_HEIGHT / 2
      }]} />
      
      {/* Track Fill with Glow Effect */}
      <Animated.View
        style={[
          styles.trackFill,
          {
            height: TRACK_HEIGHT,
            backgroundColor: minimumTrackTintColor,
            width: `${Math.max(0, Math.min(100, normalizedValue.percentage))}%`,
            borderRadius: TRACK_HEIGHT / 2,
            shadowColor: minimumTrackTintColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnim,
            shadowRadius: 8,
            elevation: isDragging ? 4 : 0,
          },
        ]}
      />
      
      {/* Thumb with Enhanced Visual Feedback */}
      <Animated.View
        style={[
          styles.thumb,
          {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: thumbTintColor,
            left: thumbPosition + CONTAINER_PADDING,
            transform: [{ scale: scaleAnim }],
            shadowColor: thumbTintColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDragging ? 0.4 : 0.2, // Softer shadows
            shadowRadius: isDragging ? 8 : 4, // Smaller shadow radius
            elevation: isDragging ? 6 : 3, // Lower elevation
          },
        ]}
      >
        {/* Thumb Inner Ring */}
        <View
          style={[
            styles.thumbInner,
            {
              width: THUMB_SIZE - 10,
              height: THUMB_SIZE - 10,
              borderRadius: (THUMB_SIZE - 10) / 2,
              backgroundColor: '#FFFFFF', // Pure white inner
              opacity: isDragging ? 0.95 : 0.9 // Softer opacity
            },
          ]}
        />
        
        {/* Active Indicator */}
        {isDragging && (
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                opacity: glowAnim,
                transform: [{ scale: glowAnim }],
              }
            ]}
          />
        )}
      </Animated.View>
    </View>
  );
});

PremiumSlider.displayName = 'PremiumSlider';

const PlatformSlider: React.FC<BaseProps> = (props) => {
  return <PremiumSlider {...props} />;
};

export default PlatformSlider;

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: CONTAINER_PADDING,
  },
  touchArea: {
    position: 'absolute',
    top: -TOUCH_AREA_EXPANSION,
    left: 0,
    right: 0,
    bottom: -TOUCH_AREA_EXPANSION,
    zIndex: 1,
  },
  track: {
    position: 'absolute',
    left: CONTAINER_PADDING,
    right: CONTAINER_PADDING,
  },
  trackFill: {
    position: 'absolute',
    left: CONTAINER_PADDING,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    marginTop: -THUMB_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)', // Softer border
    zIndex: 2,
  },
  thumbInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -(THUMB_SIZE - 10) / 2,
    marginLeft: -(THUMB_SIZE - 10) / 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: (THUMB_SIZE + 8) / 2,
    borderWidth: 2,
    borderColor: '#00E67A', // Softer green indicator
    backgroundColor: 'transparent',
  },
});