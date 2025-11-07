import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor_mui';
            } else if (id.includes('pngjs')) {
              return 'vendor_pngjs';
            }

            return 'vendor'; // all other package goes here
          }
        },
      },
    },
  },
});
