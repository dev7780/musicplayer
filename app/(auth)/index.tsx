import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function AuthScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        'Invalid credentials. For demo, use user@example.com or admin@example.com with password "password"'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      if (userType === 'user') {
        await login('user@example.com', 'password');
      } else {
        await login('admin@example.com', 'password');
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Something went wrong with the demo login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Sign in to your account to access your music
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          label="Email"
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Mail size={20} color={Colors.neutral[600]} />}
        />

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          label="Password"
          error={errors.password}
          secureTextEntry
          icon={<Lock size={20} color={Colors.neutral[600]} />}
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          variant="primary"
          size="large"
          loading={isLoading}
          style={styles.signInButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or try demo accounts</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.demoButtonsContainer}>
          <Button
            title="Regular User"
            onPress={() => handleDemoLogin('user')}
            variant="outline"
            size="medium"
            style={styles.demoButton}
          />
          <Button
            title="Admin User"
            onPress={() => handleDemoLogin('admin')}
            variant="outline"
            size="medium"
            style={styles.demoButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxxl,
    color: Colors.neutral[900],
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[300],
  },
  dividerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
    marginHorizontal: Spacing.sm,
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
});