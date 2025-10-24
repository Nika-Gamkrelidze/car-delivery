import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

import { ThemeProviderOverride } from '@/hooks/theme-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth';
import { runMigrations } from '@/lib/migrations';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { user, loading } = useAuth();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {loading ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </>
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProviderOverride>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Startup>
            <RootNavigator />
          </Startup>
        </AuthProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </ThemeProviderOverride>
  );
}

function Startup({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    runMigrations();
  }, []);
  return <>{children}</>;
}
