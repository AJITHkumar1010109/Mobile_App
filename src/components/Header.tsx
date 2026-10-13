import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

import { AnimatedTempo } from './AnimatedTempo';

interface HeaderProps {
  title: string;
  onOpenDrawer?: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenDrawer, onOpenProfile }) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const firstLetter = (user?.username || user?.phone || 'U')[0].toUpperCase();

  // Ensure safeTop accounts for Android status bar and display cutouts
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight);

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.headerBg,
          paddingTop: safeTop,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftRow}>
          {/* Animated Tempo */}
          <AnimatedTempo />

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
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
