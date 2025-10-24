import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'carrier'>('customer');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || !name) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      await signup({ email, password, name, role });
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
        <ThemedText type="title">Create account</ThemedText>
        <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        <View style={styles.segmentContainer}>
          <TouchableOpacity style={[styles.segment, role === 'customer' && styles.segmentActive]} onPress={() => setRole('customer')}>
            <ThemedText style={[styles.segmentText, role === 'customer' && styles.segmentTextActive]}>Customer</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segment, role === 'carrier' && styles.segmentActive]} onPress={() => setRole('carrier')}>
            <ThemedText style={[styles.segmentText, role === 'carrier' && styles.segmentTextActive]}>Carrier</ThemedText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={submitting}>
          <ThemedText style={styles.buttonText}>{submitting ? 'Creating…' : 'Create account'}</ThemedText>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <Link href="/login" asChild>
          <TouchableOpacity>
            <ThemedText type="link">Already have an account? Sign in</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  segmentContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  segmentText: {
    color: '#111827',
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#1e40af',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});


