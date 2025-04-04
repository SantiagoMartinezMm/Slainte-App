import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import path from 'path'; // Necesario para resolver alias
import { fileURLToPath } from 'url'; // Necesario para resolver alias

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    analytics: true,
    maxDuration: 60,
    functionPerRoute: false
  }),
  integrations: [react({ ssr: true }), tailwind()],
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom/client'],
    },
    resolve: {
       alias: [
        // Mapear los alias de tsconfig.json a la configuración de Vite
        { find: '\\\'\\\' (see below for file content)', replacement: path.resolve(__dirname, 'src') + '/' },
        { find: '\\\'components\\\' (see below for file content)', replacement: path.resolve(__dirname, 'src/components') },
        { find: '\\\'lib\\\' (see below for file content)', replacement: path.resolve(__dirname, 'src/lib') },
        // Asegurarse que 'utils' (see below for file content) apunta al archivo específico si es necesario
        { find: '\\\'utils\\\' (see below for file content)', replacement: path.resolve(__dirname, 'src/lib/utils.ts') },
        { find: '\\\'ui\\\' (see below for file content)', replacement: path.resolve(__dirname, 'src/components/ui') },
        // Añadir más alias si es necesario, asegurándose que las rutas sean absolutas
        // Ejemplo: { find: '\\\'assets\\\' (see below for file content)', replacement: path.resolve(__dirname, 'src/assets') },
      ],
    },
  }
});
