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
import { CustomerData } from './CustomerFormModal';
import { API_ENDPOINTS } from '../config/api';

interface PaymentModalProps {
  visible: boolean;
  customer?: CustomerData | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  customer,
  onSuccess,
  onClose,
}) => {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    if (!customer?._id) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_ENDPOINTS.customerPayment(customer._id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), note }),
      });
      if (res.ok) {
        setAmount('');
        setNote('');
        onSuccess();
        onClose();
      } else {
        const d = await res.json();
        setError(d.message || 'Failed to record payment');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setNote('');
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
          <View style={[styles.iconWrap, { backgroundColor: theme.successBg }]}>
            <Ionicons name="card-outline" size={26} color={theme.success} />
          </View>

          <Text style={[styles.title, { color: theme.textHeading }]}>Record Payment</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Customer: <Text style={{ fontWeight: '700', color: theme.text }}>{customer?.name}</Text>
          </Text>

          <View style={[styles.balancePill, { backgroundColor: theme.accentBg }]}>
            <Text style={[styles.balanceLabel, { color: theme.accent }]}>Outstanding Balance:</Text>
            <Text style={[styles.balanceValue, { color: theme.accent }]}>
              ₹{Number(customer?.amount_balance || 0).toLocaleString()}
            </Text>
          </View>

          {/* Amount input */}
          <View style={styles.inputWrap}>
            <Text style={[styles.label, { color: theme.text }]}>Payment Amount (₹) *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: error ? theme.danger : theme.border,
                  color: theme.textHeading,
                },
              ]}
              placeholder="e.g. 5000"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={v => {
                setAmount(v);
                setError('');
              }}
              autoFocus
            />
          </View>

          {/* Note input */}
          <View style={styles.inputWrap}>
            <Text style={[styles.label, { color: theme.text }]}>Payment Note (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textHeading,
                },
              ]}
              placeholder="e.g. GPay / Cash / Cheque"
              placeholderTextColor={theme.textMuted}
              value={note}
              onChangeText={setNote}
            />
          </View>

          {error ? <Text style={[styles.errText, { color: theme.danger }]}>{error}</Text> : null}

          {/* Buttons */}
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
              <LinearGradient colors={theme.gradientPrimary} style={styles.submitBtn}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>Save Payment</Text>
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
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
  },
  balancePill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  inputWrap: {
    marginBottom: 12,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  errText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
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
    flex: 1.3,
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
