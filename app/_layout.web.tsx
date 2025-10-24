import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

import HeaderNav from '@/components/header-nav';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth';
import { runMigrations } from '@/lib/migrations';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { user, loading } = useAuth();
  return (
    <Stack>
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
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <Startup>
          <HeaderGate />
        </Startup>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function HeaderGate() {
  const { user } = useAuth();
  return (
    <>
      {user ? <HeaderNav /> : null}
      <RootNavigator />
    </>
  );
}

function Startup({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    runMigrations();
  }, []);
  return <>{children}</>;
}


