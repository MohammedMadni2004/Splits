import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Switch, Text } from 'react-native';
import tw from 'twrnc';

import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={[tw`flex-row justify-between items-center p-4`, { backgroundColor: Colors[theme].background }]}>
        <Text style={[tw`text-lg font-bold`, { color: Colors[theme].text }]}>Splitzz</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={[tw`mr-2`, { color: Colors[theme].text }]}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'dark' ? Colors.dark.tint : Colors.light.tint}
            trackColor={{ false: Colors.light.icon, true: Colors.dark.icon }}
          />
        </View>
      </View>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors[theme].background },
          headerTintColor: Colors[theme].text,
          contentStyle: { backgroundColor: Colors[theme].background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="GroupDetails" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
