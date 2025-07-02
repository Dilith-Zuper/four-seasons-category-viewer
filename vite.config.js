import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // ✅ Important for Netlify to load assets correctly

  server: {
    proxy: {
      '/api': {
        target: 'https://internalwf-dev.zuper.co',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
