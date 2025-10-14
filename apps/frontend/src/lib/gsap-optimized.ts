// Optimized GSAP configuration for better performance and bundle size
import { gsap } from 'gsap';

// Performance optimizations
export const initGSAP = () => {
  // Set global defaults for better performance
  gsap.defaults({
    duration: 0.3,
    ease: 'power2.out',
    // Use will-change for hardware acceleration
    force3D: true,
    // Optimize for performance
    autoAlpha: 1,
  });

  // Disable ticker when not needed (saves CPU)
  gsap.ticker.lagSmoothing(1000, 16);

  // Register plugins only when needed (lazy loading)
  // This prevents loading unused plugins
};

// Optimized animation functions with performance considerations
export const animations = {
  // Fade animation with hardware acceleration
  fade: (element: Element, options: gsap.TweenVars = {}) => {
    return gsap.to(element, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      force3D: true,
      ...options,
    });
  },

  // Slide animation optimized for transform
  slide: (element: Element, options: gsap.TweenVars = {}) => {
    return gsap.to(element, {
      x: '-100%',
      duration: 0.3,
      ease: 'power2.inOut',
      force3D: true,
      ...options,
    });
  },

  // Scale animation with perspective optimization
  scale: (element: Element, options: gsap.TweenVars = {}) => {
    return gsap.to(element, {
      scale: 0.95,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      force3D: true,
      transformOrigin: 'center center',
      ...options,
    });
  },

  // Optimized hover animation
  hover: {
    enter: (element: Element, options: gsap.TweenVars = {}) => {
      return gsap.to(element, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out',
        force3D: true,
        ...options,
      });
    },
    leave: (element: Element, options: gsap.TweenVars = {}) => {
      return gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
        force3D: true,
        ...options,
      });
    },
  },

  // Page entrance animation with stagger optimization
  pageEntrance: (container: Element, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      container,
      {
        opacity: 0,
        y: 20,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
        ...options,
      }
    );
  },

  // Batch animation for multiple elements
  batch: (elements: Element[], options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        force3D: true,
        ...options,
      }
    );
  },
};

// Performance monitoring utility
export const createPerformanceMonitor = () => {
  let animationCount = 0;

  return {
    start: () => {
      animationCount++;
      if (animationCount > 10) {
        console.warn('Many GSAP animations running simultaneously. Consider optimization.');
      }
    },
    end: () => {
      animationCount = Math.max(0, animationCount - 1);
    },
    getCount: () => animationCount,
  };
};

// Memory management utilities
export const cleanup = {
  // Kill all tweens for an element
  killTweens: (element: Element) => {
    gsap.killTweensOf(element);
  },

  // Kill all tweens globally (use sparingly)
  killAll: () => {
    gsap.killTweensOf('*');
  },

  // Set element to safe state
  reset: (element: Element) => {
    gsap.set(element, {
      clearProps: 'all',
    });
  },
};

// Responsive animation utilities
export const responsive = {
  // Disable animations on low-end devices
  shouldAnimate: () => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    // Check for low-end device indicators
    const connection = (navigator as any).connection;
    if (connection && connection.saveData) {
      return false;
    }

    // Check memory constraints
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      return false;
    }

    return true;
  },

  // Get appropriate duration based on device performance
  getDuration: (baseDuration: number = 0.3) => {
    if (!responsive.shouldAnimate()) return 0;

    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      return baseDuration * 0.5; // Faster animations for low-end devices
    }

    return baseDuration;
  },
};

// Initialize GSAP with optimizations
initGSAP();

export { gsap };
