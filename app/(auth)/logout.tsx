import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await logout();
      router.replace('/login');
    })();
  }, []);
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText>Signing out…</ThemedText>
    </ThemedView>
  );
}


