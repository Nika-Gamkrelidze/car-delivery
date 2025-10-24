import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrders, saveOrders } from '@/lib/storage';

const MIGRATION_FLAG = 'cd_migrated_remove_seed_orders_v1';

export async function runMigrations(): Promise<void> {
  try {
    const done = await AsyncStorage.getItem(MIGRATION_FLAG);
    if (!done) {
      const existing = await getOrders();
      const filtered = existing.filter((o) => o.createdByUserId !== 'seed_customer');
      if (filtered.length !== existing.length) {
        await saveOrders(filtered);
      }
      await AsyncStorage.setItem(MIGRATION_FLAG, '1');
    }
  } catch {
    // ignore
  }
}


