import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function CarrierSignupScreen() {
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
      await signup({ email, password, name, role: 'carrier' });
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Carrier Sign Up</ThemedText>
        <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={submitting}>
          <ThemedText style={styles.buttonText}>{submitting ? 'Creating…' : 'Create account'}</ThemedText>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <Link href="/carrier/login" asChild>
          <TouchableOpacity>
            <ThemedText type="link">Already have an account? Sign in</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
});


