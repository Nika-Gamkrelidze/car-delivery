import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayoutWeb() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}


