import OrderCard from '@/components/order-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function OrdersFeedScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.from('orders').select('*').eq('status', 'posted').order('created_at', { ascending: false });
      setOrders((data as any[] | null)?.map(mapOrderFromDb) ?? []);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    const intervalId = setInterval(() => {
      load();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const acceptOrder = async (orderId: string) => {
    if (!user || user.role !== 'carrier') return;
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'accepted', accepted_by_user_id: user.id, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('status', 'posted')
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        Alert.alert('Order unavailable', 'This order was already accepted by another carrier.');
      }
    } catch (e: any) {
      Alert.alert('Failed to accept', e?.message ?? 'Please try again.');
    } finally {
      await load();
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity onPress={() => setSelected(item)} activeOpacity={0.7}>
      <OrderCard order={item} role={user?.role} onAccept={acceptOrder} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Container>
        <ThemedText type="title">Posted Orders</ThemedText>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}> 
          {orders.length === 0 ? (
            <ThemedText>No orders yet.</ThemedText>
          ) : (
            orders.map((o) => <View key={o.id}>{renderItem({ item: o } as any)}</View>)
          )}
        </ScrollView>
        <Modal
          visible={!!selected}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelected(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              {selected && (
                <ScrollView contentContainerStyle={{ gap: 8 }}>
                  <ThemedText type="title">{selected.pickupCity} → {selected.dropoffCity}</ThemedText>
                  <ThemedText>{selected.miles} miles • ${selected.price}</ThemedText>
                  {selected.imageUrl ? (
                    <Image source={{ uri: selected.imageUrl }} style={styles.modalImage} resizeMode="contain" />
                  ) : null}
                  <View style={{ height: 8 }} />
                  {user?.role === 'carrier' && (
                    <>
                      <Container style={{ paddingHorizontal: 0 }}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity onPress={async () => { await acceptOrder(selected.id); setSelected(null); }}>
                            <View style={styles.primaryBtn}><ThemedText style={styles.primaryBtnText}>Accept</ThemedText></View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setSelected(null)}>
                            <View style={styles.ghostBtn}><ThemedText>Close</ThemedText></View>
                          </TouchableOpacity>
                        </View>
                      </Container>
                    </>
                  )}
                  {!user || user.role !== 'carrier' ? (
                    <TouchableOpacity onPress={() => setSelected(null)}>
                      <View style={styles.ghostBtn}><ThemedText>Close</ThemedText></View>
                    </TouchableOpacity>
                  ) : null}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </Container>
    </ThemedView>
  );
}

function mapOrderFromDb(row: any): Order {
  return {
    id: row.id,
    pickupCity: row.pickup_city,
    dropoffCity: row.dropoff_city,
    miles: row.miles,
    price: row.price,
    status: row.status,
    createdByUserId: row.created_by_user_id,
    acceptedByUserId: row.accepted_by_user_id ?? undefined,
    imageUrl: row.image_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as Order;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: 'white',
  },
  ghostBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  card: {},
  button: {},
  buttonText: {},
});
