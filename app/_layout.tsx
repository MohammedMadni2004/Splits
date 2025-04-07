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
      <View
        style={[
          tw`flex-row justify-between items-center p-4 shadow-lg`,
          {
            backgroundColor: isDarkTheme ? '#1E1E2C' : '#F8F9FA',
            borderBottomWidth: 1,
            borderBottomColor: isDarkTheme ? '#2C2C3E' : '#E0E0E0',
          },
        ]}
      >
        <Text
          style={[
            tw`text-xl font-extrabold`,
            {
              color: isDarkTheme ? '#FFD700' : '#1E293B',
              textShadowColor: isDarkTheme ? '#000' : '#D3D3D3',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            },
          ]}
        >
          Splitzz
        </Text>
        <View style={tw`flex-row items-center`}>
          <Text style={[tw`mr-2`, { color: isDarkTheme ? '#E0E0E0' : '#212121' }]}>Dark Mode</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme} // Update the theme state on toggle
            thumbColor={isDarkTheme ? '#FFD700' : '#4CAF50'}
            trackColor={{ false: '#BDBDBD', true: '#757575' }}
          />
        </View>
      </View>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkTheme ? '#1E1E2C' : '#F8F9FA',
            shadowColor: isDarkTheme ? '#000' : '#D3D3D3',
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          headerTintColor: isDarkTheme ? '#FFD700' : '#1E293B',
          contentStyle: {
            backgroundColor: isDarkTheme ? '#121212' : '#FFFFFF',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="GroupDetails" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
