import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add support for process.env for next-auth compatibility
    {
      name: 'process-env-support',
      config: () => ({
        define: {
          'process.env': JSON.stringify(process.env),
          'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.VITE_APP_API_URL),
          'process.env.NEXT_AUTH_URL': JSON.stringify(process.env.NEXT_AUTH_URL || 'http://localhost:3000'),
          'process.env.NEXT_PUBLIC_URL': JSON.stringify(process.env.VITE_APP_URL),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID || ''),
          'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET || ''),
          'process.env.JWT_SECRET': JSON.stringify(process.env.NEXT_AUTH_SECRET || 'DEFAULT_SECRET'),
          'global': 'globalThis',
        },
      }),
    },
  ],
  server: {
    port: 3001,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    open: true,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/mp4|webm|ogg/i.test(extType)) {
            return `assets/videos/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  assetsInclude: ['**/*.mp4', '**/*.jpg', '**/*.png', '**/*.gif', '**/*.webp', '**/*.svg', '**/*.mp3', '**/*.wav', '**/*.ogg'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './public/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      'buffer': 'buffer/'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      target: 'es2020'
    },
    include: ['buffer', 'ethers']
  },
  base: '/',
  publicDir: 'public'
})
