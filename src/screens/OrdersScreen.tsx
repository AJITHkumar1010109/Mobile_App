import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const ordersData = [
  { id: '#ORD-001', customer: 'Alice Johnson', amount: '$240', date: 'Oct 12, 2026', status: 'Completed' },
  { id: '#ORD-002', customer: 'Bob Smith', amount: '$185', date: 'Oct 11, 2026', status: 'Pending' },
  { id: '#ORD-003', customer: 'Carol White', amount: '$320', date: 'Oct 10, 2026', status: 'Processing' },
  { id: '#ORD-004', customer: 'David Lee', amount: '$95', date: 'Oct 09, 2026', status: 'Completed' },
  { id: '#ORD-005', customer: 'Eva Martinez', amount: '$560', date: 'Oct 08, 2026', status: 'Cancelled' },
  { id: '#ORD-006', customer: 'George Clark', amount: '$410', date: 'Oct 07, 2026', status: 'Completed' },
  { id: '#ORD-007', customer: 'Helen Adams', amount: '$150', date: 'Oct 06, 2026', status: 'Pending' },
];

export const OrdersScreen: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All' ? ordersData : ordersData.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: theme.successBg, text: theme.success };
      case 'pending':
        return { bg: theme.warningBg, text: theme.warning };
      case 'processing':
        return { bg: theme.infoBg, text: theme.info };
      case 'cancelled':
        return { bg: theme.dangerBg, text: theme.danger };
      default:
        return { bg: theme.inputBg, text: theme.textMuted };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Filter Chips */}
      <View style={[styles.filterBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {['All', 'Completed', 'Pending', 'Processing', 'Cancelled'].map(f => {
          const isSelected = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.accent : theme.inputBg,
                  borderColor: isSelected ? theme.accent : theme.border,
                },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#ffffff' : theme.text },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const statusStyle = getStatusColor(item.status);
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.orderIdWrap}>
                  <Ionicons name="receipt-outline" size={16} color={theme.accent} />
                  <Text style={[styles.orderId, { color: theme.accent }]}>{item.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.cardMid}>
                <Text style={[styles.customerName, { color: theme.textHeading }]}>{item.customer}</Text>
                <Text style={[styles.orderAmount, { color: theme.textHeading }]}>{item.amount}</Text>
              </View>

              <View style={[styles.cardBot, { borderTopColor: theme.border }]}>
                <Text style={[styles.orderDate, { color: theme.textMuted }]}>Ordered on {item.date}</Text>
                <TouchableOpacity style={styles.viewDetailsBtn}>
                  <Text style={[styles.viewDetailsText, { color: theme.accent }]}>Details</Text>
                  <Ionicons name="chevron-forward" size={14} color={theme.accent} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardBot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  orderDate: {
    fontSize: 12,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
