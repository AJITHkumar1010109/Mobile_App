import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const initialMessages = [
  { id: '1', from: 'Alice Johnson', subject: 'Order inquiry', preview: 'Hi, I wanted to ask about my recent order status and delivery estimated date...', time: '10:32 AM', unread: true },
  { id: '2', from: 'Bob Smith', subject: 'Return request', preview: 'I would like to return the item I purchased yesterday due to sizing issue...', time: '9:15 AM', unread: true },
  { id: '3', from: 'Carol White', subject: 'Feedback', preview: 'Just wanted to say the customer service was amazing! Thank you so much.', time: 'Yesterday', unread: false },
  { id: '4', from: 'David Lee', subject: 'Shipping delay', preview: 'My package has not arrived yet, it has been 4 days since dispatch notification...', time: 'Yesterday', unread: false },
  { id: '5', from: 'Eva Martinez', subject: 'Bulk order quote', preview: 'We are interested in placing a bulk order for our company employees...', time: 'Mon', unread: false },
];

export const MessagesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState(initialMessages);

  const unreadCount = messages.filter(m => m.unread).length;

  const markRead = (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, unread: false } : m)));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.textHeading }]}>Inbox</Text>
              <View style={[styles.badge, { backgroundColor: theme.infoBg }]}>
                <Text style={[styles.badgeText, { color: theme.info }]}>{unreadCount} unread</Text>
              </View>
            </View>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Customer support inquiries and communication
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: item.unread ? theme.accent : theme.border,
                borderLeftWidth: item.unread ? 4 : 1,
              },
            ]}
            onPress={() => markRead(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.topRow}>
              <View style={styles.senderWrap}>
                <View style={[styles.avatar, { backgroundColor: theme.accentBg }]}>
                  <Text style={[styles.avatarText, { color: theme.accent }]}>{item.from[0]}</Text>
                </View>
                <View>
                  <Text style={[styles.from, { color: theme.textHeading }]}>{item.from}</Text>
                  <Text style={[styles.subject, { color: theme.text }]}>{item.subject}</Text>
                </View>
              </View>
              <Text style={[styles.time, { color: theme.textMuted }]}>{item.time}</Text>
            </View>

            <Text style={[styles.preview, { color: theme.textMuted }]} numberOfLines={2}>
              {item.preview}
            </Text>
          </TouchableOpacity>
        )}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
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
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  senderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  from: {
    fontSize: 14,
    fontWeight: '700',
  },
  subject: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  time: {
    fontSize: 11,
  },
  preview: {
    fontSize: 13,
    lineHeight: 18,
  },
});
