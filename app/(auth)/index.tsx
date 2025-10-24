import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuthLanding() {
  return (
    <ThemedView style={styles.container}>
      <Container>
        <ThemedText type="title">Choose your role</ThemedText>
        <View style={{ height: 12 }} />
        <Link href="/customer/login" asChild>
          <Button title="Customer Login" />
        </Link>
        <Link href="/customer/signup" asChild>
          <Button title="Customer Sign Up" variant="secondary" />
        </Link>
        <View style={{ height: 16 }} />
        <Link href="/carrier/login" asChild>
          <Button title="Carrier Login" />
        </Link>
        <Link href="/carrier/signup" asChild>
          <Button title="Carrier Sign Up" variant="secondary" />
        </Link>
      </Container>
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
  button: {},
  buttonText: {},
  secondary: {},
  secondaryText: {},
});


