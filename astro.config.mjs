// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://graneestudio.com.ar',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Una landing de una sola página: conviene el CSS embebido en el HTML
    // antes que un pedido de red extra bloqueando el renderizado.
    inlineStylesheets: 'always',
  },
});
