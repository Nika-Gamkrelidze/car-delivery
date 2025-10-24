import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

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

  const renderItem = ({ item }: { item: Order }) => {
    return (
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">{item.pickupCity} → {item.dropoffCity}</ThemedText>
        <ThemedText>{item.miles} miles • ${item.price}</ThemedText>
        <ThemedText>Posted by {item.createdByUserId.slice(0, 6)}</ThemedText>
        {user?.role === 'carrier' && (
          <TouchableOpacity style={styles.button} onPress={() => acceptOrder(item.id)}>
            <ThemedText style={styles.buttonText}>Accept</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Posted Orders</ThemedText>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<ThemedText>No orders yet.</ThemedText>}
      />
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
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
