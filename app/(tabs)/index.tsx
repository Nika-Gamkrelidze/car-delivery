import OrderCard from '@/components/order-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function OrdersFeedScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const load = async () => {
    setRefreshing(true);
    const supabase = await getSupabase();
    const { data } = await supabase.from('orders').select('*').eq('status', 'posted').order('created_at', { ascending: false });
    setOrders((data as any[] | null)?.map(mapOrderFromDb) ?? []);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  const acceptOrder = async (orderId: string) => {
    if (!user || user.role !== 'carrier') return;
    await (await getSupabase()).from('orders').update({ status: 'accepted', accepted_by_user_id: user.id, updated_at: new Date().toISOString() }).eq('id', orderId).eq('status', 'posted');
    await load();
  };

  const renderItem = ({ item }: { item: Order }) => (
    <OrderCard order={item} role={user?.role} onAccept={acceptOrder} />
  );

  return (
    <ThemedView style={styles.container}>
      <Container>
        <ThemedText type="title">Posted Orders</ThemedText>
        <ScrollView
          contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
          {orders.length === 0 ? (
            <ThemedText>No orders yet.</ThemedText>
          ) : (
            orders.map((o) => <View key={o.id}>{renderItem({ item: o } as any)}</View>)
          )}
        </ScrollView>
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as Order;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {},
  button: {},
  buttonText: {},
});
