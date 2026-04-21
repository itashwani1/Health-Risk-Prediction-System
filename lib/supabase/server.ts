import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build if variables are missing
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
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

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // The "setAll" method was called from a Server Component.
        }
      },
    },
  })
}
