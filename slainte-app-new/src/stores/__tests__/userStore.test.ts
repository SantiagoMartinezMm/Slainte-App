import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../userStore';
import type { User } from '@supabase/supabase-js';

// Mock básico de un objeto User de Supabase
const mockUser: User = {
  id: 'user-123',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

describe('userStore', () => {
  // Resetear el store antes de cada test
  beforeEach(() => {
    // Resetear solo los datos, no las funciones
    useUserStore.setState({
      user: null,
      isLoading: true, // El estado inicial definido en el store
      error: null,
    });
  });

  it('should initialize with null user, isLoading true, and null error', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set the user and update loading/error state', () => {
    useUserStore.getState().setUser(mockUser);
    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false); // setUser debe poner isLoading en false
    expect(state.error).toBeNull();
  });

  it('should set user to null and update loading/error state', () => {
    // Establecer un usuario primero
    useUserStore.getState().setUser(mockUser);
    expect(useUserStore.getState().user).not.toBeNull();

    // Establecer usuario a null (logout)
    useUserStore.getState().setUser(null);
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set loading state', () => {
    useUserStore.getState().setIsLoading(true);
    expect(useUserStore.getState().isLoading).toBe(true);

    useUserStore.getState().setIsLoading(false);
    expect(useUserStore.getState().isLoading).toBe(false);
  });

  it('should set error message and update loading state', () => {
    const errorMessage = 'Authentication failed';
    useUserStore.getState().setError(errorMessage);
    const state = useUserStore.getState();
    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false); // setError debe poner isLoading en false
    expect(state.user).toBeNull(); // Asumimos que al haber error, no hay usuario
  });

  it('should clear error when user is set', () => {
    // Establecer un error primero
    useUserStore.getState().setError('Some error');
    expect(useUserStore.getState().error).not.toBeNull();

    // Establecer un usuario
    useUserStore.getState().setUser(mockUser);
    expect(useUserStore.getState().error).toBeNull();
  });

});
