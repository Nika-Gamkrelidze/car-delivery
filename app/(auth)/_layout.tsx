import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Authenticate' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="customer/login" options={{ title: 'Customer Login' }} />
      <Stack.Screen name="customer/signup" options={{ title: 'Customer Sign Up' }} />
      <Stack.Screen name="carrier/login" options={{ title: 'Carrier Login' }} />
      <Stack.Screen name="carrier/signup" options={{ title: 'Carrier Sign Up' }} />
    </Stack>
  );
}


