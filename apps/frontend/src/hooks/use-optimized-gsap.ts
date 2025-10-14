import { useEffect, useRef, useCallback, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap-optimized';
import { responsive, createPerformanceMonitor, cleanup } from '../lib/gsap-optimized';

// Performance monitoring instance
const performanceMonitor = createPerformanceMonitor();

interface UseOptimizedGSAPOptions {
  dependencies?: any[];
  scope?: RefObject<Element>;
  revertOnUpdate?: boolean;
  respectReducedMotion?: boolean;
}

/**
 * Optimized GSAP hook with performance monitoring and cleanup
 */
export const useOptimizedGSAP = (
  callback: () => void | (() => void),
  options: UseOptimizedGSAPOptions = {}
) => {
  const { dependencies = [], scope, revertOnUpdate = true, respectReducedMotion = true } = options;

  const cleanupRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      // Check if animations should run
      if (respectReducedMotion && !responsive.shouldAnimate()) {
        return;
      }

      // Start performance monitoring
      performanceMonitor.start();

      // Execute the callback and store cleanup function
      const cleanupFunction = callback();
      if (typeof cleanupFunction === 'function') {
        cleanupRef.current = cleanupFunction;
      }

      // Return cleanup function
      return () => {
        performanceMonitor.end();
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    },
    { scope, dependencies, revertOnUpdate }
  );

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (scope?.current) {
        cleanup.killTweens(scope.current);
      }
    };
  }, [scope]);
};

/**
 * Hook for optimized hover animations
 */
export const useHoverAnimation = (
  element: RefObject<Element>,
  options: {
    scale?: number;
    duration?: number;
    disabled?: boolean;
  } = {}
) => {
  const { scale = 1.02, duration = 0.2, disabled = false } = options;

  useOptimizedGSAP(
    () => {
      const el = element.current;
      if (!el || disabled) return;

      const handleMouseEnter = () => {
        gsap.to(el, {
          scale,
          duration: responsive.getDuration(duration),
          ease: 'power2.out',
          force3D: true,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          scale: 1,
          duration: responsive.getDuration(duration),
          ease: 'power2.out',
          force3D: true,
        });
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        cleanup.killTweens(el);
      };
    },
    { dependencies: [scale, duration, disabled], scope: element }
  );
};

/**
 * Hook for page transition animations
 */
export const usePageTransition = (
  container: RefObject<Element>,
  options: {
    type?: 'fade' | 'slide' | 'scale';
    duration?: number;
    trigger?: any;
  } = {}
) => {
  const { type = 'fade', duration = 0.4, trigger } = options;

  useOptimizedGSAP(
    () => {
      const el = container.current;
      if (!el) return;

      const animationDuration = responsive.getDuration(duration);

      switch (type) {
        case 'fade':
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: animationDuration,
              ease: 'power2.out',
              force3D: true,
            }
          );
          break;

        case 'slide':
          gsap.fromTo(
            el,
            { x: 20, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: animationDuration,
              ease: 'power2.out',
              force3D: true,
            }
          );
          break;

        case 'scale':
          gsap.fromTo(
            el,
            { scale: 0.95, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: animationDuration,
              ease: 'power2.out',
              force3D: true,
            }
          );
          break;
      }
    },
    { dependencies: [type, duration, trigger], scope: container }
  );
};

/**
 * Hook for batch animations with intersection observer
 */
export const useBatchAnimation = (
  container: RefObject<Element>,
  options: {
    selector?: string;
    stagger?: number;
    threshold?: number;
    once?: boolean;
  } = {}
) => {
  const { selector = '[data-animate]', stagger = 0.1, threshold = 0.1, once = true } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);

  useOptimizedGSAP(
    () => {
      const containerEl = container.current;
      if (!containerEl) return;

      const elements = containerEl.querySelectorAll(selector);
      if (elements.length === 0) return;

      // Set initial state
      gsap.set(elements, {
        opacity: 0,
        y: 30,
        force3D: true,
      });

      // Create intersection observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const elementsInView = entry.target.querySelectorAll(selector);

              gsap.to(elementsInView, {
                opacity: 1,
                y: 0,
                duration: responsive.getDuration(0.6),
                stagger: responsive.shouldAnimate() ? stagger : 0,
                ease: 'power2.out',
                force3D: true,
              });

              if (once) {
                observerRef.current?.unobserve(entry.target);
              }
            }
          });
        },
        { threshold }
      );

      observerRef.current.observe(containerEl);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        elements.forEach((el) => cleanup.killTweens(el));
      };
    },
    { dependencies: [selector, stagger, threshold, once], scope: container }
  );
};

/**
 * Performance monitoring hook
 */
export const useGSAPPerformance = () => {
  useEffect(() => {
    const logPerformance = () => {
      const count = performanceMonitor.getCount();
      if (count > 5) {
        console.warn(`High GSAP animation count: ${count}`);
      }
    };

    const interval = setInterval(logPerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    getAnimationCount: performanceMonitor.getCount,
    shouldAnimate: responsive.shouldAnimate,
    getDuration: responsive.getDuration,
  };
};

export default useOptimizedGSAP;
