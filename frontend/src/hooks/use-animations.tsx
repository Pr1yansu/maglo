import { useEffect, useRef } from "react";
import { animations } from "@/lib/animations";

// Hook for entrance animations
export const useEntranceAnimation = (delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      animations.fadeInUp(ref.current, delay);
    }
  }, [delay]);

  return ref;
};

// Hook for stagger animations
export const useStaggerAnimation = (stagger: number = 0.1) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter(
      (el): el is HTMLElement => el !== null
    );
    if (items.length > 0) {
      animations.staggerFadeInUp(items, stagger);
    }
  }, [stagger]);

  return { containerRef, itemsRef };
};

// Hook for scale in animation
export const useScaleAnimation = (delay: number = 0) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      animations.scaleIn(ref.current, delay);
    }
  }, [delay]);

  return ref;
};

// Hook for slide in from left
export const useSlideInLeft = (delay: number = 0) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      animations.fadeInLeft(ref.current, delay);
    }
  }, [delay]);

  return ref;
};

// Hook for slide in from right
export const useSlideInRight = (delay: number = 0) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      animations.fadeInRight(ref.current, delay);
    }
  }, [delay]);

  return ref;
};

// Hook for button hover animations
export const useButtonHover = () => {
  const ref = useRef<HTMLElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (ref.current) {
      animationRef.current = animations.buttonHover(ref.current);

      const element = ref.current;

      const handleMouseEnter = () => {
        animationRef.current?.play();
      };

      const handleMouseLeave = () => {
        animationRef.current?.reverse();
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        animationRef.current?.kill();
      };
    }
  }, []);

  return ref;
};
