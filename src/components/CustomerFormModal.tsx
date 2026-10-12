import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export interface PaymentEntry {
  _id?: string;
  amount: number;
  received_at: string;
  note?: string;
}

export interface CustomerData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  native: string;
  district: string;
  address: string;
  amount_received: string;
  amount_balance: string;
  total_amount: string;
  status: 'Completed' | 'Pending';
  payment_history?: PaymentEntry[];
}

interface CustomerFormModalProps {
  visible: boolean;
  initial?: CustomerData | null;
  paymentCount?: number;
  onSave: (data: CustomerData) => Promise<void>;
  onClose: () => void;
}

type FieldError = Partial<Record<keyof CustomerData, string>>;

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  visible,
  initial,
  paymentCount = 0,
  onSave,
  onClose,
}) => {
  const { theme } = useTheme();

  const emptyForm: CustomerData = {
    name: '',
    email: '',
    phone: '',
    native: '',
    district: '',
    address: '',
    amount_received: '',
    amount_balance: '',
    total_amount: '',
    status: 'Pending',
  };

  const [form, setForm] = useState<CustomerData>(emptyForm);
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initial) {
        setForm({ ...initial });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
      setSubmitting(false);
    }
  }, [visible, initial]);

  const updateField = (key: keyof CustomerData, val: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'total_amount' || key === 'amount_received') {
        const total = parseFloat(key === 'total_amount' ? val : prev.total_amount) || 0;
        const received = parseFloat(key === 'amount_received' ? val : prev.amount_received) || 0;
        const balance = Math.max(0, total - received);
        next.amount_balance = balance.toString();
        next.status = balance <= 0 ? 'Completed' : 'Pending';
      }
      return next;
    });
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handlePhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 10);
    updateField('phone', digits);
  };

  const validate = (): boolean => {
    const errs: FieldError = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email address is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (form.phone.length !== 10) errs.phone = 'Phone must be exactly 10 digits';
    if (!form.native.trim()) errs.native = 'Native is required';
    if (!form.district.trim()) errs.district = 'District is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (form.amount_received === '') errs.amount_received = 'Amount received is required';
    if (form.total_amount === '') errs.total_amount = 'Total amount is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!initial?._id;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.titleRow}>
              <Ionicons
                name={isEditing ? 'create-outline' : 'person-add-outline'}
                size={22}
                color={theme.accent}
              />
              <Text style={[styles.title, { color: theme.textHeading }]}>
                {isEditing ? 'Edit Customer' : 'Add Customer'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
            {/* Full Name */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                Full Name <Text style={{ color: theme.danger }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: errors.name ? theme.danger : theme.border,
                    color: theme.textHeading,
                  },
                ]}
                placeholder="Enter full name"
                placeholderTextColor={theme.textMuted}
                value={form.name}
                onChangeText={v => updateField('name', v)}
              />
              {errors.name ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.name}</Text> : null}
            </View>

            {/* Email Address */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                Email Address <Text style={{ color: theme.danger }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: errors.email ? theme.danger : theme.border,
                    color: theme.textHeading,
                  },
                ]}
                placeholder="Enter email address"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={v => updateField('email', v)}
              />
              {errors.email ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.email}</Text> : null}
            </View>

            {/* Phone Number */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                Phone Number (10 digits) <Text style={{ color: theme.danger }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: errors.phone ? theme.danger : theme.border,
                    color: theme.textHeading,
                  },
                ]}
                placeholder="10-digit mobile number"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                maxLength={10}
                value={form.phone}
                onChangeText={handlePhone}
              />
              {errors.phone ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.phone}</Text> : null}
            </View>

            {/* Two column layout: Native & District */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Native <Text style={{ color: theme.danger }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: errors.native ? theme.danger : theme.border,
                      color: theme.textHeading,
                    },
                  ]}
                  placeholder="City / Native"
                  placeholderTextColor={theme.textMuted}
                  value={form.native}
                  onChangeText={v => updateField('native', v)}
                />
                {errors.native ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.native}</Text> : null}
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  District <Text style={{ color: theme.danger }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: errors.district ? theme.danger : theme.border,
                      color: theme.textHeading,
                    },
                  ]}
                  placeholder="District"
                  placeholderTextColor={theme.textMuted}
                  value={form.district}
                  onChangeText={v => updateField('district', v)}
                />
                {errors.district ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.district}</Text> : null}
              </View>
            </View>

            {/* Financials: Total Amount */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                Total Amount (₹) <Text style={{ color: theme.danger }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: errors.total_amount ? theme.danger : theme.border,
                    color: theme.textHeading,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={form.total_amount}
                onChangeText={v => updateField('total_amount', v)}
              />
              {errors.total_amount ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.total_amount}</Text> : null}
            </View>

            {/* Two column: Received & Balance */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Amount Received (₹) <Text style={{ color: theme.danger }}>*</Text>
                  {/* {isEditing && paymentCount > 0 ? (
                    <Text style={{ fontSize: 10, color: theme.warning, textTransform: 'none' }}> (Locked)</Text>
                  ) : null} */}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: (isEditing && paymentCount > 0) ? theme.border : theme.inputBg,
                      borderColor: errors.amount_received ? theme.danger : theme.border,
                      color: theme.textHeading,
                      opacity: (isEditing && paymentCount > 0) ? 0.7 : 1,
                    },
                  ]}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  editable={!(isEditing && paymentCount > 0)}
                  value={form.amount_received}
                  onChangeText={v => updateField('amount_received', v)}
                />
                {isEditing && paymentCount > 0 ? (
                  <Text style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>
                    Locked after Save Payment
                  </Text>
                ) : null}
                {errors.amount_received ? (
                  <Text style={[styles.errText, { color: theme.danger }]}>{errors.amount_received}</Text>
                ) : null}
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Balance (₹) <Text style={{ fontSize: 10, color: theme.textMuted }}>(Auto)</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.border,
                      borderColor: theme.border,
                      color: theme.textHeading,
                      opacity: 0.8,
                    },
                  ]}
                  placeholder="0"
                  editable={false}
                  value={form.amount_balance}
                />
              </View>
            </View>

            {/* Address */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>
                Address <Text style={{ color: theme.danger }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: errors.address ? theme.danger : theme.border,
                    color: theme.textHeading,
                  },
                ]}
                placeholder="Enter complete address"
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                value={form.address}
                onChangeText={v => updateField('address', v)}
              />
              {errors.address ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.address}</Text> : null}
            </View>
          </ScrollView>

          {/* Footer buttons */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtnWrap} onPress={handleSave} disabled={submitting}>
              <LinearGradient colors={theme.gradientPrimary} style={styles.saveBtn}>
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveText}>
                    {isEditing ? 'Update Customer' : 'Add Customer'}
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
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 14,
  },
  field: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtnWrap: {
    flex: 1.5,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
