import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  blur?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  containerClassName?: string;
  showLoader?: boolean;
  loaderClassName?: string;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  auto: '',
};

const objectFitClasses = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder-image.jpg',
  lazy = true,
  quality = 'medium',
  aspectRatio = 'auto',
  objectFit = 'cover',
  blur = false,
  onLoad,
  onError,
  className,
  containerClassName,
  showLoader = true,
  loaderClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Generate optimized image URL based on quality
  const getOptimizedSrc = (originalSrc: string) => {
    // If using a CDN like Cloudinary or similar, you can add transformations here
    // For now, return the original src
    // In production, you might want to add query parameters for quality/size
    return originalSrc;
  };

  // Update current src when in view
  useEffect(() => {
    if (isInView && src) {
      setCurrentSrc(getOptimizedSrc(src));
    }
  }, [isInView, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    }
    if (onError) onError();
  };

  // Generate blur effect using CSS filter
  const blurStyle = blur ? { filter: 'blur(4px)' } : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Loader */}
      {showLoader && !isLoaded && isInView && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-muted animate-pulse',
            loaderClassName
          )}
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Low quality placeholder for blur effect */}
      {blur && !isLoaded && isInView && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse"
          style={{ filter: 'blur(20px)' }}
        />
      )}

      {/* Main image */}
      {isInView && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-all duration-300',
            objectFitClasses[objectFit],
            !isLoaded && 'opacity-0',
            isLoaded && 'opacity-100',
            blur && !isLoaded && 'scale-110',
            className
          )}
          style={{
            ...blurStyle,
            ...(!isLoaded ? { transform: 'scale(1.05)' } : {}),
          }}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-configured variants for common use cases
export const ProfileImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio' | 'objectFit'>> = (
  props
) => <OptimizedImage {...props} aspectRatio="square" objectFit="cover" />;

export const HeroImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio'>> = (props) => (
  <OptimizedImage {...props} aspectRatio="16/9" />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio' | 'lazy'>> = (
  props
) => <OptimizedImage {...props} aspectRatio="square" lazy={false} />;

export default OptimizedImage;
