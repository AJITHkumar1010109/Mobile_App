import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { API_ENDPOINTS } from '../config/api';
import { CustomerData, CustomerFormModal } from '../components/CustomerFormModal';
import { PaymentModal } from '../components/PaymentModal';
import { PaymentHistoryModal } from '../components/PaymentHistoryModal';

interface CustomerDetailsScreenProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const CustomerDetailsScreen: React.FC<CustomerDetailsScreenProps> = ({ showToast }) => {
  const { theme } = useTheme();

  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Modals
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [payCustomer, setPayCustomer] = useState<CustomerData | null>(null);

  const [histModalVisible, setHistModalVisible] = useState(false);
  const [histCustomer, setHistCustomer] = useState<CustomerData | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.customers);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        showToast('Failed to fetch customers', 'error');
      }
    } catch {
      showToast('Network error while fetching customers', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const handleSaveCustomer = async (data: CustomerData) => {
    const isEdit = !!data._id;
    const url = isEdit ? API_ENDPOINTS.customerById(data._id!) : API_ENDPOINTS.customers;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchCustomers();
        showToast(isEdit ? 'Customer updated successfully' : 'Customer added successfully', 'success');
      } else {
        const err = await res.json();
        showToast(err.message || 'Operation failed', 'error');
      }
    } catch {
      showToast('Network error. Failed to save customer.', 'error');
    }
  };

  const handleDeleteCustomer = (customer: CustomerData) => {
    if (!customer._id) return;

    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(API_ENDPOINTS.customerById(customer._id!), {
                method: 'DELETE',
              });
              if (res.ok) {
                fetchCustomers();
                showToast('Customer deleted successfully', 'success');
              } else {
                showToast('Failed to delete customer', 'error');
              }
            } catch {
              showToast('Network error while deleting', 'error');
            }
          },
        },
      ]
    );
  };

  const filtered = customers.filter(c =>
    [c.name, c.email, c.phone, c.native, c.district, c.address].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Financial summary calculations
  const totalReceivable = customers.reduce((sum, c) => sum + (Number(c.total_amount) || 0), 0);
  const totalReceived = customers.reduce((sum, c) => sum + (Number(c.amount_received) || 0), 0);
  const totalBalance = customers.reduce((sum, c) => sum + (Number(c.amount_balance) || 0), 0);

  // Count payments recorded via "Save Payment" button (excluding initial creation payment)
  const getSavedPaymentCount = (customer: CustomerData | null | undefined): number => {
    if (!customer || !customer.payment_history) return 0;
    const additionalPayments = customer.payment_history.filter(
      p => p.note !== 'Initial payment'
    );
    return Math.max(additionalPayments.length, Math.max(0, customer.payment_history.length - 1));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>

      {/* Search & Add Action Bar */}
      <View style={[styles.toolbar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textHeading }]}
            placeholder="Search name, phone, district..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setSelectedCustomer(null);
            setFormModalVisible(true);
          }}
        >
          <LinearGradient colors={theme.gradientPrimary} style={styles.addBtnGrad}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Overall Total Amount Banner */}
      <View style={[styles.overallBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.overallLeft}>
          <LinearGradient colors={theme.gradientPrimary} style={styles.overallDot}>
            <Ionicons name="cash" size={12} color="#fff" />
          </LinearGradient>
          <Text style={[styles.overallLabel, { color: theme.textMuted }]}>Overall Total</Text>
        </View>
        <Text style={[styles.overallValue, { color: theme.accent }]}>
          ₹{totalReceivable.toLocaleString()}
        </Text>
      </View>

      {/* Summary Highlights */}
      <View style={styles.summaryBar}>
        <View style={[styles.summaryPill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Customers</Text>
          <Text style={[styles.summaryValue, { color: theme.textHeading }]}>{customers.length}</Text>
        </View>
        <View style={[styles.summaryPill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Received</Text>
          <Text style={[styles.summaryValue, { color: theme.success }]}>₹{totalReceived.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryPill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Balance</Text>
          <Text style={[styles.summaryValue, { color: theme.warning }]}>₹{totalBalance.toLocaleString()}</Text>
        </View>
      </View>

      {/* Customers List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading customer records...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Ionicons name="people-outline" size={56} color={theme.textMuted} />
          <Text style={[styles.emptyTitle, { color: theme.textHeading }]}>
            {search ? 'No matching customers' : 'No customers recorded yet'}
          </Text>
          <Text style={[styles.emptySub, { color: theme.textMuted }]}>
            {search ? 'Try adjusting your search criteria' : 'Tap the "+ Add" button to create your first customer.'}
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => {
            const isCompleted = item.status === 'Completed';
            const paymentCount = item.payment_history?.length || 0;

            return (
              <View
                style={[
                  styles.customerCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                {/* Card Top: Index, Name, Status */}
                <View style={[styles.cardHeader, { borderBottomColor: theme.border }]}>
                  <View style={styles.nameSection}>
                    <View style={[styles.indexBadge, { backgroundColor: theme.accentBg }]}>
                      <Text style={[styles.indexText, { color: theme.accent }]}>{index + 1}</Text>
                    </View>
                    <View style={styles.nameWrap}>
                      <Text style={[styles.customerName, { color: theme.textHeading }]}>
                        {item.name}
                      </Text>
                      {item.phone ? (
                        <Text style={[styles.customerPhone, { color: theme.textMuted }]}>
                          📞 {item.phone}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isCompleted ? theme.successBg : theme.warningBg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: isCompleted ? theme.success : theme.warning },
                      ]}
                    >
                      {item.status || 'Pending'}
                    </Text>
                  </View>
                </View>

                {/* Details Section */}
                <View style={styles.cardBody}>
                  {item.email ? (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Email:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{item.email}</Text>
                    </View>
                  ) : null}

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Location:</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {[item.native, item.district].filter(Boolean).join(', ') || '—'}
                    </Text>
                  </View>

                  {item.address ? (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Address:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]} numberOfLines={2}>
                        {item.address}
                      </Text>
                    </View>
                  ) : null}

                  {/* Financial Metrics Strip */}
                  <View style={[styles.financialStrip, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <View style={styles.finCol}>
                      <Text style={[styles.finLabel, { color: theme.textMuted }]}>TOTAL</Text>
                      <Text style={[styles.finValue, { color: theme.textHeading }]}>
                        ₹{Number(item.total_amount || 0).toLocaleString()}
                      </Text>
                    </View>

                    <View style={[styles.finDivider, { backgroundColor: theme.border }]} />

                    <View style={styles.finCol}>
                      <Text style={[styles.finLabel, { color: theme.textMuted }]}>PAID</Text>
                      <Text style={[styles.finValue, { color: theme.success }]}>
                        ₹{Number(item.amount_received || 0).toLocaleString()}
                      </Text>
                    </View>

                    <View style={[styles.finDivider, { backgroundColor: theme.border }]} />

                    <View style={styles.finCol}>
                      <Text style={[styles.finLabel, { color: theme.textMuted }]}>BALANCE</Text>
                      <Text style={[styles.finValue, { color: isCompleted ? theme.success : theme.danger }]}>
                        ₹{Number(item.amount_balance || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Card Actions Row */}
                <View style={[styles.cardActions, { borderTopColor: theme.border }]}>
                  {/* Record Payment Button */}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.successBg, borderColor: '#a7f3d0' }]}
                    onPress={() => {
                      setPayCustomer(item);
                      setPayModalVisible(true);
                    }}
                  >
                    <Ionicons name="card-outline" size={14} color={theme.success} />
                    <Text style={[styles.actionBtnText, { color: theme.success }]}>Pay</Text>
                  </TouchableOpacity>

                  {/* Payment History Button */}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.infoBg, borderColor: '#bfdbfe' }]}
                    onPress={() => {
                      setHistCustomer(item);
                      setHistModalVisible(true);
                    }}
                  >
                    <Ionicons name="receipt-outline" size={14} color={theme.info} />
                    <Text style={[styles.actionBtnText, { color: theme.info }]}>History</Text>
                  </TouchableOpacity>

                  {/* Edit Customer Button */}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
                    onPress={() => {
                      setSelectedCustomer(item);
                      setFormModalVisible(true);
                    }}
                  >
                    <Ionicons name="create-outline" size={14} color={theme.text} />
                    <Text style={[styles.actionBtnText, { color: theme.text }]}>Edit</Text>
                  </TouchableOpacity>

                  {/* Delete Customer Button */}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.dangerBg, borderColor: '#fecaca' }]}
                    onPress={() => handleDeleteCustomer(item)}
                  >
                    <Ionicons name="trash-outline" size={14} color={theme.danger} />
                    <Text style={[styles.actionBtnText, { color: theme.danger }]}>Del</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Customer Form Modal (Add / Edit) */}
      <CustomerFormModal
        visible={formModalVisible}
        initial={selectedCustomer}
        paymentCount={getSavedPaymentCount(selectedCustomer)}
        onSave={handleSaveCustomer}
        onClose={() => {
          setFormModalVisible(false);
          setSelectedCustomer(null);
        }}
      />

      {/* Record Payment Modal */}
      <PaymentModal
        visible={payModalVisible}
        customer={payCustomer}
        onSuccess={() => {
          fetchCustomers();
          showToast('Payment recorded successfully', 'success');
        }}
        onClose={() => {
          setPayModalVisible(false);
          setPayCustomer(null);
        }}
      />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        visible={histModalVisible}
        customer={histCustomer}
        onClose={() => {
          setHistModalVisible(false);
          setHistCustomer(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  addBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    gap: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  overallBar: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  overallLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  overallDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  overallValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  summaryBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  summaryPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  customerCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nameWrap: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  customerPhone: {
    fontSize: 12,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    maxWidth: '70%',
    textAlign: 'right',
  },
  financialStrip: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  finCol: {
    flex: 1,
    alignItems: 'center',
  },
  finDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  finLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  finValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardActions: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
