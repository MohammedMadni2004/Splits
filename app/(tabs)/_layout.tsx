import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const theme = useColorScheme(); // 'light' or 'dark'
  const isDarkTheme = theme === 'dark';

  const themeStyles = {
    tabBarActiveTintColor: isDarkTheme ? '#FF9800' : '#4CAF50',
    tabBarBackgroundColor: isDarkTheme ? '#121212' : '#FFFFFF',
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeStyles.tabBarActiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: themeStyles.tabBarBackgroundColor,
          },
          default: {
            backgroundColor: themeStyles.tabBarBackgroundColor,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
