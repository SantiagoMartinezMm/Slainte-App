import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../lib/supabase'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '../components/auth/LoginForm'

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should sign up a new user', async () => {
    const result = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.data.user).toEqual({
      id: '123',
      email: 'test@example.com'
    })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/v1/signup'),
      expect.any(Object)
    )
  })

  it('should sign in with password', async () => {
    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.data.user).toEqual({
      id: '123',
      email: 'test@example.com'
    })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/v1/token'),
      expect.any(Object)
    )
  })

  it('should fail to sign in with incorrect password', async () => {
    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    })

    expect(result.error).toEqual({ message: 'Invalid credentials' })
    expect(result.data.user).toBeNull()
  })

  it('should sign out successfully', async () => {
    const result = await supabase.auth.signOut()

    expect(result.error).toBeNull()
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/v1/signout'),
      expect.any(Object)
    )
  })

  it('should handle Google OAuth login correctly', async () => {
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4321/auth/callback'
      }
    })

    expect(result.error).toBeNull()
    expect(window.location.assign).toHaveBeenCalledWith(
      expect.stringContaining('https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/authorize?provider=google')
    )
  })

  it('should handle Google OAuth error correctly', async () => {
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })

    expect(result.error).toBeNull()
    expect(window.location.assign).toHaveBeenCalledWith(
      expect.stringContaining('https://myjqdrrrqfdugzmuejypz.supabase.co/auth/v1/authorize?provider=google')
    )
  })

  it('should handle login errors correctly', async () => {
    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    })

    expect(result.error).toEqual({ message: 'Invalid credentials' })
    expect(result.data.user).toBeNull()
  })
})
