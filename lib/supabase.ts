import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

let client: any | null = null;

export async function getSupabase() {
  if (client) return client;
  const { createClient } = await import('@supabase/supabase-js');
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      storageKey: 'supabase-auth',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}


