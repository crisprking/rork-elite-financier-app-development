import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Calculator, Car, Home } from "lucide-react-native";
import { View, StyleSheet, Platform, Animated, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import colors, { spacing, borderRadius } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabIconProps {
  color: string;
  focused: boolean;
  size?: number;
  icon: 'calculator' | 'mortgage' | 'car-loan';
  gradient: readonly [string, string];
  testID: string;
}

const TabIcon: React.FC<TabIconProps> = ({ color, focused, size = 22, icon, gradient, testID }) => {
  const IconComponent = icon === 'calculator' ? Calculator : icon === 'mortgage' ? Home : Car;

  return (
    <Animated.View
      style={[styles.iconContainer, focused && styles.iconContainerActive]}
      testID={testID}
    >
      {focused && (
        <LinearGradient
          colors={gradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <IconComponent
        color={focused ? colors.text.inverse : color}
        size={size}
        strokeWidth={focused ? 2.6 : 2.2}
        style={{ zIndex: 10, position: 'relative' }}
      />
    </Animated.View>
  );
};

const AutoHideTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors: themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minimizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tabBarHeight = Platform.OS === 'ios' ? 104 : 84;
  const minimizedHeight = 24;

  const showTabBar = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (minimizeTimer.current) {
      clearTimeout(minimizeTimer.current);
      minimizeTimer.current = null;
    }
    
    setIsVisible(true);
    setIsMinimized(false);
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scaleY, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      })
    ]).start();

    // Auto-minimize after 3 seconds of inactivity
    minimizeTimer.current = setTimeout(() => {
      minimizeTabBar();
    }, 3000);
  };

  const minimizeTabBar = () => {
    setIsMinimized(true);
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: tabBarHeight - minimizedHeight - insets.bottom,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scaleY, {
        toValue: 0.3,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      })
    ]).start();

    // Auto-hide completely after 5 more seconds
    hideTimer.current = setTimeout(() => {
      hideTabBar();
    }, 5000);
  };

  const hideTabBar = () => {
    setIsVisible(false);
    
    Animated.spring(translateY, {
      toValue: tabBarHeight + insets.bottom,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  useEffect(() => {
    showTabBar();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (minimizeTimer.current) clearTimeout(minimizeTimer.current);
    };
  }, [state.index]);

  const handleTabPress = (route: any, isFocused: boolean) => {
    showTabBar();
    
    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.tabBarContainer,
          {
            backgroundColor: themeColors.surface.elevated,
            paddingBottom: insets.bottom,
            transform: [{ translateY }, { scaleY }],
          },
        ]}
      >
        <View style={styles.tabBarContent}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const getIconProps = () => {
              switch (route.name) {
                case 'index':
                  return { icon: 'calculator' as const, gradient: ['#00E67A', '#00D166'] as const };
                case 'mortgage':
                  return { icon: 'mortgage' as const, gradient: ['#00E67A', '#00D166'] as const };
                case 'car-loan':
                  return { icon: 'car-loan' as const, gradient: ['#5B6FE8', '#6B5B95'] as const };
                default:
                  return { icon: 'calculator' as const, gradient: ['#00E67A', '#00D166'] as const };
              }
            };

            const iconProps = getIconProps();

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => handleTabPress(route, isFocused)}
                testID={`tab-${route.name}`}
              >
                <TabIcon
                  color={isFocused ? '#00E67A' : '#737373'}
                  focused={isFocused}
                  size={isMinimized ? 16 : 22}
                  {...iconProps}
                  testID={`tab-${route.name}-icon`}
                />
                {!isMinimized && (
                  <Animated.Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused ? '#00E67A' : '#737373',
                      },
                    ]}
                  >
                    {options.title}
                  </Animated.Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
      
      {/* Invisible touch area to show tab bar when hidden */}
      {!isVisible && (
        <TouchableOpacity
          style={[
            styles.hiddenTouchArea,
            { bottom: insets.bottom }
          ]}
          onPress={showTabBar}
          testID="show-tab-bar-touch-area"
        />
      )}
    </>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AutoHideTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarAccessibilityLabel: 'Open Home',
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="calculator"
              gradient={['#00E67A', '#00D166']}
              testID="tab-calculator-icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mortgage"
        options={{
          title: "Mortgage",
          tabBarAccessibilityLabel: 'Mortgage Calculator',
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="mortgage"
              gradient={['#00E67A', '#00D166']}
              testID="tab-mortgage-icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="car-loan"
        options={{
          title: "Car Loan",
          tabBarAccessibilityLabel: 'Car Loan Calculator',
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="car-loan"
              gradient={['#5B6FE8', '#6B5B95']}
              testID="tab-car-loan-icon"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    position: 'relative',
    marginBottom: 2,
  },
  iconContainerActive: {
    transform: [{ scale: 1.03 }],
  },
  iconGradient: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow.sm.shadowColor,
    shadowOffset: colors.shadow.sm.shadowOffset,
    shadowOpacity: colors.shadow.sm.shadowOpacity,
    shadowRadius: colors.shadow.sm.shadowRadius,
    elevation: colors.shadow.sm.elevation,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingTop: spacing[4],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[2],
    height: Platform.OS === 'ios' ? 104 : 84,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    marginHorizontal: spacing[1],
    minHeight: 60,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing[1],
    letterSpacing: 0.3,
  },
  hiddenTouchArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'transparent',
  },
});