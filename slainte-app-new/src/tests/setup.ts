 import { beforeAll } from 'vitest'
import { config } from 'dotenv'
import { supabase } from '../lib/supabase'

// Load environment variables from .env file
config()

// Verify that required environment variables are set
const requiredEnvVars = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PUBLIC_SITE_URL'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

beforeAll(async () => {
  try {
    const { error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    console.log('Successfully connected to Supabase')
  } catch (error) {
    console.error('Failed to connect to Supabase:', error)
    throw error
  }
})
