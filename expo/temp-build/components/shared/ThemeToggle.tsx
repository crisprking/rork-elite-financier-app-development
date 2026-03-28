import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Sun, Moon, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/constants/colors';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'md', 
  showLabels = false,
  style 
}) => {
  const { themeMode, setThemeMode, colors } = useTheme();
  
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const containerSize = size === 'sm' ? 32 : size === 'md' ? 40 : 48;

  const modes = [
    { key: 'light' as const, icon: Sun, label: 'Light' },
    { key: 'dark' as const, icon: Moon, label: 'Dark' },
    { key: 'system' as const, icon: Smartphone, label: 'Auto' },
  ];

  return (
    <View style={[styles.container, style]}>
      {modes.map((mode) => {
        const isActive = themeMode === mode.key;
        const IconComponent = mode.icon;
        
        return (
          <TouchableOpacity
            key={mode.key}
            onPress={() => setThemeMode(mode.key)}
            style={[
              styles.button,
              {
                width: containerSize,
                height: containerSize,
                backgroundColor: isActive 
                  ? '#00E67A' 
                  : colors.surface.secondary,
                borderColor: isActive 
                  ? '#00E67A' 
                  : colors.border.medium,
              }
            ]}
            activeOpacity={0.7}
            testID={`theme-toggle-${mode.key}`}
          >
            <IconComponent
              size={iconSize}
              color={isActive ? colors.text.inverse : colors.text.secondary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const SimpleThemeToggle: React.FC<{ style?: any }> = ({ style }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.simpleButton,
        {
          backgroundColor: colors.surface.secondary,
          borderColor: colors.border.medium,
        },
        style
      ]}
      activeOpacity={0.7}
      testID="simple-theme-toggle"
    >
      <Animated.View style={styles.iconContainer}>
        {isDark ? (
          <Sun
            size={20}
            color={colors.text.primary}
            strokeWidth={2.5}
          />
        ) : (
          <Moon
            size={20}
            color={colors.text.primary}
            strokeWidth={2.5}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: borderRadius.xl,
    padding: spacing[1],
    gap: spacing[1],
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  simpleButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeToggle;