import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ScreenName } from '../components/DrawerMenu';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const statsData = [
  { label: 'Total Revenue', value: '$48,295', change: '+12%', icon: 'cash-outline', color: '#10b981' },
  { label: 'New Orders', value: '1,284', change: '+8%', icon: 'cart-outline', color: '#6366f1' },
  { label: 'Customers', value: '9,731', change: '+5%', icon: 'people-outline', color: '#ec4899' },
  { label: 'Growth', value: '23.6%', change: '+3%', icon: 'trending-up-outline', color: '#f59e0b' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Alice Johnson', amount: '$240', status: 'Completed' },
  { id: '#ORD-002', customer: 'Bob Smith', amount: '$185', status: 'Pending' },
  { id: '#ORD-003', customer: 'Carol White', amount: '$320', status: 'Processing' },
  { id: '#ORD-004', customer: 'David Lee', amount: '$95', status: 'Completed' },
  { id: '#ORD-005', customer: 'Eva Martinez', amount: '$560', status: 'Cancelled' },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Banner */}
      <View style={[styles.welcomeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.welcomeTextWrap}>
          <Text style={[styles.welcomeTitle, { color: theme.textHeading }]}>
            Dashboard
          </Text>
          <Text style={[styles.welcomeSub, { color: theme.textMuted }]}>
            Welcome back, <Text style={{ fontWeight: '700', color: theme.accent }}>{user?.username || 'User'}</Text> 👋
          </Text>
        </View>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => onNavigate('customer-details')}
        >
          <LinearGradient colors={theme.gradientPrimary} style={styles.quickActionGrad}>
            <Ionicons name="people" size={16} color="#fff" />
            <Text style={styles.quickActionText}>Manage Customers</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 2x2 Stats Grid */}
      <View style={styles.statsGrid}>
        {statsData.map(stat => (
          <View
            key={stat.label}
            style={[
              styles.statCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.statTop}>
              <View style={[styles.statIconBadge, { backgroundColor: `${stat.color}18` }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <View style={[styles.changeBadge, { backgroundColor: theme.successBg }]}>
                <Ionicons name="arrow-up" size={10} color={theme.success} />
                <Text style={[styles.changeText, { color: theme.success }]}>{stat.change}</Text>
              </View>
            </View>
            <Text style={[styles.statValue, { color: theme.textHeading }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Orders Section */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.cardHeader, { borderBottomColor: theme.border }]}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="cart-outline" size={20} color={theme.accent} />
            <Text style={[styles.cardTitle, { color: theme.textHeading }]}>Recent Orders</Text>
          </View>
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: theme.border }]}
            onPress={() => onNavigate('orders')}
          >
            <Text style={[styles.outlineBtnText, { color: theme.accent }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersList}>
          {recentOrders.map((order, idx) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <View
                key={order.id}
                style={[
                  styles.orderRow,
                  idx < recentOrders.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View style={styles.orderLeft}>
                  <Text style={[styles.orderId, { color: theme.accent }]}>{order.id}</Text>
                  <Text style={[styles.orderCustomer, { color: theme.textHeading }]}>
                    {order.customer}
                  </Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={[styles.orderAmount, { color: theme.textHeading }]}>
                    {order.amount}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  welcomeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomeTextWrap: {},
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 14,
  },
  quickActionBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  quickActionGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  outlineBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ordersList: {
    paddingHorizontal: 16,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  orderLeft: {
    gap: 4,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  orderAmount: {
    fontSize: 14,
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
});
