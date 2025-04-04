// src/stores/settingsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipo para el tema de la aplicación
type Theme = 'light' | 'dark' | 'system';
// Tipo para idiomas soportados (ejemplo)
type Language = 'es' | 'en';

// Definición del estado de las configuraciones
interface SettingsState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  // Se pueden añadir más configuraciones aquí
  // e.g., notificationsEnabled: boolean;
}

// Creación del store con Zustand y persistencia
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Valores iniciales
      theme: 'system', // Por defecto, seguir la configuración del sistema
      language: 'es', // Idioma por defecto

      // Acciones para modificar el estado
      setTheme: (theme) => {
        set({ theme });
        // Lógica adicional para aplicar el tema (e.g., añadir/quitar clase 'dark' al body)
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage', // Nombre para el almacenamiento
      storage: createJSONStorage(() => localStorage), // Usar localStorage
      // Opcional: Solo persistir ciertas partes
      // partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
);

// Función para aplicar el tema inicial al cargar la app
// Debe llamarse en un punto de entrada, después de que el DOM esté listo
export function initializeTheme() {
  const initialTheme = useSettingsStore.getState().theme;
  if (initialTheme === 'dark' || (initialTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Escuchar cambios en la preferencia del sistema si el tema es 'system'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (useSettingsStore.getState().theme === 'system') {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}

// Llamada inicial (mover a un layout o punto de entrada)
// if (typeof window !== 'undefined') {
//   initializeTheme();
// }
