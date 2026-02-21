import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://vedana.tech',
  base: '/',
  build: {
    assets: '_astro',
  },
  experimental: { contentLayer: true }
});
