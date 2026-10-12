import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, showToast }) => {
  const { theme } = useTheme();
  const { user, logout, updateUsername } = useAuth();

  const [activeSubModal, setActiveSubModal] = useState<
    'none' | 'username' | 'password' | 'pin' | 'logout'
  >('none');

  // Sub-modal states
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [subError, setSubError] = useState('');

  const firstLetter = (user?.username || user?.phone || 'U')[0].toUpperCase();

  const handleResetSub = () => {
    setActiveSubModal('none');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setNewPin('');
    setSubError('');
    setLoading(false);
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      setSubError('Username cannot be empty');
      return;
    }
    setLoading(true);
    setSubError('');
    try {
      const res = await fetch(API_ENDPOINTS.changeUsername, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.userId, username: newUsername.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        await updateUsername(newUsername.trim());
        handleResetSub();
        onClose();
        showToast('Username updated successfully', 'success');
      } else {
        setSubError(data.message || 'Failed to update username');
      }
    } catch {
      setSubError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStrongPassword = (pwd: string) =>
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd);

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setSubError('Please enter a new password');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setSubError('Password must be 8+ chars with uppercase, lowercase, number & symbol');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSubError('Passwords do not match');
      return;
    }

    setLoading(true);
    setSubError('');
    try {
      const res = await fetch(API_ENDPOINTS.changePassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user?.phone, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        handleResetSub();
        onClose();
        showToast('Password updated successfully', 'success');
      } else {
        setSubError(data.message || 'Failed to update password');
      }
    } catch {
      setSubError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePin = async () => {
    if (newPin.length !== 6) {
      setSubError('PIN must be exactly 6 digits');
      return;
    }
    setLoading(true);
    setSubError('');
    try {
      const res = await fetch(API_ENDPOINTS.setMenuPin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.userId, pin: newPin }),
      });
      const data = await res.json();
      if (res.ok) {
        handleResetSub();
        onClose();
        showToast('PIN updated successfully', 'success');
      } else {
        setSubError(data.message || 'Failed to update PIN');
      }
    } catch {
      setSubError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogout = async () => {
    handleResetSub();
    onClose();
    await logout();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          if (activeSubModal === 'none') onClose();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centerContainer}
        >
          {activeSubModal === 'none' && (
            <View
              style={[
                styles.menuCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <LinearGradient
                  colors={theme.gradientPrimary}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>{firstLetter}</Text>
                </LinearGradient>
                <View style={styles.profileInfo}>
                  <Text style={[styles.userName, { color: theme.textHeading }]}>
                    {user?.username || user?.phone || 'User'}
                  </Text>
                  <Text style={[styles.userRole, { color: theme.textMuted }]}>
                    Administrator ({user?.phone})
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              {/* Options */}
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setActiveSubModal('username')}
              >
                <Ionicons name="person-outline" size={20} color={theme.accent} />
                <Text style={[styles.menuRowText, { color: theme.text }]}>Change Username</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setActiveSubModal('password')}
              >
                <Ionicons name="key-outline" size={20} color={theme.accent} />
                <Text style={[styles.menuRowText, { color: theme.text }]}>Change Password</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setActiveSubModal('pin')}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.accent} />
                <Text style={[styles.menuRowText, { color: theme.text }]}>Change 6-Digit PIN</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setActiveSubModal('logout')}
              >
                <Ionicons name="log-out-outline" size={20} color={theme.danger} />
                <Text style={[styles.menuRowText, { color: theme.danger, fontWeight: '700' }]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Change Username Sub-Modal */}
          {activeSubModal === 'username' && (
            <View
              style={[
                styles.subCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.subTitle, { color: theme.textHeading }]}>Change Username</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.textHeading,
                  },
                ]}
                placeholder="Enter new username"
                placeholderTextColor={theme.textMuted}
                value={newUsername}
                onChangeText={setNewUsername}
                autoFocus
              />
              {subError ? <Text style={[styles.subError, { color: theme.danger }]}>{subError}</Text> : null}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleResetSub}>
                  <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtnWrap}
                  onPress={handleUpdateUsername}
                  disabled={loading}
                >
                  <LinearGradient colors={theme.gradientPrimary} style={styles.saveBtn}>
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveBtnText}>Save</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Change Password Sub-Modal */}
          {activeSubModal === 'password' && (
            <View
              style={[
                styles.subCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.subTitle, { color: theme.textHeading }]}>Change Password</Text>
              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.textHeading,
                      paddingRight: 45,
                    },
                  ]}
                  placeholder="New Password (min 8 chars)"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.textHeading,
                      paddingRight: 45,
                    },
                  ]}
                  placeholder="Confirm New Password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {subError ? <Text style={[styles.subError, { color: theme.danger }]}>{subError}</Text> : null}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleResetSub}>
                  <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtnWrap}
                  onPress={handleUpdatePassword}
                  disabled={loading}
                >
                  <LinearGradient colors={theme.gradientPrimary} style={styles.saveBtn}>
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveBtnText}>Update</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Change PIN Sub-Modal */}
          {activeSubModal === 'pin' && (
            <View
              style={[
                styles.subCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.subTitle, { color: theme.textHeading }]}>Change 6-Digit PIN</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.textHeading,
                    textAlign: 'center',
                    letterSpacing: 10,
                    fontSize: 22,
                  },
                ]}
                placeholder="••••••"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                secureTextEntry
                value={newPin}
                onChangeText={t => setNewPin(t.replace(/\D/g, '').slice(0, 6))}
                autoFocus
              />
              {subError ? <Text style={[styles.subError, { color: theme.danger }]}>{subError}</Text> : null}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleResetSub}>
                  <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtnWrap}
                  onPress={handleUpdatePin}
                  disabled={loading}
                >
                  <LinearGradient colors={theme.gradientPrimary} style={styles.saveBtn}>
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveBtnText}>Save PIN</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Logout Confirmation Sub-Modal */}
          {activeSubModal === 'logout' && (
            <View
              style={[
                styles.subCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Ionicons name="alert-circle-outline" size={48} color={theme.danger} style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text style={[styles.subTitle, { color: theme.textHeading, textAlign: 'center' }]}>
                Confirm Logout
              </Text>
              <Text style={[styles.subDesc, { color: theme.textMuted, textAlign: 'center' }]}>
                Are you sure you want to log out of BizTrack?
              </Text>
              <View style={[styles.actionRow, { marginTop: 20 }]}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleResetSub}>
                  <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtnWrap, { backgroundColor: theme.danger, borderRadius: 10, overflow: 'hidden' }]}
                  onPress={handleConfirmLogout}
                >
                  <View style={[styles.saveBtn, { backgroundColor: theme.danger }]}>
                    <Text style={styles.saveBtnText}>Log Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 360,
  },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuRowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  subCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  subDesc: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  passwordInputWrap: {
    position: 'relative',
    width: '100%',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  subError: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtnWrap: {
    flex: 1,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
