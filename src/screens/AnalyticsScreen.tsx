import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const metrics = [
  { label: 'Page Views', value: '128,430', icon: 'eye-outline', change: '+18%', color: '#6366f1' },
  { label: 'Sessions', value: '54,210', icon: 'timer-outline', change: '+11%', color: '#10b981' },
  { label: 'Bounce Rate', value: '34.2%', icon: 'arrow-undo-outline', change: '-4%', color: '#ec4899', isNegative: true },
  { label: 'Avg. Duration', value: '3m 42s', icon: 'hourglass-outline', change: '+7%', color: '#f59e0b' },
];

const trafficBreakdown = [
  { channel: 'Direct Traffic', percent: '42%', visitors: '22,768', color: '#6366f1' },
  { channel: 'Organic Search', percent: '31%', visitors: '16,805', color: '#10b981' },
  { channel: 'Social Media', percent: '18%', visitors: '9,757', color: '#ec4899' },
  { channel: 'Referral', percent: '9%', visitors: '4,878', color: '#f59e0b' },
];

export const AnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textHeading }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Track your business and traffic performance metrics
        </Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.grid}>
        {metrics.map(m => (
          <View
            key={m.label}
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.metricTop}>
              <View style={[styles.iconBox, { backgroundColor: `${m.color}18` }]}>
                <Ionicons name={m.icon as any} size={20} color={m.color} />
              </View>
              <View
                style={[
                  styles.changeBadge,
                  { backgroundColor: m.isNegative ? theme.dangerBg : theme.successBg },
                ]}
              >
                <Text
                  style={[
                    styles.changeText,
                    { color: m.isNegative ? theme.danger : theme.success },
                  ]}
                >
                  {m.change}
                </Text>
              </View>
            </View>
            <Text style={[styles.metricVal, { color: theme.textHeading }]}>{m.value}</Text>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Traffic Channels Breakdown */}
      <View style={[styles.detailCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textHeading }]}>Traffic Channels</Text>
        <View style={styles.channelsList}>
          {trafficBreakdown.map(ch => (
            <View key={ch.channel} style={styles.channelRow}>
              <View style={styles.channelLeft}>
                <View style={[styles.dot, { backgroundColor: ch.color }]} />
                <Text style={[styles.channelName, { color: theme.text }]}>{ch.channel}</Text>
              </View>
              <View style={styles.channelRight}>
                <Text style={[styles.visitors, { color: theme.textMuted }]}>{ch.visitors}</Text>
                <Text style={[styles.percent, { color: theme.textHeading }]}>{ch.percent}</Text>
              </View>
            </View>
          ))}
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
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
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
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
  },
  detailCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  channelsList: {
    gap: 12,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  channelName: {
    fontSize: 14,
    fontWeight: '500',
  },
  channelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visitors: {
    fontSize: 12,
  },
  percent: {
    fontSize: 14,
    fontWeight: '700',
  },
});
