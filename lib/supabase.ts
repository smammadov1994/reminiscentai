import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we have real Supabase credentials
const hasValidSupabaseConfig = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.includes('.supabase.co')

export const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string) => {
    if (!supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please add your Supabase credentials to .env.local' }
      }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please add your Supabase credentials to .env.local' }
      }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    if (!supabase) {
      return Promise.resolve({ data: { user: null }, error: null })
    }
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  },

  isConfigured: () => hasValidSupabaseConfig
}