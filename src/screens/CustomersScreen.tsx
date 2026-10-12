import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const staticCustomers = [
  { name: 'Alice Johnson', email: 'alice@example.com', orders: 12, spent: '$2,840', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', orders: 7, spent: '$1,295', status: 'Active' },
  { name: 'Carol White', email: 'carol@example.com', orders: 3, spent: '$640', status: 'Inactive' },
  { name: 'David Lee', email: 'david@example.com', orders: 19, spent: '$4,120', status: 'Active' },
  { name: 'Eva Martinez', email: 'eva@example.com', orders: 5, spent: '$980', status: 'Active' },
];

export const CustomersScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={staticCustomers}
        keyExtractor={item => item.email}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textHeading }]}>Customers Overview</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Customer base activity and total spending
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isActive = item.status === 'Active';
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.topRow}>
                <View style={styles.avatarWrap}>
                  <View style={[styles.avatar, { backgroundColor: theme.accentBg }]}>
                    <Text style={[styles.avatarText, { color: theme.accent }]}>
                      {item.name[0]}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.name, { color: theme.textHeading }]}>{item.name}</Text>
                    <Text style={[styles.email, { color: theme.textMuted }]}>{item.email}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isActive ? theme.successBg : theme.dangerBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: isActive ? theme.success : theme.danger },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={[styles.footerRow, { borderTopColor: theme.border }]}>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: theme.textMuted }]}>ORDERS</Text>
                  <Text style={[styles.metaVal, { color: theme.textHeading }]}>{item.orders}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: theme.textMuted }]}>TOTAL SPENT</Text>
                  <Text style={[styles.metaVal, { color: theme.accent }]}>{item.spent}</Text>
                </View>
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  email: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 14,
    fontWeight: '800',
  },
});
