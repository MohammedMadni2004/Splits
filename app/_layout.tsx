import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Switch, Text, useColorScheme } from 'react-native';
import tw from 'twrnc';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Manage theme state

  const themeStyles = {
    backgroundColor: isDarkTheme ? '#121212' : '#F5F5F5',
    textColor: isDarkTheme ? '#E0E0E0' : '#212121',
    accentColor: isDarkTheme ? '#FF9800' : '#4CAF50',
    borderColor: isDarkTheme ? '#424242' : '#E0E0E0',
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev); // Toggle the theme state
  };

  return (
    <ThemeProvider value={isDarkTheme ? DarkTheme : DefaultTheme}>
      <View style={[tw`flex-row justify-between items-center p-4`, { backgroundColor: themeStyles.backgroundColor }]}>
        <Text style={[tw`text-lg font-bold`, { color: themeStyles.textColor }]}>Splitzz</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={[tw`mr-2`, { color: themeStyles.textColor }]}>Dark Mode</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme} // Update the theme state on toggle
            thumbColor={themeStyles.accentColor}
            trackColor={{ false: '#BDBDBD', true: '#757575' }}
          />
        </View>
      </View>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: themeStyles.backgroundColor },
          headerTintColor: themeStyles.textColor,
          contentStyle: { backgroundColor: themeStyles.backgroundColor },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="GroupDetails" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
