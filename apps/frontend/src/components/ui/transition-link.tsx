import React, { useRef, MouseEvent, ReactNode } from 'react';
import { Link, To, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useOptimizedGSAP, useHoverAnimation } from '../../hooks/use-optimized-gsap';
import { animations, responsive } from '../../lib/gsap-optimized';

interface TransitionLinkProps {
  to: To;
  children: ReactNode;
  className?: string;
  transitionDuration?: number;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  replace?: boolean;
  state?: any;
  preventScrollReset?: boolean;
  relative?: 'route' | 'path';
  reloadDocument?: boolean;
  disabled?: boolean;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  children,
  className,
  transitionDuration = 0.3,
  transitionType = 'fade',
  onClick,
  replace,
  state,
  preventScrollReset,
  relative,
  reloadDocument,
  disabled = false,
  ...props
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();

  // Optimized hover animations
  useHoverAnimation(linkRef, {
    scale: 1.02,
    duration: 0.2,
    disabled,
  });

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    // Call custom onClick handler if provided
    if (onClick) {
      onClick(event);
    }

    // If default prevented or reloadDocument, let browser handle
    if (event.defaultPrevented || reloadDocument) {
      return;
    }

    // Prevent default navigation
    event.preventDefault();

    // Perform transition animation before navigation
    await performTransition();

    // Navigate after transition
    navigate(to, {
      replace,
      state,
      preventScrollReset,
      relative,
    });
  };

  const performTransition = (): Promise<void> => {
    return new Promise((resolve) => {
      if (transitionType === 'none' || !responsive.shouldAnimate()) {
        resolve();
        return;
      }

      // Get the page container or body for transition
      const pageContainer = document.querySelector('[data-page-container]') || document.body;
      const duration = responsive.getDuration(transitionDuration);

      switch (transitionType) {
        case 'fade':
          animations.fade(pageContainer, {
            duration,
            onComplete: resolve,
          });
          break;

        case 'slide':
          animations.slide(pageContainer, {
            duration,
            onComplete: resolve,
          });
          break;

        case 'scale':
          animations.scale(pageContainer, {
            duration,
            onComplete: resolve,
          });
          break;

        default:
          resolve();
      }
    });
  };

  if (disabled) {
    return <span className={cn('cursor-not-allowed opacity-50', className)}>{children}</span>;
  }

  return (
    <Link
      ref={linkRef}
      to={to}
      onClick={handleClick}
      replace={replace}
      state={state}
      preventScrollReset={preventScrollReset}
      relative={relative}
      reloadDocument={reloadDocument}
      className={cn('transition-all duration-200 hover:opacity-90', className)}
      {...props}
    >
      {children}
    </Link>
  );
};

// Specialized transition link variants
export const FadeLink: React.FC<Omit<TransitionLinkProps, 'transitionType'>> = (props) => (
  <TransitionLink {...props} transitionType="fade" />
);

export const SlideLink: React.FC<Omit<TransitionLinkProps, 'transitionType'>> = (props) => (
  <TransitionLink {...props} transitionType="slide" />
);

export const ScaleLink: React.FC<Omit<TransitionLinkProps, 'transitionType'>> = (props) => (
  <TransitionLink {...props} transitionType="scale" />
);

// Hook for programmatic transitions
export const usePageTransition = () => {
  const navigate = useNavigate();

  const transitionTo = async (
    to: To,
    options?: {
      transitionType?: 'fade' | 'slide' | 'scale' | 'none';
      transitionDuration?: number;
      replace?: boolean;
      state?: any;
    }
  ) => {
    const { transitionType = 'fade', transitionDuration = 0.3, replace, state } = options || {};

    if (transitionType !== 'none' && responsive.shouldAnimate()) {
      const pageContainer = document.querySelector('[data-page-container]') || document.body;
      const duration = responsive.getDuration(transitionDuration);

      await new Promise<void>((resolve) => {
        switch (transitionType) {
          case 'fade':
            animations.fade(pageContainer, {
              duration,
              onComplete: resolve,
            });
            break;

          case 'slide':
            animations.slide(pageContainer, {
              duration,
              onComplete: resolve,
            });
            break;

          case 'scale':
            animations.scale(pageContainer, {
              duration,
              onComplete: resolve,
            });
            break;

          default:
            resolve();
        }
      });
    }

    navigate(to, { replace, state });
  };

  return { transitionTo };
};

export default TransitionLink;
