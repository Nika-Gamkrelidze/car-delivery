import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import Input from '@/components/ui/input';
import { Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'carrier'>('customer');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  
  const cardBackground = useThemeColor({}, 'surface');
  const iconColor = useThemeColor({ light: Palette.gray[400], dark: Palette.gray[500] }, 'icon');
  const segmentBg = useThemeColor({ light: '#fff', dark: Palette.gray[800] }, 'surface');
  const segmentActiveBg = useThemeColor({ light: Palette.blue[50], dark: Palette.blue[900] }, 'surface');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: Palette.red[500] };
    if (password.length < 10) {
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (hasNumber || hasSpecial) return { strength: 3, label: 'Strong', color: Palette.green[600] };
      return { strength: 2, label: 'Medium', color: Palette.amber[500] };
    }
    return { strength: 3, label: 'Strong', color: Palette.green[600] };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async () => {
    // Reset errors
    setErrors({ name: '', email: '', password: '' });

    // Validation
    let hasError = false;
    const newErrors = { name: '', email: '', password: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Container style={[styles.card, { backgroundColor: cardBackground }]}>
            {/* Header Section */}
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Create account
              </ThemedText>
              <ThemedText style={styles.subtitle}>Sign up to get started with your journey</ThemedText>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Full name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  invalid={!!errors.name}
                  left={<Ionicons name="person-outline" size={20} color={iconColor} />}
                />
                {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Email address"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  invalid={!!errors.email}
                  left={<Ionicons name="mail-outline" size={20} color={iconColor} />}
                />
                {errors.email ? <ThemedText style={styles.errorText}>{errors.email}</ThemedText> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  invalid={!!errors.password}
                  left={<Ionicons name="lock-closed-outline" size={20} color={iconColor} />}
                  right={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={iconColor} />
                    </TouchableOpacity>
                  }
                />
                {errors.password ? (
                  <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
                ) : password.length > 0 ? (
                  <View style={styles.passwordStrength}>
                    <View style={styles.strengthBarContainer}>
                      {[1, 2, 3].map((level) => (
                        <View
                          key={level}
                          style={[
                            styles.strengthBar,
                            passwordStrength.strength >= level && { backgroundColor: passwordStrength.color },
                          ]}
                        />
                      ))}
                    </View>
                    {passwordStrength.label ? (
                      <ThemedText style={[styles.strengthText, { color: passwordStrength.color }]}>{passwordStrength.label}</ThemedText>
                    ) : null}
                  </View>
                ) : null}
              </View>

              {/* Role Selection */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>I am a</ThemedText>
                <View style={styles.segmentContainer}>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      { backgroundColor: segmentBg },
                      role === 'customer' && { ...styles.segmentActive, backgroundColor: segmentActiveBg },
                    ]}
                    onPress={() => setRole('customer')}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={role === 'customer' ? Palette.blue[600] : iconColor}
                      style={styles.segmentIcon}
                    />
                    <ThemedText style={[styles.segmentText, role === 'customer' && styles.segmentTextActive]}>Customer</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      { backgroundColor: segmentBg },
                      role === 'carrier' && { ...styles.segmentActive, backgroundColor: segmentActiveBg },
                    ]}
                    onPress={() => setRole('carrier')}
                  >
                    <Ionicons
                      name="car-outline"
                      size={20}
                      color={role === 'carrier' ? Palette.blue[600] : iconColor}
                      style={styles.segmentIcon}
                    />
                    <ThemedText style={[styles.segmentText, role === 'carrier' && styles.segmentTextActive]}>Carrier</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <ThemedText style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <ThemedText style={styles.termsLink}>Terms of Service</ThemedText> and{' '}
                  <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
                </ThemedText>
              </View>

              {/* Submit Button */}
              <Button title="Create account" onPress={onSubmit} loading={submitting} disabled={submitting} size="lg" />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>or</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              {/* Login Link */}
              <View style={styles.footer}>
                <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <ThemedText style={styles.link}>Sign in</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </Container>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Palette.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.gray[700],
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: 13,
    color: Palette.red[600],
    marginLeft: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  strengthBarContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: Palette.gray[200],
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  segmentContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 2,
    borderColor: Palette.gray[300],
    borderRadius: Radius.md,
  },
  segmentActive: {
    borderColor: Palette.blue[600],
  },
  segmentIcon: {
    marginRight: Spacing.xs,
  },
  segmentText: {
    color: Palette.gray[600],
    fontWeight: '600',
    fontSize: 15,
  },
  segmentTextActive: {
    color: Palette.blue[700],
    fontWeight: '700',
  },
  termsContainer: {
    marginTop: -Spacing.sm,
  },
  termsText: {
    fontSize: 13,
    color: Palette.gray[600],
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Palette.blue[600],
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.gray[200],
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 14,
    color: Palette.gray[500],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: Palette.gray[600],
  },
  link: {
    fontSize: 15,
    color: Palette.blue[600],
    fontWeight: '600',
  },
});


