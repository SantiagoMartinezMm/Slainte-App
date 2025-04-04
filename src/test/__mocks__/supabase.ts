import { vi } from 'vitest'

// Mock del cliente Supabase
export const mockSupabaseClient = {
  auth: {
    signUp: vi.fn().mockImplementation(async ({ email, password }) => {
      const response = await fetch('https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      return {
        data: {
          user: data.user,
          session: data.session
        },
        error: data.error
      }
    }),

    signInWithPassword: vi.fn().mockImplementation(async ({ email, password }) => {
      if (password === 'wrongpassword') {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid credentials' }
        }
      }
      return {
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: {
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token'
          }
        },
        error: null
      }
    }),

    signInWithOAuth: vi.fn().mockImplementation(async ({ provider, options }) => {
      if (provider === 'google' && options?.redirectTo) {
        const params = new URLSearchParams({
          provider,
          ...(options?.redirectTo ? { redirect_to: options.redirectTo } : {})
        })
        
        const url = `https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/authorize?${params.toString()}`
        window.location.assign(url)
        
        return { data: { provider, url }, error: null }
      }
      return { data: null, error: { message: 'Google auth failed' } }
    }),

    signOut: vi.fn().mockImplementation(async () => {
      const response = await fetch('https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_token'
        }
      })
      return { error: null }
    }),

    getSession: vi.fn().mockImplementation(() => {
      return Promise.resolve({
        data: { session: null },
        error: null
      })
    }),

    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
        error: null
      }
    })
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  })),
}

// Mock del cliente Supabase Admin
export const mockSupabaseAdmin = {
  auth: {
    admin: {
      createUser: vi.fn(),
      deleteUser: vi.fn(),
      listUsers: vi.fn(),
      updateUserById: vi.fn()
    },
    signInWithPassword: vi.fn(),
    signOut: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }))
}

// Mock del módulo supabase
vi.mock('../lib/supabase', () => ({
  supabase: mockSupabaseClient,
  supabaseAdmin: mockSupabaseAdmin
}))
