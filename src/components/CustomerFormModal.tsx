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
  Dimensions,
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
  amount_received: string | number;
  amount_balance: string | number;
  total_amount: string | number;
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

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const toSafeString = (val: unknown): string => {
  if (val === undefined || val === null) return '';
  return String(val);
};

const parseNumericValue = (val: unknown): string => {
  if (val === undefined || val === null || val === '') return '';
  if (typeof val === 'number') {
    return isNaN(val) ? '' : String(val);
  }
  const clean = String(val).replace(/[^0-9.]/g, '');
  return clean;
};

const getFinancialValue = (obj: any, ...keys: string[]): string => {
  if (!obj) return '';
  for (const k of keys) {
    const val = obj[k];
    if (val !== undefined && val !== null && val !== '') {
      const parsed = parseNumericValue(val);
      if (parsed !== '') return parsed;
    }
  }
  return '';
};

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
        let total = getFinancialValue(initial, 'total_amount', 'totalAmount', 'total', 'amount');
        let received = getFinancialValue(initial, 'amount_received', 'amountReceived', 'received', 'paid', 'amountPaid');
        let balance = getFinancialValue(initial, 'amount_balance', 'amountBalance', 'balance', 'due', 'pending');

        const numTotal = parseFloat(total) || 0;
        const numReceived = parseFloat(received) || 0;
        const numBalance = parseFloat(balance) || 0;

        // If balance is missing or 0 but total > received
        if (balance === '' && total !== '') {
          balance = String(Math.max(0, numTotal - numReceived));
        } else if (numBalance === 0 && numTotal > numReceived && received !== '') {
          balance = String(Math.max(0, numTotal - numReceived));
        }

        // If total is missing but received and balance exist
        if (total === '' && (received !== '' || balance !== '')) {
          total = String(numReceived + numBalance);
        }

        setForm({
          _id: initial._id,
          name: toSafeString(initial.name),
          email: toSafeString(initial.email),
          phone: toSafeString(initial.phone),
          native: toSafeString(initial.native),
          district: toSafeString(initial.district),
          address: toSafeString(initial.address),
          total_amount: total,
          amount_received: received !== '' ? received : '0',
          amount_balance: balance !== '' ? balance : '0',
          status: initial.status || ((parseFloat(balance) || 0) <= 0 ? 'Completed' : 'Pending'),
          payment_history: initial.payment_history,
        });
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
        const total = parseFloat(key === 'total_amount' ? val : toSafeString(prev.total_amount)) || 0;
        const received = parseFloat(key === 'amount_received' ? val : toSafeString(prev.amount_received)) || 0;
        const balance = Math.max(0, total - received);
        next.amount_balance = balance.toString();
        next.status = balance <= 0 ? 'Completed' : 'Pending';
      }
      return next;
    });
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handlePhone = (v: string) => {
    const digits = toSafeString(v).replace(/\D/g, '').slice(0, 10);
    updateField('phone', digits);
  };

  const validate = (): boolean => {
    const errs: FieldError = {};
    const name = toSafeString(form.name).trim();
    const email = toSafeString(form.email).trim();
    const phone = toSafeString(form.phone).trim();
    const native = toSafeString(form.native).trim();
    const district = toSafeString(form.district).trim();
    const address = toSafeString(form.address).trim();
    const amount_received = toSafeString(form.amount_received).trim();
    const total_amount = toSafeString(form.total_amount).trim();

    if (!name) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email address is required';
    if (!phone) errs.phone = 'Phone number is required';
    else if (phone.length !== 10) errs.phone = 'Phone must be exactly 10 digits';
    if (!native) errs.native = 'Native is required';
    if (!district) errs.district = 'District is required';
    if (!address) errs.address = 'Address is required';
    if (amount_received === '') errs.amount_received = 'Amount received is required';
    if (total_amount === '') errs.total_amount = 'Total amount is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const dataToSave: CustomerData = {
        ...form,
        name: toSafeString(form.name).trim(),
        email: toSafeString(form.email).trim(),
        phone: toSafeString(form.phone).trim(),
        native: toSafeString(form.native).trim(),
        district: toSafeString(form.district).trim(),
        address: toSafeString(form.address).trim(),
        total_amount: toSafeString(form.total_amount).trim(),
        amount_received: toSafeString(form.amount_received).trim(),
        amount_balance: toSafeString(form.amount_balance).trim(),
        status: (parseFloat(toSafeString(form.amount_balance)) || 0) <= 0 ? 'Completed' : 'Pending',
      };
      await onSave(dataToSave);
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
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
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
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            bounces={true}
            alwaysBounceVertical={true}
          >
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
                value={toSafeString(form.name)}
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
                value={toSafeString(form.email)}
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
                value={toSafeString(form.phone)}
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
                  value={toSafeString(form.native)}
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
                  value={toSafeString(form.district)}
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
                value={toSafeString(form.total_amount)}
                onChangeText={v => updateField('total_amount', v)}
              />
              {errors.total_amount ? <Text style={[styles.errText, { color: theme.danger }]}>{errors.total_amount}</Text> : null}
            </View>

            {/* Two column: Received & Balance */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Amount Received (₹) <Text style={{ color: theme.danger }}>*</Text>
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
                  value={toSafeString(form.amount_received)}
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
                  value={toSafeString(form.amount_balance)}
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
                value={toSafeString(form.address)}
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
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    height: Platform.OS === 'web' ? Math.min(WINDOW_HEIGHT * 0.88, 720) : '88%',
    maxHeight: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
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
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 36,
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
