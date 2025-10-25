import { useAuth } from '@/lib/auth';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Redirect href={user ? '/(tabs)/profile' : '/(auth)/login'} />;
}
