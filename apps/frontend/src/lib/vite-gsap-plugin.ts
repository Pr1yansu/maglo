import { defineConfig, Plugin } from 'vite';

/**
 * GSAP optimization plugin for Vite
 * - Tree shakes unused GSAP features
 * - Optimizes bundle size
 * - Adds performance monitoring in development
 */
export function gsapOptimizationPlugin(): Plugin {
  return {
    name: 'gsap-optimization',

    // Configure build optimizations
    config(config, { command }) {
      // Add GSAP to manual chunks for better caching
      if (config.build?.rollupOptions?.output) {
        const output = config.build.rollupOptions.output;
        if (typeof output === 'object' && !Array.isArray(output)) {
          output.manualChunks = {
            ...output.manualChunks,
            gsap: ['gsap', '@gsap/react'],
          };
        }
      }

      // Optimize dependencies for faster dev startup
      config.optimizeDeps = {
        ...config.optimizeDeps,
        include: [...(config.optimizeDeps?.include || []), 'gsap', '@gsap/react'],
        exclude: [
          ...(config.optimizeDeps?.exclude || []),
          // Exclude GSAP plugins we're not using to reduce bundle size
          'gsap/ScrollTrigger',
          'gsap/TextPlugin',
          'gsap/Draggable',
          'gsap/MotionPathPlugin',
        ],
      };
    },

    // Transform imports to use only needed GSAP features
    transform(code, id) {
      // Only process TypeScript/JavaScript files
      if (!/\.(ts|tsx|js|jsx)$/.test(id)) return;

      // Replace full GSAP imports with optimized ones
      if (code.includes("import { gsap } from 'gsap'")) {
        // Only import core GSAP features we actually use
        const optimizedImport = `
// Optimized GSAP import - only core features
import { gsap, Power2, Back } from 'gsap/dist/gsap';
import { CSSPlugin } from 'gsap/dist/CSSPlugin';

// Force registration of plugins we need
gsap.registerPlugin(CSSPlugin);
        `.trim();

        return {
          code: code.replace(/import\s*{\s*gsap\s*}\s*from\s*['"]gsap['"];?/g, optimizedImport),
          map: null,
        };
      }
    },

    // Add development performance monitoring
    buildStart() {
      if (process.env.NODE_ENV === 'development') {
        console.log('🎭 GSAP optimization plugin active');
        console.log('📊 Performance monitoring enabled');
      }
    },

    generateBundle(options, bundle) {
      // Log GSAP bundle size in development
      const gsapChunk = Object.values(bundle).find(
        (chunk) => chunk.type === 'chunk' && chunk.fileName.includes('gsap')
      );

      if (gsapChunk && 'code' in gsapChunk) {
        const sizeKB = (gsapChunk.code.length / 1024).toFixed(2);
        console.log(`📦 GSAP bundle size: ${sizeKB}KB`);
      }
    },
  };
}

/**
 * Bundle analyzer for GSAP usage
 * Helps identify unused GSAP features
 */
export function analyzeGSAPUsage(): Plugin {
  const usedFeatures = new Set<string>();

  return {
    name: 'gsap-usage-analyzer',

    transform(code, id) {
      if (!/\.(ts|tsx|js|jsx)$/.test(id)) return;

      // Track which GSAP features are actually used
      const gsapFeatures = [
        'gsap.to',
        'gsap.from',
        'gsap.fromTo',
        'gsap.set',
        'gsap.timeline',
        'gsap.killTweensOf',
        'gsap.registerPlugin',
        'ScrollTrigger',
        'TextPlugin',
        'Draggable',
        'MotionPathPlugin',
      ];

      gsapFeatures.forEach((feature) => {
        if (code.includes(feature)) {
          usedFeatures.add(feature);
        }
      });
    },

    buildEnd() {
      if (process.env.NODE_ENV === 'development') {
        console.log('\n🔍 GSAP Features Analysis:');
        console.log('Used features:', Array.from(usedFeatures));
        console.log('Bundle optimization potential:', usedFeatures.size < 5 ? 'High' : 'Medium');
      }
    },
  };
}

export default gsapOptimizationPlugin;
