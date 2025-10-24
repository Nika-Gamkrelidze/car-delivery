import { useAuth } from '@/lib/auth';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

function AuthRedirectGate() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace('/profile');
  }, [user]);
  return null;
}

export default function AuthLayout() {
  return (
    <>
      <AuthRedirectGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="customer/login" />
        <Stack.Screen name="customer/signup" />
        <Stack.Screen name="carrier/login" />
        <Stack.Screen name="carrier/signup" />
      </Stack>
    </>
  );
}


