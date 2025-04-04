/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'
import path from 'path' // Necesario para resolver alias
import { fileURLToPath } from 'url' // Necesario para resolver alias

// Cargar variables de entorno
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Añadir configuración de alias para Vitest
    alias: [
      { find: '@/', replacement: path.resolve(__dirname, 'src') + '/' },
      { find: '@/components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@/lib', replacement: path.resolve(__dirname, 'src/lib') },
      { find: '@/utils', replacement: path.resolve(__dirname, 'src/lib/utils.ts') },
      { find: '@/ui', replacement: path.resolve(__dirname, 'src/components/ui') },
    ],
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    env: {
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL
    }
  },
})
