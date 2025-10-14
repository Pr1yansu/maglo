import React, { useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

interface PageTransitionWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize the container
    gsap.set(container, {
      opacity: 1,
      x: 0,
      scale: 1,
    });

    // Animate in on route change
    if (prevLocationRef.current !== location.pathname) {
      // Entry animation
      gsap.fromTo(
        container,
        {
          opacity: 0,
          x: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        }
      );
    }

    prevLocationRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div ref={containerRef} data-page-container className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
