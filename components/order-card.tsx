import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { Order } from '@/lib/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface OrderCardProps {
  order: Order;
  onAccept?: (orderId: string) => void;
  onDeliver?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  onGiveUp?: (orderId: string) => void;
  role?: 'customer' | 'carrier';
}

export function OrderCard({ order, onAccept, onCancel, onDeliver, onGiveUp, role }: OrderCardProps) {
  const statusTone =
    order.status === 'posted'
      ? 'info'
      : order.status === 'accepted'
      ? 'warning'
      : order.status === 'delivered'
      ? 'success'
      : 'danger';

  return (
    <Card style={styles.row}>
      <View style={{ gap: 6 }}>
        <ThemedText type="subtitle">{order.pickupCity} → {order.dropoffCity}</ThemedText>
        <ThemedText>{order.miles} miles • ${order.price}</ThemedText>
        <Badge label={order.status} tone={statusTone as any} />
      </View>
      <View style={styles.actions}>
        {role === 'carrier' && order.status === 'posted' && (
          <Button title="Accept" variant="primary" onPress={() => onAccept?.(order.id)} />
        )}
        {order.status === 'accepted' && (
          <>
            <Button title="Delivered" variant="secondary" onPress={() => onDeliver?.(order.id)} />
            {role === 'carrier' ? (
              <Button title="Give up" variant="danger" onPress={() => onGiveUp?.(order.id)} />
            ) : (
              <Button title="Cancel" variant="danger" onPress={() => onCancel?.(order.id)} />
            )}
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});

export default OrderCard;


