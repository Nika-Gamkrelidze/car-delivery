import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AuthLanding() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Choose your role</ThemedText>
      <View style={{ height: 12 }} />
      <Link href="/customer/login" asChild>
        <TouchableOpacity style={styles.button}><ThemedText style={styles.buttonText}>Customer Login</ThemedText></TouchableOpacity>
      </Link>
      <Link href="/customer/signup" asChild>
        <TouchableOpacity style={styles.secondary}><ThemedText style={styles.secondaryText}>Customer Sign Up</ThemedText></TouchableOpacity>
      </Link>
      <View style={{ height: 16 }} />
      <Link href="/carrier/login" asChild>
        <TouchableOpacity style={styles.button}><ThemedText style={styles.buttonText}>Carrier Login</ThemedText></TouchableOpacity>
      </Link>
      <Link href="/carrier/signup" asChild>
        <TouchableOpacity style={styles.secondary}><ThemedText style={styles.secondaryText}>Carrier Sign Up</ThemedText></TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '600' },
  secondary: {
    borderWidth: 1,
    borderColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryText: { color: '#2563eb', fontWeight: '600' },
});


