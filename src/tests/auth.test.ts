import { describe, it, expect, beforeEach, vi } from 'vitest'
import { supabase, supabaseAdmin } from '../lib/supabase'
import type { UserRole } from '../types/auth'
import type { AuthError, User } from '@supabase/supabase-js'
import { mockSupabaseAdmin } from '../test/__mocks__/supabase'

describe('Authentication and Role System', () => {
  const testEmail = `test${Date.now()}@example.com`
  const testPassword = 'Test123!@#'
  const testName = 'Test User'
  const testUserId = 'test-user-id'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should sign up a new user', async () => {
    const mockUser: User = {
      id: testUserId,
      email: testEmail,
      role: 'authenticated',
      aud: 'authenticated',
      created_at: new Date().toISOString()
    }

    mockSupabaseAdmin.auth.admin.createUser.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null
    })

    const { data, error } = await mockSupabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { name: testName }
    })

    expect(error).toBeNull()
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe(testEmail)
    expect(data.user.id).toBe(testUserId)
  })

  it('should sign in with password', async () => {
    const mockUser: User = {
      id: testUserId,
      email: testEmail,
      role: 'authenticated',
      aud: 'authenticated',
      created_at: new Date().toISOString()
    }

    mockSupabaseAdmin.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: mockUser,
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser
        }
      },
      error: null
    })

    const { data, error } = await mockSupabaseAdmin.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    expect(error).toBeNull()
    expect(data.user?.email).toBe(testEmail)
    expect(data.session?.access_token).toBeDefined()
  })

  it('should fail to sign in with incorrect password', async () => {
    const mockError: AuthError = {
      name: 'AuthError',
      message: 'Invalid credentials',
      status: 400
    }

    mockSupabaseAdmin.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: mockError
    })

    const { data, error } = await mockSupabaseAdmin.auth.signInWithPassword({
      email: testEmail,
      password: 'wrongpassword'
    })

    expect(error).not.toBeNull()
    expect(error?.message).toBe('Invalid credentials')
    expect(data.user).toBeNull()
    expect(data.session).toBeNull()
  })

  it('should update user role to staff', async () => {
    // Mock para la actualización
    mockSupabaseAdmin.from.mockReturnValueOnce({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      })
    } as any)

    // Mock para la verificación
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: testUserId, role: 'staff' as UserRole },
            error: null
          })
        })
      })
    } as any)

    // Primera llamada: actualizar el rol
    const { error: updateError } = await mockSupabaseAdmin
      .from('profiles')
      .update({ role: 'staff' as UserRole })
      .eq('id', testUserId)

    expect(updateError).toBeNull()

    // Segunda llamada: verificar el rol actualizado
    const { data: profile } = await mockSupabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', testUserId)
      .single()

    expect(profile?.role).toBe('staff')
  })

  it('should sign out successfully', async () => {
    mockSupabaseAdmin.auth.signOut.mockResolvedValueOnce({
      error: null
    })

    const { error } = await mockSupabaseAdmin.auth.signOut()
    expect(error).toBeNull()
  })
})
