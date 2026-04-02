// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback values for the demo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

// Only create a real client if valid URL format is provided
const isSimulation = supabaseUrl.includes('mock.supabase.co');

export const supabase = isSimulation ? {
    auth: {
        signInWithPassword: async ({ email }) => ({ data: { user: { id: 'mock-user-id', email } }, error: null }),
        signUp: async ({ email }) => ({ data: { user: { id: 'mock-user-id', email } }, error: null }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: (cb) => {
            cb('SIGNED_IN', { user: { id: 'mock-user-id', email: 'test@pocc.com' } });
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                single: async () => ({ data: { role: 'Admin' }, error: null })
            })
        }),
        insert: async (data) => ({ data, error: null }),
        update: () => ({
            eq: async () => ({ data: [], error: null })
        })
    })
} : createClient(supabaseUrl, supabaseAnonKey);

export { isSimulation };
