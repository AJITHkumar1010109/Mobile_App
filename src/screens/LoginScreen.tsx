import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { API_ENDPOINTS } from '../config/api';

interface LoginScreenProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ showToast }) => {
  const { login } = useAuth();
  const { theme } = useTheme();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }
    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Invalid credentials', 'error');
      } else {
        showToast('Login successful! Welcome back 👋', 'success');
        setTimeout(() => {
          login(data.phone, data.userId, data.username || '');
        }, 500);
      }
    } catch {
      showToast('Unable to connect to server. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={theme.gradientPrimary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              {/* Logo Area */}
              <View style={styles.logoArea}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.logoCircle}
                >
                  <Text style={styles.logoLetter}>B</Text>
                </LinearGradient>
                <Text style={[styles.title, { color: theme.textHeading }]}>Business Portal</Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  Sign in to your account
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Phone field */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={theme.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.textHeading }]}
                      placeholder="Enter phone number"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      value={phone}
                      onChangeText={setPhone}
                      autoComplete="off"
                    />
                  </View>
                </View>

                {/* Password field */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={theme.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.textHeading }]}
                      placeholder="Enter password"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoComplete="off"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={theme.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit button */}
                <TouchableOpacity
                  style={styles.submitBtnWrap}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <View style={styles.btnContent}>
                        <Text style={styles.submitBtnText}>Sign In</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  logoLetter: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    outline: 'none',
  } as any,
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    outlineWidth: 0,
    outlineStyle: 'none',
    backgroundColor: 'transparent',
  } as any,
  eyeBtn: {
    padding: 6,
  },
  submitBtnWrap: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
