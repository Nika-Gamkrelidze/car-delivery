import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import Input from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomerSignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || !name) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      await signup({ email, password, name, role: 'customer' });
      router.replace('/profile');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <Container>
          <ThemedText type="title">Customer Sign Up</ThemedText>
          <Input placeholder="Name" value={name} onChangeText={setName} />
          <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button title={submitting ? 'Creating…' : 'Create account'} onPress={onSubmit} disabled={submitting} />
          <View style={{ height: 12 }} />
          <Link href="/customer/login" asChild>
            <TouchableOpacity>
              <ThemedText type="link">Already have an account? Sign in</ThemedText>
            </TouchableOpacity>
          </Link>
        </Container>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  input: {},
  button: {},
  buttonText: {},
});


