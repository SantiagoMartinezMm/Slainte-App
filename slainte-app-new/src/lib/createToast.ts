// src/lib/createToast.ts
import { toastStore, type Toast, type ToastVariant } from '../stores/toastStore';

// Opciones para crear un toast. Hacemos las propiedades opcionales aquí
// ya que la función principal `createToast` les asignará valores o defaults.
export interface CreateToastOptions {
  message?: string; // El mensaje principal se pasa como primer argumento a createToast
  variant?: ToastVariant;
  duration?: number;
  // Se pueden añadir opciones adicionales si es necesario
}

/**
 * Función para mostrar una notificación toast.
 * Añade la notificación al store global de toasts.
 * @param message El mensaje a mostrar.
 * @param options Opciones adicionales como variant, duration, etc.
 */
export function createToast(message: string, options: CreateToastOptions = {}) {
  const newToast: Toast = {
    id: crypto.randomUUID(), // Generar ID único
    message,
    variant: options.variant ?? 'default',
    duration: options.duration ?? 3000,
    // ...otras opciones que se definan en Toast
    // ...otras opciones que se definan en Toast
  };

  // Usar getState() para acceder a las acciones del store
  toastStore.getState().addToast(newToast);
}

// Se podrían añadir funciones helper para tipos específicos de toast
// Ajustamos el tipo de 'options' para que coincida con CreateToastOptions
export function createSuccessToast(message: string, options: CreateToastOptions = {}) {
  createToast(message, { ...options, variant: 'success' });
}

export function createErrorToast(message: string, options: CreateToastOptions = {}) {
  createToast(message, { ...options, variant: 'error' });
}

export function createInfoToast(message: string, options: CreateToastOptions = {}) {
  createToast(message, { ...options, variant: 'info' });
}

export function createWarningToast(message: string, options: CreateToastOptions = {}) {
  createToast(message, { ...options, variant: 'warning' });
}

// Función para eliminar un toast por ID (si se necesita control externo)
// Usar getState() para acceder a las acciones del store
export function removeToast(id: string) {
  toastStore.getState().removeToast(id);
}
