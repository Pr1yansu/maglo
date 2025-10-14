import React, { useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageTransition } from '../hooks/use-optimized-gsap';

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

  // Use optimized page transition hook
  usePageTransition(containerRef, {
    type: 'slide',
    duration: 0.4,
    trigger: location.pathname,
  });

  return (
    <div ref={containerRef} data-page-container className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
