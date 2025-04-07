import { View, type ViewProps, useColorScheme } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useColorScheme(); // 'light' or 'dark'
  const isDarkTheme = theme === 'dark';

  const backgroundColor = isDarkTheme ? darkColor || '#121212' : lightColor || '#FFFFFF';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
