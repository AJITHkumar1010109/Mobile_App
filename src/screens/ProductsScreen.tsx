import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const products = [
  { name: 'Wireless Headphones', category: 'Electronics', price: '$89.99', stock: 142, status: 'Active', icon: 'headset-outline' },
  { name: 'Running Shoes', category: 'Footwear', price: '$64.99', stock: 87, status: 'Active', icon: 'footsteps-outline' },
  { name: 'Coffee Maker', category: 'Appliances', price: '$49.99', stock: 0, status: 'Out of Stock', icon: 'cafe-outline' },
  { name: 'Yoga Mat', category: 'Fitness', price: '$29.99', stock: 210, status: 'Active', icon: 'fitness-outline' },
  { name: 'Desk Lamp', category: 'Furniture', price: '$34.99', stock: 55, status: 'Active', icon: 'bulb-outline' },
  { name: 'Backpack', category: 'Accessories', price: '$44.99', stock: 0, status: 'Out of Stock', icon: 'briefcase-outline' },
];

export const ProductsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={products}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textHeading }]}>Product Catalog</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Manage product pricing, stock availability and categories
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const inStock = item.status === 'Active';
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.topRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.accentBg }]}>
                  <Ionicons name={item.icon as any} size={22} color={theme.accent} />
                </View>
                <View style={styles.meta}>
                  <Text style={[styles.name, { color: theme.textHeading }]}>{item.name}</Text>
                  <Text style={[styles.cat, { color: theme.textMuted }]}>{item.category}</Text>
                </View>
                <Text style={[styles.price, { color: theme.textHeading }]}>{item.price}</Text>
              </View>

              <View style={[styles.botRow, { borderTopColor: theme.border }]}>
                <View style={styles.stockWrap}>
                  <Text style={[styles.stockLabel, { color: theme.textMuted }]}>In Stock:</Text>
                  <Text style={[styles.stockVal, { color: theme.text }]}>{item.stock} units</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: inStock ? theme.successBg : theme.dangerBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: inStock ? theme.success : theme.danger },
                    ]}
                  >
                    {item.status}
                  </Text>
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
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  cat: {
    fontSize: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  botRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  stockWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockLabel: {
    fontSize: 12,
  },
  stockVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
