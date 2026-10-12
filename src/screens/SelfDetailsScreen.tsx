import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SelfDetailsScreenProps {
  onLock: () => void;
}

export const SelfDetailsScreen: React.FC<SelfDetailsScreenProps> = ({ onLock }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      {/* Top Banner */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.lockBadge, { backgroundColor: theme.successBg }]}>
            <Ionicons name="shield-checkmark" size={24} color={theme.success} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.textHeading }]}>Self Details</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              PIN Protected Personal Workspace
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.lockBtn, { borderColor: theme.border }]} onPress={onLock}>
          <Ionicons name="lock-closed-outline" size={16} color={theme.text} />
          <Text style={[styles.lockBtnText, { color: theme.text }]}>Lock</Text>
        </TouchableOpacity>
      </View>

      {/* Account Profile Details Card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.textHeading }]}>Profile Information</Text>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Registered Phone</Text>
          <Text style={[styles.infoValue, { color: theme.textHeading }]}>{user?.phone || '—'}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>User ID</Text>
          <Text style={[styles.infoValue, { color: theme.textHeading }]}>#{user?.userId || '—'}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Display Name</Text>
          <Text style={[styles.infoValue, { color: theme.textHeading }]}>{user?.username || 'Administrator'}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Security Level</Text>
          <View style={[styles.badge, { backgroundColor: theme.successBg }]}>
            <Text style={[styles.badgeText, { color: theme.success }]}>6-Digit PIN Protected</Text>
          </View>
        </View>
      </View>

      {/* Security & Access Logs Card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.textHeading }]}>Administrative Privileges</Text>

        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={18} color={theme.success} />
          <Text style={[styles.privilegeText, { color: theme.text }]}>
            Full read & write access to Customer Directory
          </Text>
        </View>

        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={18} color={theme.success} />
          <Text style={[styles.privilegeText, { color: theme.text }]}>
            Payment recording and ledger adjustments
          </Text>
        </View>

        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={18} color={theme.success} />
          <Text style={[styles.privilegeText, { color: theme.text }]}>
            Analytical reporting and export access
          </Text>
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  lockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lockBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  privilegeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  privilegeText: {
    fontSize: 13,
    flex: 1,
  },
});
