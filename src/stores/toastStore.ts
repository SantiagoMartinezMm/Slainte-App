// src/stores/toastStore.ts
import { create } from 'zustand';
// No importar desde .astro - definir el tipo aquí o en un archivo .ts separado

// Tipos de notificación para diferentes estilos (movido desde Toast.astro)
export type ToastVariant = 'info' | 'success' | 'warning' | 'error' | 'default';

// Definición del tipo para una notificación individual
export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number; // 0 para persistente
}

// Definición del estado del store
interface ToastState {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  // Podrían añadirse más acciones si son necesarias
}

// Creación del store con Zustand
export const toastStore = create<ToastState>((set) => ({
  toasts: [], // Estado inicial: array vacío de toasts

  // Acción para añadir un nuevo toast al array
  addToast: (toast) => {
    set((state) => ({ toasts: [...state.toasts, toast] }));

    // Si el toast tiene duración, programar su eliminación
    if (toast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== toast.id),
        }));
      }, toast.duration);
    }
  },

  // Acción para eliminar un toast por su ID
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// Ejemplo de cómo suscribirse a cambios (útil para depuración o efectos secundarios)
// toastStore.subscribe((state) => console.log('Toasts updated:', state.toasts));
