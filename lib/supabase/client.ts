import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time or if keys are missing, return a dummy client
    // to prevent build failure. This is safe as long as we don't 
    // actually call these methods during the build.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        insert: async () => ({ data: null, error: null }),
        select: () => ({
          order: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
