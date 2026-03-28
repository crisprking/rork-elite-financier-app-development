import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/shared/ErrorBoundary";


SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function RootLayoutNav() {
  const { colors: themeColors } = useTheme();
  
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: themeColors.surface.primary,
        },
        headerTintColor: themeColors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
      }}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          presentation: "fullScreenModal",
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="paywall" 
        options={{ 
          presentation: "modal", 
          title: "FinSage Pro",
          headerStyle: {
            backgroundColor: '#00E67A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
            color: '#FFFFFF',
          },
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          title: "Calculation History",
        }} 
      />
      <Stack.Screen 
        name="export" 
        options={{ 
          title: "Export Data",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}

function ThemedStatusBar() {
  const { isDark, colors: themeColors } = useTheme();
  
  return (
    <StatusBar 
      style={isDark ? "light" : "dark"} 
      backgroundColor={themeColors.surface.primary}
      translucent={false}
    />
  );
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Minimum splash time
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };
    
    hideSplash();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SubscriptionProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemedStatusBar />
                <RootLayoutNav />
              </GestureHandlerRootView>
            </SubscriptionProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}