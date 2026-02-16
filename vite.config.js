import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        publications: resolve(__dirname, 'publications.html'),
        projects: resolve(__dirname, 'projects.html'),
      },
    },
  },
});
