import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Container } from '@/components/ui/container';
import { Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Link, usePathname } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/' && pathname === '/index');
  const border = useThemeColor({}, 'border' as any);
  const tint = useThemeColor({}, 'tint');
  return (
    <Link href={href as any} asChild>
      <Pressable
        style={({ hovered, pressed }) => [{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: Radius.pill,
          borderWidth: isActive ? 1 : 1,
          borderColor: isActive ? tint : border,
          backgroundColor: isActive ? 'rgba(59,130,246,0.15)' : hovered || pressed ? 'rgba(59,130,246,0.10)' : 'transparent',
          cursor: 'pointer',
        }]}
      >
        <ThemedText style={{ fontWeight: isActive ? '700' : '500' }}>{label}</ThemedText>
      </Pressable>
    </Link>
  );
}

export default function HeaderNav() {
  const border = useThemeColor({}, 'border' as any);
  const bg = useThemeColor({}, 'surface' as any);
  const scheme = useColorScheme();
  const groupBg = scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  return (
    <ThemedView
      style={{
        width: '100%',
        borderBottomWidth: 1,
        borderColor: border,
        backgroundColor: bg,
        position: 'sticky' as any,
        top: 0,
        zIndex: 10,
      }}>
      <Container style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <ThemedText type="title">Car Delivery</ThemedText>
        <ThemedView style={{ flexDirection: 'row', gap: 8, padding: 4, borderRadius: Radius.pill, borderWidth: 1, borderColor: border, backgroundColor: groupBg }}>
          <NavLink href="/" label="Orders" />
          <NavLink href="/profile" label="Profile" />
          <NavLink href="/explore" label="Explore" />
        </ThemedView>
      </Container>
    </ThemedView>
  );
}


