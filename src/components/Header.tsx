import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  onOpenDrawer: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenDrawer, onOpenProfile }) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const firstLetter = (user?.username || user?.phone || 'U')[0].toUpperCase();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.headerBg,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.inputBg }]}
          onPress={onOpenDrawer}
          accessibilityLabel="Open Menu"
        >
          <Ionicons name="menu-outline" size={24} color={theme.textHeading} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textHeading }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightRow}>
        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.inputBg }]}
          onPress={toggleTheme}
          accessibilityLabel="Toggle Theme"
        >
          <Ionicons
            name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={themeMode === 'dark' ? '#fbbf24' : theme.accent}
          />
        </TouchableOpacity>

        {/* User Avatar */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onOpenProfile}
          accessibilityLabel="User Profile"
        >
          <LinearGradient colors={theme.gradientPrimary} style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButton: {
    padding: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
