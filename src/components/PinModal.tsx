import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { API_ENDPOINTS } from '../config/api';

interface PinModalProps {
  visible: boolean;
  mode: 'verify' | 'set';
  userId: number;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  visible,
  mode,
  userId,
  onSuccess,
  onClose,
}) => {
  const { theme } = useTheme();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      setError('Please enter exactly 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'verify') {
        const res = await fetch(API_ENDPOINTS.verifyMenuPin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, pin }),
        });
        const data = await res.json();
        if (res.ok) {
          setPin('');
          onSuccess();
        } else {
          setError(data.message || 'Incorrect PIN');
        }
      } else {
        const res = await fetch(API_ENDPOINTS.setMenuPin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, pin }),
        });
        const data = await res.json();
        if (res.ok) {
          setPin('');
          onSuccess();
        } else {
          setError(data.message || 'Failed to set PIN');
        }
      }
    } catch {
      setError('Unable to connect to server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: theme.accentBg }]}>
            <Ionicons
              name={mode === 'verify' ? 'lock-closed' : 'key'}
              size={28}
              color={theme.accent}
            />
          </View>

          <Text style={[styles.title, { color: theme.textHeading }]}>
            {mode === 'verify' ? 'Enter PIN' : 'Set a PIN'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {mode === 'verify'
              ? 'Enter your 6-digit PIN to access Self Details'
              : 'Create a 6-digit PIN to protect Self Details'}
          </Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={[
                styles.pinInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: error ? theme.danger : theme.border,
                  color: theme.textHeading,
                },
              ]}
              value={pin}
              onChangeText={val => {
                const clean = val.replace(/\D/g, '').slice(0, 6);
                setPin(clean);
                setError('');
              }}
              placeholder="••••••"
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              autoFocus
            />
          </View>

          {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.border }]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtnWrap}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>
                    {mode === 'verify' ? 'Unlock' : 'Set PIN'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  inputWrap: {
    width: '100%',
    marginBottom: 8,
  },
  pinInput: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 24,
    letterSpacing: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 14,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtnWrap: {
    flex: 1,
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
