
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export database client for compatibility with existing code
export const db = supabase;

// Note: Replace the above config with real Supabase credentials when deploying
