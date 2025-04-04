import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { toastStore, type Toast } from '../toastStore';

describe('toastStore', () => {
  // Resetear el store y mock timers antes de cada test
  beforeEach(() => {
    // Resetear solo la parte de datos del estado
    toastStore.setState({ toasts: [] });
    vi.useFakeTimers(); // Activar mocks de timers
    vi.clearAllTimers(); // Limpiar timers pendientes
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaurar timers reales después de cada test
  });

  it('should initialize with an empty toasts array', () => {
    expect(toastStore.getState().toasts).toEqual([]);
  });

  it('should add a toast to the state', () => {
    const newToast: Toast = { id: '1', message: 'Test Toast', variant: 'info', duration: 3000 };
    toastStore.getState().addToast(newToast);
    expect(toastStore.getState().toasts).toHaveLength(1);
    expect(toastStore.getState().toasts[0]).toEqual(newToast);
  });

  it('should remove a toast from the state by id', () => {
    const toast1: Toast = { id: '1', message: 'Toast 1', variant: 'success', duration: 0 };
    const toast2: Toast = { id: '2', message: 'Toast 2', variant: 'error', duration: 0 };
    toastStore.getState().addToast(toast1);
    toastStore.getState().addToast(toast2);

    expect(toastStore.getState().toasts).toHaveLength(2);

    toastStore.getState().removeToast('1');
    expect(toastStore.getState().toasts).toHaveLength(1);
    expect(toastStore.getState().toasts[0]).toEqual(toast2);

    toastStore.getState().removeToast('2');
    expect(toastStore.getState().toasts).toHaveLength(0);
  });

  it('should automatically remove a toast after its duration', () => {
    const duration = 5000;
    const timedToast: Toast = { id: 'timed', message: 'I will disappear', variant: 'warning', duration: duration };

    toastStore.getState().addToast(timedToast);
    expect(toastStore.getState().toasts).toHaveLength(1);

    // Avanzar el tiempo justo antes de que expire
    vi.advanceTimersByTime(duration - 1);
    expect(toastStore.getState().toasts).toHaveLength(1);

    // Avanzar el tiempo hasta la expiración
    vi.advanceTimersByTime(1);
    expect(toastStore.getState().toasts).toHaveLength(0);
  });

  it('should not automatically remove a toast if duration is 0', () => {
    const persistentToast: Toast = { id: 'persist', message: 'I stay', variant: 'default', duration: 0 };

    toastStore.getState().addToast(persistentToast);
    expect(toastStore.getState().toasts).toHaveLength(1);

    // Avanzar el tiempo arbitrariamente
    vi.advanceTimersByTime(10000);
    expect(toastStore.getState().toasts).toHaveLength(1); // Debe seguir ahí
  });

});
