import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// import { gsapOptimizationPlugin, analyzeGSAPUsage } from './src/lib/vite-gsap-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX runtime for better performance
      jsxRuntime: 'automatic',
    }),
    // GSAP optimization plugins
    // gsapOptimizationPlugin(),
    // analyzeGSAPUsage(),
  ],
  define: {
    // Help resolve zod import issues
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/store': resolve(__dirname, './src/store'),
      '@/graphql': resolve(__dirname, './src/graphql'),
      '@maglo/shared': resolve(__dirname, '../../packages/shared/src'),
      '@maglo/config': resolve(__dirname, '../../packages/config/src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    // Open browser automatically
    open: false,
    // Enable cors for better API development
    cors: true,
  },
  build: {
    outDir: 'dist',
    // Enable source maps only in development for better debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize for production
    minify: 'esbuild',
    target: 'es2020',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@heroicons/react', 'clsx', 'tailwind-merge'],
          apollo: ['@apollo/client', 'graphql'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          query: ['@tanstack/react-query'],
          // Separate GSAP chunk for animation features
          gsap: ['gsap', '@gsap/react'],
        },
        // Better chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      '@apollo/client',
      // Include GSAP for faster dev startup
      'gsap',
      '@gsap/react',
      // Include Zod and related packages
      'zod',
      '@hookform/resolvers',
      '@hookform/resolvers/zod',
      'react-hook-form',
    ],
    // Exclude unused GSAP plugins to reduce bundle size
    exclude: ['gsap/ScrollTrigger', 'gsap/TextPlugin', 'gsap/Draggable'],
  },
  // Enable CSS preprocessing optimizations
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  // Performance optimizations
  esbuild: {
    // Remove console logs and debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // Preview server options
  preview: {
    port: 4173,
    host: true,
  },
});
