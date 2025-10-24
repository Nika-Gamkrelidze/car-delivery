import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';
import { generateId, getOrders, saveOrders } from '@/lib/storage';
import { Order } from '@/lib/types';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [pickupCity, setPickupCity] = useState('');
  const [dropoffCity, setDropoffCity] = useState('');
  const [miles, setMiles] = useState('');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    load();
  }, []);

  const myCurrent = useMemo(() => {
    if (!user) return [] as Order[];
    if (user.role === 'customer') return orders.filter((o) => o.createdByUserId === user.id && o.status !== 'delivered' && o.status !== 'cancelled');
    return orders.filter((o) => o.acceptedByUserId === user.id && o.status !== 'delivered' && o.status !== 'cancelled');
  }, [orders, user]);

  const myHistory = useMemo(() => {
    if (!user) return [] as Order[];
    if (user.role === 'customer') return orders.filter((o) => o.createdByUserId === user.id && (o.status === 'delivered' || o.status === 'cancelled'));
    return orders.filter((o) => o.acceptedByUserId === user.id && (o.status === 'delivered' || o.status === 'cancelled'));
  }, [orders, user]);

  const placeOrder = async () => {
    if (!user) return;
    if (!pickupCity || !dropoffCity || !miles || !price) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }
    const milesNum = Number(miles);
    const priceNum = Number(price);
    if (isNaN(milesNum) || isNaN(priceNum)) {
      Alert.alert('Invalid input', 'Miles and price must be numbers');
      return;
    }
    const data = await getOrders();
    const newOrder: Order = {
      id: generateId('order'),
      pickupCity: pickupCity.trim(),
      dropoffCity: dropoffCity.trim(),
      miles: milesNum,
      price: priceNum,
      status: 'posted',
      createdByUserId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [newOrder, ...data];
    await saveOrders(next);
    setPickupCity('');
    setDropoffCity('');
    setMiles('');
    setPrice('');
    await load();
  };

  const markDelivered = async (orderId: string) => {
    const data = await getOrders();
    const next = data.map((o) => (o.id === orderId ? { ...o, status: 'delivered', updatedAt: new Date().toISOString() } : o));
    await saveOrders(next);
    await load();
  };

  const cancelOrder = async (orderId: string) => {
    const data = await getOrders();
    const next = data.map((o) => (o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o));
    await saveOrders(next);
    await load();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      {user && (
        <ThemedText>
          {user.name} • {user.email} • {user.role}
        </ThemedText>
      )}
      <View style={{ height: 8 }} />
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <ThemedText style={styles.logoutText}>Log out</ThemedText>
      </TouchableOpacity>

      {user?.role === 'customer' && (
        <View style={styles.card}>
          <ThemedText type="subtitle">Place an order</ThemedText>
          <TextInput placeholder="Pickup city" style={styles.input} value={pickupCity} onChangeText={setPickupCity} />
          <TextInput placeholder="Dropoff city" style={styles.input} value={dropoffCity} onChangeText={setDropoffCity} />
          <TextInput placeholder="Miles" keyboardType="numeric" style={styles.input} value={miles} onChangeText={setMiles} />
          <TextInput placeholder="Price ($)" keyboardType="numeric" style={styles.input} value={price} onChangeText={setPrice} />
          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <ThemedText style={styles.buttonText}>Post order</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 12 }} />
      <ThemedText type="subtitle">Current</ThemedText>
      <FlatList
        data={myCurrent}
        keyExtractor={(o) => o.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ThemedView style={styles.row}>
            <ThemedText>
              {item.pickupCity} → {item.dropoffCity} • {item.miles} mi • ${item.price} • {item.status}
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.smallBtn} onPress={() => markDelivered(item.id)}>
                <ThemedText style={styles.smallBtnText}>Delivered</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#ef4444' }]} onPress={() => cancelOrder(item.id)}>
                <ThemedText style={styles.smallBtnText}>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText>No current orders.</ThemedText>}
      />

      <View style={{ height: 12 }} />
      <ThemedText type="subtitle">History</ThemedText>
      <FlatList
        data={myHistory}
        keyExtractor={(o) => o.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ThemedView style={styles.row}>
            <ThemedText>
              {item.pickupCity} → {item.dropoffCity} • {item.miles} mi • ${item.price} • {item.status}
            </ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText>No historical orders.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'white',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '600' },
  row: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  smallBtnText: { color: 'white', fontWeight: '600' },
  logout: { alignSelf: 'flex-start', backgroundColor: '#111827', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: 'white', fontWeight: '600' },
});


