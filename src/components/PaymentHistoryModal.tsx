import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { CustomerData } from './CustomerFormModal';

interface PaymentHistoryModalProps {
  visible: boolean;
  customer?: CustomerData | null;
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  visible,
  customer,
  onClose,
}) => {
  const { theme } = useTheme();

  const history = [...(customer?.payment_history || [])].reverse();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.infoBg }]}>
                <Ionicons name="receipt-outline" size={20} color={theme.info} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.textHeading }]}>Payment History</Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>{customer?.name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
            {history.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="wallet-outline" size={36} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  No payments recorded yet.
                </Text>
              </View>
            ) : (
              history.map((entry, index) => (
                <View
                  key={entry._id || index}
                  style={[
                    styles.itemCard,
                    { backgroundColor: theme.inputBg, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.itemTop}>
                    <Text style={[styles.itemAmount, { color: theme.success }]}>
                      + ₹{Number(entry.amount).toLocaleString()}
                    </Text>
                    <Text style={[styles.itemDate, { color: theme.textMuted }]}>
                      {formatDate(entry.received_at)}
                    </Text>
                  </View>
                  {entry.note ? (
                    <View style={styles.noteRow}>
                      <Ionicons name="chatbubble-outline" size={12} color={theme.textMuted} />
                      <Text style={[styles.itemNote, { color: theme.textMuted }]}>
                        {entry.note}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))
            )}
          </ScrollView>

          {/* Close button */}
          <TouchableOpacity
            style={[styles.closeBottomBtn, { borderColor: theme.border }]}
            onPress={onClose}
          >
            <Text style={[styles.closeBottomText, { color: theme.text }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '75%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  listContainer: {
    maxHeight: 320,
  },
  listContent: {
    gap: 10,
    paddingVertical: 4,
  },
  emptyWrap: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
  },
  itemCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  itemDate: {
    fontSize: 11,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  itemNote: {
    fontSize: 12,
  },
  closeBottomBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBottomText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
