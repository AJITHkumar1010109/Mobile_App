import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface SettingsScreenProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ showToast }) => {
  const { theme } = useTheme();
  const { user, updateUsername } = useAuth();

  // Profile
  const [fullName, setFullName] = useState(user?.username || 'Administrator');
  const [email, setEmail] = useState('admin@biztrack.com');

  // Preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  // Password
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    try {
      if (user?.userId) {
        await fetch(API_ENDPOINTS.changeUsername, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId, username: fullName.trim() }),
        });
      }
      await updateUsername(fullName.trim());
      showToast('Profile updated successfully', 'success');
    } catch {
      showToast('Failed to save profile changes', 'error');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      showToast('Enter a new password', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch(API_ENDPOINTS.changePassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user?.phone, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password updated successfully', 'success');
      } else {
        showToast(data.message || 'Failed to update password', 'error');
      }
    } catch {
      showToast('Network error while updating password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textHeading }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Manage your account profile and application preferences
        </Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textHeading }]}>Profile</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textHeading },
            ]}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textHeading },
            ]}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Role</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.border, borderColor: theme.border, color: theme.textMuted },
            ]}
            value="Administrator"
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.btnWrap} onPress={handleSaveProfile}>
          <LinearGradient colors={theme.gradientPrimary} style={styles.btn}>
            <Text style={styles.btnText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Preferences Card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textHeading }]}>Preferences</Text>

        <View style={styles.toggleRow}>
          <View>
            <Text style={[styles.toggleTitle, { color: theme.textHeading }]}>Email Notifications</Text>
            <Text style={[styles.toggleSub, { color: theme.textMuted }]}>
              Receive weekly summary reports
            </Text>
          </View>
          <Switch
            value={emailNotif}
            onValueChange={setEmailNotif}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.toggleRow}>
          <View>
            <Text style={[styles.toggleTitle, { color: theme.textHeading }]}>Push Notifications</Text>
            <Text style={[styles.toggleSub, { color: theme.textMuted }]}>
              Instant alerts on customer payments
            </Text>
          </View>
          <Switch
            value={pushNotif}
            onValueChange={setPushNotif}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Change Password Card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textHeading }]}>Change Password</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textHeading, paddingRight: 44 },
              ]}
              placeholder="Min 8 characters"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(!showNew)}>
              <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Confirm New Password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textHeading, paddingRight: 44 },
              ]}
              placeholder="Re-enter new password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.btnWrap} onPress={handleUpdatePassword} disabled={updatingPassword}>
          <LinearGradient colors={theme.gradientPrimary} style={styles.btn}>
            <Text style={styles.btnText}>{updatingPassword ? 'Updating...' : 'Update Password'}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  btnWrap: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
  },
  btn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 12,
  },
  divider: {
    height: 1,
  },
});
