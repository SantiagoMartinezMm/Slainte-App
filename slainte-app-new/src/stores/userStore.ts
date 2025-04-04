// src/stores/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js'; // Asumiendo que se usa Supabase para la autenticación

// Definición del tipo para el estado del usuario
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean; // Para manejar estados de carga durante la autenticación
  setIsLoading: (loading: boolean) => void;
  error: string | null; // Para almacenar errores de autenticación
  setError: (error: string | null) => void;
  // Podrían añadirse más detalles del perfil si es necesario
  // profile: UserProfile | null;
  // setProfile: (profile: UserProfile | null) => void;
}

// Creación del store con Zustand, incluyendo middleware de persistencia
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null, // Estado inicial: sin usuario logueado
      isLoading: true, // Empezar como cargando hasta que se verifique la sesión inicial
      error: null,

      setUser: (user) => set({ user: user, error: null, isLoading: false }), // Al establecer usuario, quitar error y loading
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error: error, isLoading: false }), // Al establecer error, quitar loading

      // Ejemplo si se añade perfil:
      // profile: null,
      // setProfile: (profile) => set({ profile: profile }),
    }),
    {
      name: 'user-storage', // Nombre para el almacenamiento (localStorage por defecto)
      storage: createJSONStorage(() => localStorage), // Especificar localStorage
      // Opcional: elegir qué partes del estado persistir
      // partialize: (state) => ({ user: state.user }), // Solo persistir el objeto user
      // Ojo: Persistir el objeto User completo de Supabase puede incluir tokens sensibles
      // si no se maneja adecuadamente. Considerar persistir solo la info necesaria (id, email).
      // Por simplicidad inicial, persistimos todo.
    }
  )
);

// Función para inicializar el store o verificar sesión al cargar la app
// Esto podría llamarse en un layout principal o componente raíz
export async function initializeAuth() {
  // Ejemplo con Supabase (requiere importar 'supabase' client)
  /*
  const { supabase } = await import('../lib/supabase'); // Asegúrate que la ruta es correcta
  useUserStore.getState().setIsLoading(true);
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    useUserStore.getState().setUser(session?.user ?? null);
  } catch (error: any) {
    console.error('Error initializing auth:', error);
    useUserStore.getState().setError(error.message || 'Failed to initialize session');
    useUserStore.getState().setUser(null);
  } finally {
    useUserStore.getState().setIsLoading(false);
  }

  // Escuchar cambios de autenticación de Supabase
  supabase.auth.onAuthStateChange((_event, session) => {
    useUserStore.getState().setUser(session?.user ?? null);
    useUserStore.getState().setIsLoading(false);
  });
  */
}

// Llamada inicial (esto podría moverse a un punto de entrada de la app)
// initializeAuth();
