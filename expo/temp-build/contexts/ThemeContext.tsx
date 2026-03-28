import { useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import colors from '@/constants/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: typeof colors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'app_theme_mode';

export const [ThemeProvider, useTheme] = createContextHook<ThemeContextType>(() => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [, setIsLoaded] = useState(false);

  // Determine if dark mode should be active
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // Get theme-aware colors with safe fallbacks
  const themeColors = useMemo(() => {
    const darkColors = colors.dark || {};
    const darkSurface = darkColors.surface || {};
    const darkText = darkColors.text || {};
    const darkBorder = darkColors.border || {};
    
    return {
      ...colors,
      // Override colors based on theme with safe fallbacks
      surface: {
        primary: isDark ? (darkSurface.primary || '#0F0F0F') : colors.surface.primary,
        secondary: isDark ? (darkSurface.secondary || '#1A1A1A') : colors.surface.secondary,
        tertiary: isDark ? (darkSurface.tertiary || '#262626') : colors.surface.tertiary,
        elevated: isDark ? (darkSurface.elevated || '#1F1F1F') : colors.surface.elevated,
        overlay: isDark ? (darkSurface.overlay || 'rgba(0, 0, 0, 0.8)') : colors.surface.overlay,
        warm: isDark ? (darkSurface.primary || '#0F0F0F') : colors.surface.warm,
      },
      text: {
        primary: isDark ? (darkText.primary || '#FFFFFF') : colors.text.primary,
        secondary: isDark ? (darkText.secondary || '#E5E5E5') : colors.text.secondary,
        tertiary: isDark ? (darkText.tertiary || '#A3A3A3') : colors.text.tertiary,
        quaternary: isDark ? (darkText.quaternary || '#737373') : colors.text.quaternary,
        inverse: isDark ? (darkText.inverse || '#000000') : colors.text.inverse,
        accent: isDark ? (darkText.accent || '#00E67A') : colors.text.accent,
        sage: colors.text.sage,
      },
      border: {
        light: isDark ? (darkBorder.light || 'rgba(255, 255, 255, 0.08)') : colors.border.light,
        medium: isDark ? (darkBorder.medium || 'rgba(255, 255, 255, 0.12)') : colors.border.medium,
        strong: isDark ? (darkBorder.strong || 'rgba(255, 255, 255, 0.16)') : colors.border.strong,
        accent: isDark ? (darkBorder.accent || '#00E67A') : colors.border.accent,
        sage: colors.border.sage,
      },
      background: isDark ? (darkColors.background || '#000000') : colors.background,
      // Add gradient colors for compatibility
      gradient: {
        primary: colors.gradient?.primary || ['#00E67A', '#00D166'],
        secondary: colors.gradient?.secondary || ['#F59E0B', '#D97706'],
        accent: colors.gradient?.accent || ['#3B82F6', '#2563EB'],
        luxury: colors.gradient?.luxury || ['#F59E0B', '#D97706'],
        dark: colors.gradient?.dark || ['#0F172A', '#1E293B'],
        subtle: colors.gradient?.subtle || ['#F8FAFC', '#F1F5F9'],
      },
      // Add accent colors for compatibility
      accent: {
        gold: colors.accent?.gold || '#F59E0B',
        emerald: colors.accent?.emerald || '#10B981',
        emeraldLight: colors.accent?.emeraldLight || '#34D399',
        amber: colors.accent?.amber || '#F59E0B',
        blue: colors.accent?.blue || '#3B82F6',
        purple: colors.accent?.purple || '#8B5CF6',
        pink: colors.accent?.pink || '#EC4899',
      },
      // Add primary/secondary color scales for compatibility
      primary: colors.primary || {},
      secondary: colors.secondary || {},
      neutral: colors.neutral || {},
      // Add shadow for compatibility
      shadow: colors.shadow || {},
    };
  }, [isDark]);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  // Toggle between light and dark (skip system)
  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  return useMemo(() => ({
    themeMode,
    isDark,
    colors: themeColors,
    setThemeMode,
    toggleTheme,
  }), [themeMode, isDark, themeColors, setThemeMode, toggleTheme]);
});

export default ThemeProvider;