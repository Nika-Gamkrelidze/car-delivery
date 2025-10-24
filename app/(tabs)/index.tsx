import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { generateId, getOrders, saveOrders } from '@/lib/storage';
import { Order } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function OrdersFeedScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const load = async () => {
    setRefreshing(true);
    const data = await getOrders();
    setOrders(data.filter((o) => o.status === 'posted'));
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  const acceptOrder = async (orderId: string) => {
    if (!user || user.role !== 'carrier') return;
    const data = await getOrders();
    const next = data.map((o) => (o.id === orderId && o.status === 'posted' ? { ...o, status: 'accepted', acceptedByUserId: user.id, updatedAt: new Date().toISOString() } : o));
    await saveOrders(next);
    await load();
  };

  const seedOrders = async () => {
    const data = await getOrders();
    if (data.length > 0) return;
    const samples: Order[] = [
      { id: generateId('order'), pickupCity: 'Los Angeles, CA', dropoffCity: 'San Francisco, CA', miles: 383, price: 650, status: 'posted', createdByUserId: 'seed_customer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId('order'), pickupCity: 'Dallas, TX', dropoffCity: 'Houston, TX', miles: 239, price: 400, status: 'posted', createdByUserId: 'seed_customer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId('order'), pickupCity: 'Chicago, IL', dropoffCity: 'Detroit, MI', miles: 283, price: 450, status: 'posted', createdByUserId: 'seed_customer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId('order'), pickupCity: 'Miami, FL', dropoffCity: 'Orlando, FL', miles: 235, price: 380, status: 'posted', createdByUserId: 'seed_customer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId('order'), pickupCity: 'New York, NY', dropoffCity: 'Boston, MA', miles: 215, price: 360, status: 'posted', createdByUserId: 'seed_customer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    await saveOrders(samples);
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
        ListEmptyComponent={
          <View style={{ gap: 8 }}>
            <ThemedText>No orders yet.</ThemedText>
            <TouchableOpacity style={styles.button} onPress={seedOrders}>
              <ThemedText style={styles.buttonText}>Add sample orders</ThemedText>
            </TouchableOpacity>
          </View>
        }
      />
    </ThemedView>
  );
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
