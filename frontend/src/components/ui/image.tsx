import { cn } from "@/lib/utils";
import React, { forwardRef, useEffect, useRef, useState } from "react";

type Loader = (opts: { src: string; width: number; format?: string }) => string;

export type ImageLayout = "intrinsic" | "responsive" | "fill";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number; // intrinsic width
  height?: number; // intrinsic height
  sizes?: string; // e.g. "(max-width: 768px) 100vw, 50vw"
  quality?: number; // passed to loader if supported
  formats?: string[]; // preferred formats in order (["avif","webp","jpg"])
  breakpoints?: number[]; // widths to generate srcset from (defaults below)
  placeholder?: string; // base64 blur or color (e.g. "data:image/..."), or CSS color
  priority?: boolean; // if true, preload link will be injected (for critical images)
  layout?: ImageLayout;
  loader?: Loader; // function that builds URLs for CDN/transform
  useNativeLazyLoad?: boolean; // if true, rely solely on loading="lazy"
}

const DEFAULT_BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1600];

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      sizes,
      quality = 75,
      formats = ["avif", "webp", "jpg"],
      breakpoints = DEFAULT_BREAKPOINTS,
      placeholder,
      priority = false,
      layout = "intrinsic",
      loader,
      useNativeLazyLoad = false,
      className,
      style,
      ...imgProps
    },
    ref,
  ) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const finalRef = (ref as any) || imgRef;
    const [isVisible, setIsVisible] = useState(useNativeLazyLoad || priority);
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
    const [srcSet, setSrcSet] = useState<string | undefined>(undefined);
    const [placeholderStyle, setPlaceholderStyle] = useState<
      React.CSSProperties | undefined
    >(undefined);

    const buildUrl = (format: string, w: number) => {
      if (loader) return loader({ src, width: w, format });
      // default naive loader: append query params (override in prod)
      const url = new URL(
        src,
        typeof window !== "undefined"
          ? window.location.href
          : "http://localhost",
      );
      url.searchParams.set("w", String(w));
      url.searchParams.set("q", String(quality));
      url.searchParams.set("fmt", format);
      return url.toString();
    };

    // Build srcset for the first available format (we'll use browser picture for format negotiation)
    useEffect(() => {
      if (!isVisible) return;

      const primaryFormat = formats[0];
      const srcsetStr = breakpoints
        .filter((w) => !width || w <= width * 2) // avoid huge >2x intrinsic unless desired
        .map((w) => `${buildUrl(primaryFormat, w)} ${w}w`)
        .join(", ");

      setSrcSet(srcsetStr || undefined);

      // set current src to a reasonably sized image (closest breakpoint or width)
      const pick = breakpoints.reduce(
        (acc, b) =>
          Math.abs(b - (width || 768)) < Math.abs(acc - (width || 768))
            ? b
            : acc,
        breakpoints[0],
      );
      setCurrentSrc(buildUrl(primaryFormat, pick));
    }, [isVisible, src, width, quality, formats, breakpoints, loader]);

    // Placeholder handling
    useEffect(() => {
      if (!placeholder) return;
      if (placeholder.startsWith("data:")) {
        setPlaceholderStyle({
          backgroundImage: `url("${placeholder}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          transform: "scale(1.02)",
        });
      } else {
        setPlaceholderStyle({ backgroundColor: placeholder });
      }
    }, [placeholder]);

    // Intersection Observer lazy-load (if not using native)
    useEffect(() => {
      if (isVisible || useNativeLazyLoad || priority) return;
      const node = (finalRef as React.MutableRefObject<HTMLImageElement | null>)
        .current;
      if (!node && typeof IntersectionObserver === "undefined") {
        setIsVisible(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: "200px" },
      );
      if (node) observer.observe(node);
      return () => observer.disconnect();
    }, [finalRef, useNativeLazyLoad, isVisible, priority]);

    // Preload for priority images
    useEffect(() => {
      if (!priority || typeof document === "undefined" || !currentSrc) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = currentSrc;
      document.head.appendChild(link);

      // ✅ cleanup should not return anything
      return () => {
        document.head.removeChild(link);
      };
    }, [priority, currentSrc]);

    // Small helper to compute aspect ratio padding when layout == "responsive" or intrinsic
    const wrapperStyle: React.CSSProperties = {};
    if (layout === "responsive" && width && height) {
      wrapperStyle.position = "relative";
      wrapperStyle.paddingBottom = `${(height / width) * 100}%`;
      wrapperStyle.width = "100%";
      wrapperStyle.overflow = "hidden";
    } else if (layout === "intrinsic" && width && height) {
      wrapperStyle.width = width;
      wrapperStyle.height = height;
      wrapperStyle.overflow = "hidden";
    } else if (layout === "fill") {
      wrapperStyle.position = "absolute";
      wrapperStyle.inset = "0";
    }

    const imgStyle: React.CSSProperties = {
      width:
        layout === "fill" || layout === "responsive"
          ? "100%"
          : width
            ? `${width}px`
            : undefined,
      height:
        layout === "fill" || layout === "responsive"
          ? "100%"
          : height
            ? `${height}px`
            : undefined,
      objectFit: "cover",
      display: "block",
      ...style,
    };

    // Render <picture> to offer multiple formats (browser picks the best supported)
    const picture = (
      <picture>
        {formats.map((fmt) => (
          <source
            key={fmt}
            type={
              fmt === "jpg" || fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`
            }
            srcSet={
              isVisible
                ? breakpoints.map((w) => `${buildUrl(fmt, w)} ${w}w`).join(", ")
                : undefined
            }
            sizes={sizes}
          />
        ))}
        <img
          {...imgProps}
          ref={finalRef}
          src={isVisible ? currentSrc : undefined}
          srcSet={isVisible ? srcSet : undefined}
          sizes={sizes}
          alt={alt}
          loading={
            useNativeLazyLoad
              ? imgProps.loading || "lazy"
              : imgProps.loading || (priority ? "eager" : "lazy")
          }
          style={imgStyle}
          className={className}
          width={width}
          height={height}
        />
      </picture>
    );

    // If using responsive wrapper, overlay placeholder or show picture directly
    return layout === "responsive" ||
      layout === "intrinsic" ||
      layout === "fill" ? (
      <div
        className={cn("relative", layout === "fill" && "w-full h-full")}
        style={wrapperStyle}
        aria-hidden="false"
      >
        {placeholder && !isVisible && (
          <div
            className="absolute inset-0 transition-opacity w-full h-full"
            style={placeholderStyle}
          />
        )}

        <div
          className={cn(
            "absolute inset-0 transition-opacity",
            placeholder && !isVisible ? "opacity-0" : "opacity-100",
          )}
        >
          {picture}
        </div>
      </div>
    ) : (
      // simple inline image
      <>
        {placeholder && !isVisible ? (
          <span
            className="inline-block"
            style={{
              ...placeholderStyle,
              width: width || undefined,
              height: height || undefined,
            }}
          />
        ) : null}
        {picture}
      </>
    );
  },
);

Image.displayName = "Image";

export default Image;
