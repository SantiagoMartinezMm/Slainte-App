import React, { useEffect, useState } from 'react';
import { toastStore, type Toast, type ToastVariant } from '../../stores/toastStore'; // Ajusta la ruta si es necesario

// Mapeo de variantes a estilos de Tailwind (duplicado de Toast.astro, idealmente se compartiría)
const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300',
};

const baseStyles = "max-w-xs w-full p-4 rounded-lg shadow border flex items-center space-x-3 mb-2"; // Añadido mb-2 para separación

// Componente React que renderiza los toasts del store
const ToastContainer: React.FC = () => {
  // Usa useState para mantener el estado local sincronizado con el store
  const [toasts, setToasts] = useState<Toast[]>(toastStore.getState().toasts);

  useEffect(() => {
    // Suscribirse a los cambios del store
    const unsubscribe = toastStore.subscribe(
      (state) => setToasts(state.toasts) // Actualiza el estado local cuando el store cambia
    );
    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []); // El array vacío asegura que la suscripción se haga solo una vez

  const handleClose = (id: string) => {
    toastStore.getState().removeToast(id);
  };

  // Si no hay toasts, no renderizar nada
  if (toasts.length === 0) {
    return null;
  }

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          id={`toast-${toast.id}`}
          className={`${baseStyles} ${variantStyles[toast.variant]}`}
          // Podríamos añadir animaciones aquí usando librerías como framer-motion
        >
          {/* Icono opcional basado en la variante */}
          {/* <div className="icon-placeholder w-5 h-5"></div> */}

          <div className="text-sm font-normal">{toast.message}</div>

          {/* Botón de cierre opcional */}
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => handleClose(toast.id)}
          >
            <span className="sr-only">Close</span>
            {/* Icono X */}
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
      ))}
    </>
  );
};

export default ToastContainer;

// Añadir export vacío para asegurar que se trate como módulo
export {};
