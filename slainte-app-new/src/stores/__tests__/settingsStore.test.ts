import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore } from '../settingsStore';

// Mock de matchMedia necesario para la lógica inicial de setTheme
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false, // Por defecto, simular preferencia 'light'
  media: query,
  onchange: null,
  addListener: vi.fn(), // Deprecated
  removeListener: vi.fn(), // Deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

vi.stubGlobal('matchMedia', mockMatchMedia);

describe('settingsStore', () => {
  // Resetear el store antes de cada test
  beforeEach(() => {
    // Resetear solo los datos
    useSettingsStore.setState({
      theme: 'system', // Valor inicial definido en el store
      language: 'es', // Valor inicial definido en el store
    });
    // Limpiar mocks si es necesario
    vi.clearAllMocks();
  });

  it('should initialize with default theme "system" and language "es"', () => {
    const state = useSettingsStore.getState();
    expect(state.theme).toBe('system');
    expect(state.language).toBe('es');
  });

  it('should set the theme', () => {
    useSettingsStore.getState().setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');

    useSettingsStore.getState().setTheme('light');
    expect(useSettingsStore.getState().theme).toBe('light');

    useSettingsStore.getState().setTheme('system');
    expect(useSettingsStore.getState().theme).toBe('system');
  });

  it('should set the language', () => {
    useSettingsStore.getState().setLanguage('en');
    expect(useSettingsStore.getState().language).toBe('en');

    useSettingsStore.getState().setLanguage('es');
    expect(useSettingsStore.getState().language).toBe('es');
  });

  // Nota: La lógica de manipulación del DOM dentro de setTheme
  // no se prueba aquí directamente, ya que requiere un entorno de navegador completo (jsdom)
  // y mocks específicos del DOM (document.documentElement).
  // Estos tests se centran en la lógica del estado del store.

});
