import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, usePathname } from 'expo-router';
import React from 'react';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/' && pathname === '/index');
  return (
    <Link href={href} style={{ textDecorationLine: 'none' }}>
      <ThemedText style={{ fontWeight: isActive ? '700' : '500' }}>{label}</ThemedText>
    </Link>
  );
}

export default function HeaderNav() {
  return (
    <ThemedView
      style={{
        width: '100%',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        position: 'sticky' as any,
        top: 0,
        zIndex: 10,
      }}>
      <ThemedText type="title">Car Delivery</ThemedText>
      <ThemedView style={{ flexDirection: 'row', gap: 16 }}>
        <NavLink href="/" label="Orders" />
        <NavLink href="/profile" label="Profile" />
        <NavLink href="/explore" label="Explore" />
      </ThemedView>
    </ThemedView>
  );
}


