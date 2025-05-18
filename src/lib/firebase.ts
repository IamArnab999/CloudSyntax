
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://fzlfewtcpihbqqqspvxv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bGZld3RjcGloYnFxcXNwdnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Njk2MjEsImV4cCI6MjA2MzE0NTYyMX0.eGnhVWAiwjW8PKxzZx5ZhrZ-m7CgwTSpMS4epeV-TcI';

// Initialize Supabase with proper auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export database client for compatibility with existing code
export const db = supabase;
