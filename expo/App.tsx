import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import InsightsScreen from './screens/InsightsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#000000" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: keyof typeof Ionicons.glyphMap;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Analytics') {
                    iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                  } else if (route.name === 'Insights') {
                    iconName = focused ? 'bulb' : 'bulb-outline';
                  } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  } else {
                    iconName = 'home-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#FFFFFF',
                tabBarStyle: {
                  backgroundColor: '#1A1A1A',
                  borderTopColor: '#333333',
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                },
                headerStyle: {
                  backgroundColor: '#000000',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            >
              <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: "Today's Habits" }}
              />
              <Tab.Screen 
                name="Analytics" 
                component={AnalyticsScreen} 
                options={{ title: "Analytics" }}
              />
              <Tab.Screen 
                name="Insights" 
                component={InsightsScreen} 
                options={{ title: "AI Insights" }}
              />
              <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ title: "Profile" }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </SubscriptionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

