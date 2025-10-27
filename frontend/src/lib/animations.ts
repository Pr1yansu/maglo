import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Animation presets for common use cases
export const animations = {
  // Fade in from bottom
  fadeInUp: (element: Element | string, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power3.out',
      }
    )
  },

  // Fade in from left
  fadeInLeft: (element: Element | string, delay = 0) => {
    return gsap.fromTo(
      element,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power3.out',
      }
    )
  },

  // Fade in from right
  fadeInRight: (element: Element | string, delay = 0) => {
    return gsap.fromTo(
      element,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power3.out',
      }
    )
  },

  // Scale in animation
  scaleIn: (element: Element | string, delay = 0) => {
    return gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay,
        ease: 'back.out(1.7)',
      }
    )
  },

  // Stagger animation for multiple elements
  staggerFadeInUp: (elements: Element[] | string, stagger = 0.1) => {
    return gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger,
        ease: 'power3.out',
      }
    )
  },

  // Hover animations
  buttonHover: (element: Element | string) => {
    const tl = gsap.timeline({ paused: true })
    tl.to(element, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
    return tl
  },

  // Page transition
  pageTransition: {
    enter: (element: Element | string) => {
      return gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    },
    exit: (element: Element | string) => {
      return gsap.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power3.in',
      })
    },
  },

  // Route transitions
  routeTransitions: {
    // Slide transitions
    slideLeft: {
      enter: (element: Element | string) => {
        return gsap.fromTo(
          element,
          { opacity: 0, xPercent: 100 },
          { opacity: 1, xPercent: 0, duration: 0.5, ease: 'power3.out' }
        )
      },
      exit: (element: Element | string) => {
        return gsap.to(element, {
          opacity: 0,
          xPercent: -100,
          duration: 0.3,
          ease: 'power3.in',
        })
      },
    },
    slideRight: {
      enter: (element: Element | string) => {
        return gsap.fromTo(
          element,
          { opacity: 0, xPercent: -100 },
          { opacity: 1, xPercent: 0, duration: 0.5, ease: 'power3.out' }
        )
      },
      exit: (element: Element | string) => {
        return gsap.to(element, {
          opacity: 0,
          xPercent: 100,
          duration: 0.3,
          ease: 'power3.in',
        })
      },
    },
    // Fade transitions
    fade: {
      enter: (element: Element | string) => {
        return gsap.fromTo(
          element,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
      },
      exit: (element: Element | string) => {
        return gsap.to(element, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
      },
    },
    // Scale transitions
    scale: {
      enter: (element: Element | string) => {
        return gsap.fromTo(
          element,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        )
      },
      exit: (element: Element | string) => {
        return gsap.to(element, {
          opacity: 0,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.in',
        })
      },
    },
  },
}

// Utility functions
export const animationUtils = {
  // Kill all animations on an element
  killAnimations: (element: Element | string) => {
    gsap.killTweensOf(element)
  },

  // Set initial state for animations
  setInitialState: (element: Element | string, props: gsap.TweenVars) => {
    gsap.set(element, props)
  },

  // Create a timeline
  createTimeline: (config?: gsap.TimelineVars) => {
    return gsap.timeline(config)
  },

  // Transition utilities
  transitionUtils: {
    // Hide scrollbars
    hideScrollbars: () => {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.classList.add('transitioning')
    },

    // Restore scrollbars
    showScrollbars: () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('transitioning')
    },

    // Cleanup function for interrupted transitions
    cleanup: (element: Element | string) => {
      gsap.killTweensOf(element)
      gsap.set(element, {
        opacity: 1,
        xPercent: 0,
        x: 0,
        scale: 1,
        clearProps: 'all',
      })
    },
  },

  // Scroll-triggered animations
  onScroll: (
    element: Element | string,
    animation: gsap.TweenVars,
    trigger?: string
  ) => {
    return gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      {
        ...animation,
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  },
}

export { gsap }
