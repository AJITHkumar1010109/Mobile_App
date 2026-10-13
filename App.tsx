import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:hover {
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      box-shadow: 0 0 0px 1000px transparent inset !important;
      -webkit-text-fill-color: #f8fafc !important;
      caret-color: #f8fafc !important;
      background-color: transparent !important;
      transition: background-color 9999s ease-in-out 0s;
    }
    input, input:focus { outline: none !important; background-color: transparent !important; }
  `;
  document.head.appendChild(style);
}
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Header } from './src/components/Header';
import { DrawerMenu, ScreenName } from './src/components/DrawerMenu';
import { Toast, ToastData } from './src/components/Toast';
import { PinModal } from './src/components/PinModal';
import { ProfileModal } from './src/components/ProfileModal';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { CustomerDetailsScreen } from './src/screens/CustomerDetailsScreen';
import { SelfDetailsScreen } from './src/screens/SelfDetailsScreen';
import { CustomersScreen } from './src/screens/CustomersScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { API_ENDPOINTS } from './src/config/api';

function MainApp() {
  const { theme, themeMode } = useTheme();
  const { isLoggedIn, isLoading, user } = useAuth();
  const insets = useSafeAreaInsets();

  const [currentScreen, setCurrentScreen] = useState<ScreenName>('customer-details');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Self Details PIN states
  const [selfUnlocked, setSelfUnlocked] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'verify' | 'set'>('verify');

  // Lock self-details when leaving the screen
  useEffect(() => {
    if (currentScreen !== 'self-details') {
      setSelfUnlocked(false);
    }
  }, [currentScreen]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleSelfDetailsClick = async () => {
    if (selfUnlocked) {
      setCurrentScreen('self-details');
      return;
    }
    if (!user?.userId) return;

    try {
      const res = await fetch(API_ENDPOINTS.user(user.userId));
      const data = await res.json();
      setPinModalMode(data.has_menu_pin ? 'verify' : 'set');
      setPinModalVisible(true);
    } catch {
      showToast('Unable to check PIN status', 'error');
    }
  };

  const handlePinSuccess = () => {
    setSelfUnlocked(true);
    setPinModalVisible(false);
    setCurrentScreen('self-details');
    showToast('Self Details unlocked successfully', 'success');
  };

  if (isLoading) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: theme.bg }]}>
        <LinearGradient
          colors={theme.gradientPrimary}
          style={styles.splashBadge}
        >
          <Text style={styles.splashLetter}>B</Text>
        </LinearGradient>
        <Text style={[styles.splashTitle, { color: theme.textHeading }]}>BizTrack</Text>
        <ActivityIndicator size="small" color={theme.accent} style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: '#667eea' }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <LoginScreen showToast={showToast} />
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </View>
    );
  }

  const screenTitles: Record<ScreenName, string> = {
    dashboard: 'Dashboard',
    'customer-details': 'Customer Details',
    'self-details': 'Self Details',
    analytics: 'Analytics',
    orders: 'Orders',
    customers: 'Customers',
    products: 'Products',
    messages: 'Messages',
    settings: 'Settings',
  };

  return (
    <View style={[styles.fullScreen, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Top Header */}
      <Header
        title={screenTitles[currentScreen]}
        onOpenProfile={() => setProfileVisible(true)}
      />

      {/* Main Screen Body */}
      <View style={[styles.body, { backgroundColor: theme.bg, paddingBottom: insets.bottom }]}>
        {currentScreen === 'dashboard' && <DashboardScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'customer-details' && <CustomerDetailsScreen showToast={showToast} />}
        {currentScreen === 'self-details' && (
          selfUnlocked ? (
            <SelfDetailsScreen
              onLock={() => {
                setSelfUnlocked(false);
                setCurrentScreen('customer-details');
              }}
            />
          ) : (
            <CustomerDetailsScreen showToast={showToast} />
          )
        )}
        {currentScreen === 'analytics' && <AnalyticsScreen />}
        {currentScreen === 'orders' && <OrdersScreen />}
        {currentScreen === 'customers' && <CustomersScreen />}
        {currentScreen === 'products' && <ProductsScreen />}
        {currentScreen === 'messages' && <MessagesScreen />}
        {currentScreen === 'settings' && <SettingsScreen showToast={showToast} />}
      </View>

      {/* Navigation Drawer (Commented Out)
      <DrawerMenu
        visible={drawerVisible}
        activeScreen={currentScreen}
        onNavigate={screen => {
          setCurrentScreen(screen);
        }}
        onSelfDetailsClick={handleSelfDetailsClick}
        onClose={() => setDrawerVisible(false)}
      />
      */}

      {/* 6-Digit PIN Modal */}
      {user?.userId && (
        <PinModal
          visible={pinModalVisible}
          mode={pinModalMode}
          userId={user.userId}
          onSuccess={handlePinSuccess}
          onClose={() => setPinModalVisible(false)}
        />
      )}

      {/* User Profile Modal */}
      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        showToast={showToast}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  splashLetter: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },
  splashTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
