import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

export type ScreenName =
  | 'dashboard'
  | 'customer-details'
  | 'self-details'
  | 'analytics'
  | 'orders'
  | 'customers'
  | 'products'
  | 'messages'
  | 'settings';

interface DrawerMenuProps {
  visible: boolean;
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onClose: () => void;
  onSelfDetailsClick: () => void;
}

interface MenuItem {
  id: ScreenName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isPinProtected?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  // { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'customer-details', label: 'Customer Details', icon: 'people-outline' },
  // { id: 'self-details', label: 'Self Details', icon: 'lock-closed-outline', isPinProtected: true },
  // { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline' },
  // { id: 'orders', label: 'Orders', icon: 'cart-outline' },
  // { id: 'customers', label: 'Customers', icon: 'person-outline' },
  // { id: 'products', label: 'Products', icon: 'pricetag-outline' },
  // { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
  // { id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  visible,
  activeScreen,
  onNavigate,
  onClose,
  onSelfDetailsClick,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const firstLetter = (user?.username || user?.phone || 'U')[0].toUpperCase();

  const handleItemPress = (item: MenuItem) => {
    onClose();
    if (item.id === 'self-details') {
      onSelfDetailsClick();
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop tap to close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <SafeAreaView style={[styles.drawer, { backgroundColor: theme.drawerBg }]}>
          {/* Brand header */}
          <View style={[styles.brandHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.brandRow}>
              <LinearGradient colors={theme.gradientPrimary} style={styles.logoBadge}>
                <Ionicons name="stats-chart" size={18} color="#ffffff" />
              </LinearGradient>
              <View style={styles.brandTextWrap}>
                <Text style={[styles.brandTitle, { color: theme.textHeading }]}>BizTrack</Text>
                <Text style={[styles.brandSubtitle, { color: theme.textMuted }]}>
                  Business Suite
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Navigation Items */}
          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>MAIN MENU</Text>

            {MENU_ITEMS.map(item => {
              const isActive = activeScreen === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.navItem,
                    isActive && { backgroundColor: theme.accentBg },
                  ]}
                  onPress={() => handleItemPress(item)}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isActive ? theme.accent : theme.textMuted}
                    style={styles.navIcon}
                  />
                  <Text
                    style={[
                      styles.navLabel,
                      { color: isActive ? theme.accent : theme.text },
                      isActive && styles.activeNavLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.isPinProtected && (
                    <View style={[styles.pinBadge, { backgroundColor: theme.warningBg }]}>
                      <Ionicons name="key" size={10} color={theme.warning} />
                      <Text style={[styles.pinBadgeText, { color: theme.warning }]}>PIN</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Drawer footer */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <LinearGradient colors={theme.gradientPrimary} style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>{firstLetter}</Text>
            </LinearGradient>
            <View style={styles.footerUser}>
              <Text style={[styles.footerUserName, { color: theme.textHeading }]}>
                {user?.username || 'User'}
              </Text>
              <Text style={[styles.footerUserRole, { color: theme.textMuted }]}>
                Administrator
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: Math.min(width * 0.78, 300),
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTextWrap: {},
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 6,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
  },
  navIcon: {
    marginRight: 12,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  activeNavLabel: {
    fontWeight: '700',
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerUser: {
    flex: 1,
  },
  footerUserName: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerUserRole: {
    fontSize: 11,
  },
});
