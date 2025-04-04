import { expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'
import '@testing-library/jest-dom'

// Extender los matchers de expect
expect.extend(matchers)

// Mock de Response
class MockResponse {
  constructor(public body: any, public init?: ResponseInit) {}
  
  async json() {
    return this.body
  }
  
  async text() {
    return JSON.stringify(this.body)
  }
  
  clone() {
    return new MockResponse(this.body, this.init)
  }
}

// Mock de fetch global
beforeEach(() => {
  vi.clearAllMocks()
  
  global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
    if (url.includes('/auth/v1/signup')) {
      return Promise.resolve(new MockResponse({
        user: { id: '123', email: 'test@example.com' },
        session: null
      }))
    }
    
    if (url.includes('/auth/v1/token')) {
      const body = JSON.parse(options?.body as string)
      if (body.password === 'wrongpassword') {
        return Promise.resolve(new MockResponse({
          error: { message: 'Invalid credentials' }
        }, { status: 400 }))
      }
      return Promise.resolve(new MockResponse({
        user: { id: '123', email: 'test@example.com' },
        session: {
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token'
        }
      }))
    }
    
    if (url.includes('/auth/v1/signout')) {
      return Promise.resolve(new MockResponse({ error: null }))
    }
    
    return Promise.resolve(new MockResponse({}))
  })
})

// Mock de localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock de location
const mockLocation = {
  assign: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  toString: vi.fn(),
  hash: '',
  host: '',
  hostname: '',
  href: '',
  origin: '',
  pathname: '',
  port: '',
  protocol: '',
  search: ''
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

// Mock de ResizeObserver
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

window.ResizeObserver = MockResizeObserver

// Mock de IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

window.IntersectionObserver = MockIntersectionObserver

afterEach(() => {
  // Limpiar todos los mocks después de cada test
  vi.clearAllMocks()
  mockLocalStorage.clear()
  cleanup()
})

afterAll(() => {
  // Restaurar todos los mocks después de todos los tests
  vi.restoreAllMocks()
})

// Mock de react-icons/fc
vi.mock('react-icons/fc', () => ({
  FcGoogle: () => React.createElement('div', { 'data-testid': 'google-icon' }, 'Google Icon')
}))

// Mock window properties
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Importar y configurar mocks de Supabase
import './__mocks__/supabase'
