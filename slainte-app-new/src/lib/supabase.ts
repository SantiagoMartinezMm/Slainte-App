import { createClient } from '@supabase/supabase-js'
import type { AstroCookies } from 'astro'
import type { Database } from './database.types'

const supabaseUrl = 'https://myjqdrrrqfdugzmuejypz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15anFkcnJxZmR1Z3ptdWVqeXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyMTUxNjgsImV4cCI6MjAxNjc5MTE2OH0.YQD0OP0GWXVewb8Tc4cXYhHcHqGE3iAVHiXJgzXDoJo'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client for browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true // Habilitar logs detallados
  },
  global: {
    fetch: (url, options) => {
      console.log('Supabase Request:', { url, options })
      return fetch(url, options).then(async (response) => {
        const responseClone = response.clone()
        try {
          const data = await responseClone.json()
          console.log('Supabase Response:', { url, status: response.status, data })
        } catch (e) {
          console.log('Supabase Response:', { url, status: response.status, body: 'No JSON body' })
        }
        return response
      })
    }
  }
})

// Create Supabase server client
export const createServerClient = (cookies?: AstroCookies) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: true // Habilitar logs detallados
    }
  })
}
