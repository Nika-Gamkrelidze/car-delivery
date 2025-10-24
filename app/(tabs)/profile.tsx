import OrderCard from '@/components/order-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import Input from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [pickupCity, setPickupCity] = useState('');
  const [dropoffCity, setDropoffCity] = useState('');
  const [miles, setMiles] = useState('');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  const isFetchingRef = useRef(false);

  const load = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders(((data as any[]) ?? []).map(mapOrderFromDb));
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    load();
    const intervalId = setInterval(() => {
      load();
    }, 10000);
    return () => clearInterval(intervalId);
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
    await (await getSupabase()).from('orders').insert({
      pickup_city: pickupCity.trim(),
      dropoff_city: dropoffCity.trim(),
      miles: milesNum,
      price: priceNum,
      status: 'posted',
      created_by_user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setPickupCity('');
    setDropoffCity('');
    setMiles('');
    setPrice('');
    await load();
  };

  const markDelivered = async (orderId: string) => {
    await (await getSupabase()).from('orders').update({ status: 'delivered', updated_at: new Date().toISOString() }).eq('id', orderId);
    await load();
  };

  const cancelOrder = async (orderId: string) => {
    await (await getSupabase()).from('orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', orderId);
    await load();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Container>
        {user && (
          <ThemedText>
            {user.name} • {user.email} • {user.role}
          </ThemedText>
        )}
        <View style={{ height: 8 }} />
        <Button
          title={loggingOut ? 'Signing out…' : 'Log out'}
          variant="ghost"
          onPress={async () => {
            try {
              setLoggingOut(true);
              await logout();
              router.replace('/login');
            } finally {
              setLoggingOut(false);
            }
          }}
          disabled={loggingOut}
          loading={loggingOut}
        />

        {user?.role === 'customer' && (
          <Card style={styles.card}>
            <ThemedText type="subtitle">Place an order</ThemedText>
            <Input placeholder="Pickup city" value={pickupCity} onChangeText={setPickupCity} />
            <Input placeholder="Dropoff city" value={dropoffCity} onChangeText={setDropoffCity} />
            <Input placeholder="Miles" keyboardType="numeric" value={miles} onChangeText={setMiles} />
            <Input placeholder="Price ($)" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <Button title="Post order" onPress={placeOrder} />
          </Card>
        )}

        <View style={{ height: 12 }} />
        <ThemedText type="subtitle">Current</ThemedText>
        <View style={{ height: 8 }} />
        {myCurrent.length === 0 ? (
          <ThemedText>No current orders.</ThemedText>
        ) : (
          <View style={{ gap: 8 }}>
            {myCurrent.map((item) => (
              <OrderCard key={item.id} order={item} role={user?.role} onDeliver={markDelivered} onCancel={cancelOrder} />
            ))}
          </View>
        )}

        <View style={{ height: 12 }} />
        <ThemedText type="subtitle">History</ThemedText>
        <View style={{ height: 8 }} />
        {myHistory.length === 0 ? (
          <ThemedText>No historical orders.</ThemedText>
        ) : (
          <View style={{ gap: 8 }}>
            {myHistory.map((item) => (
              <OrderCard key={item.id} order={item} role={user?.role} />
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
        <ThemedText type="subtitle">Settings</ThemedText>
        <Card style={{ gap: 8 }}>
          <ThemedText>Theme</ThemedText>
          <ThemeSelector />
        </Card>
        </Container>
      </ScrollView>
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
  container: { flex: 1, padding: 16 },
  card: { gap: 8 },
  input: {},
  button: {},
  buttonText: {},
  row: {},
  smallBtn: {},
  smallBtnText: {},
  logout: {},
  logoutText: {},
});

import { ThemeSelector } from '../../components/theme-selector';


