# GSAP & Optimized Components Guide

## Overview

This guide covers the newly added GSAP animations, optimized image components, and transition links for the Maglo project.

## 🎭 GSAP Integration

### Packages Installed
- `gsap`: Main GSAP animation library
- `@gsap/react`: React-specific GSAP hooks and utilities

### Usage
```tsx
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

const MyComponent = () => {
  useGSAP(() => {
    gsap.to('.my-element', {
      duration: 2,
      x: 100,
      rotation: 360
    });
  });
  
  return <div className="my-element">Animated content</div>;
};
```

## 🖼️ Optimized Image Component

### Features
- **Lazy Loading**: Uses Intersection Observer for performance
- **Progressive Loading**: Blur-to-clear effect while loading
- **Error Handling**: Automatic fallback to placeholder
- **Aspect Ratios**: Predefined ratios (square, 16/9, 4/3, 3/2)
- **Object Fit**: Control how images fit their containers
- **Loading States**: Built-in spinner and animations

### Components Available

#### `OptimizedImage`
The main component with full configuration options:

```tsx
import { OptimizedImage } from '@/components/ui';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  aspectRatio="16/9"
  objectFit="cover"
  lazy={true}
  blur={true}
  quality="high"
  showLoader={true}
  onLoad={() => console.log('Loaded!')}
  onError={() => console.log('Failed to load')}
  className="rounded-lg"
/>
```

#### Specialized Variants

**`ProfileImage`**: Pre-configured for user avatars
```tsx
<ProfileImage
  src="/avatar.jpg"
  alt="User Avatar"
  className="w-20 h-20 rounded-full"
/>
```

**`HeroImage`**: Optimized for hero sections
```tsx
<HeroImage
  src="/hero.jpg"
  alt="Hero Image"
  blur={true}
  className="rounded-lg"
/>
```

**`ThumbnailImage`**: Fast-loading thumbnails
```tsx
<ThumbnailImage
  src="/thumb.jpg"
  alt="Thumbnail"
  className="hover:scale-105 transition-transform"
/>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL (required) |
| `alt` | `string` | - | Alt text (required) |
| `fallbackSrc` | `string` | `/placeholder-image.jpg` | Fallback image URL |
| `lazy` | `boolean` | `true` | Enable lazy loading |
| `quality` | `'low' \| 'medium' \| 'high'` | `'medium'` | Image quality preference |
| `aspectRatio` | `'square' \| '16/9' \| '4/3' \| '3/2' \| 'auto'` | `'auto'` | Aspect ratio constraint |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | How image fits container |
| `blur` | `boolean` | `false` | Progressive blur-to-clear loading |
| `showLoader` | `boolean` | `true` | Show loading spinner |
| `onLoad` | `() => void` | - | Callback when image loads |
| `onError` | `() => void` | - | Callback when image fails |

## 🔗 Transition Links

### Features
- **Smooth Transitions**: GSAP-powered page transitions
- **Multiple Types**: Fade, slide, scale, or custom
- **React Router Integration**: Drop-in replacement for `Link`
- **Hover Effects**: Subtle scale animations on hover
- **Programmatic Navigation**: Hook for manual transitions

### Components Available

#### `TransitionLink`
The main transition link component:

```tsx
import { TransitionLink } from '@/components/ui';

<TransitionLink
  to="/dashboard"
  transitionType="fade"
  transitionDuration={0.4}
  className="text-primary hover:underline"
>
  Go to Dashboard
</TransitionLink>
```

#### Specialized Variants

**`FadeLink`**: Fade transition
```tsx
<FadeLink to="/about">About Us</FadeLink>
```

**`SlideLink`**: Slide transition
```tsx
<SlideLink to="/contact">Contact</SlideLink>
```

**`ScaleLink`**: Scale transition
```tsx
<ScaleLink to="/gallery">View Gallery</ScaleLink>
```

### Programmatic Navigation

Use the `usePageTransition` hook for programmatic navigation:

```tsx
import { usePageTransition } from '@/components/ui';

const MyComponent = () => {
  const { transitionTo } = usePageTransition();

  const handleNavigation = async () => {
    await transitionTo('/dashboard', {
      transitionType: 'fade',
      transitionDuration: 0.5,
      replace: true
    });
  };

  return <button onClick={handleNavigation}>Go to Dashboard</button>;
};
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `To` | - | Navigation target (required) |
| `transitionType` | `'fade' \| 'slide' \| 'scale' \| 'none'` | `'fade'` | Transition animation type |
| `transitionDuration` | `number` | `0.3` | Animation duration in seconds |
| `disabled` | `boolean` | `false` | Disable the link |
| All React Router `Link` props | - | - | Supports all standard Link props |

## 📱 Page Transitions

### Page Transition Wrapper
The layout automatically wraps pages with transition effects:

```tsx
// Automatically applied in Layout.tsx
<PageTransitionWrapper>
  <main>{children}</main>
</PageTransitionWrapper>
```

### Transition Types

1. **Fade**: Opacity transition
2. **Slide**: Horizontal slide effect  
3. **Scale**: Scale and opacity combination
4. **None**: No animation (instant)

## 🎯 Routing Strategy

### Why React Router DOM?
- Already installed and configured
- Mature and stable (v6+)
- Excellent TypeScript support
- Great ecosystem and documentation
- Perfect integration with GSAP animations

### Router Setup
```tsx
// main.tsx
<BrowserRouter>
  <App />
</BrowserRouter>

// app.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/gallery" element={<GalleryPage />} />
  {/* More routes... */}
</Routes>
```

## 🚀 Performance Optimizations

### Image Performance
1. **Lazy Loading**: Images load only when needed
2. **Intersection Observer**: Efficient viewport detection
3. **Progressive Loading**: Smooth blur-to-clear effects
4. **Error Boundaries**: Graceful fallback handling
5. **Aspect Ratio**: Prevents layout shift

### Animation Performance  
1. **GSAP**: Hardware-accelerated animations
2. **Transform-based**: Uses CSS transforms for smooth 60fps
3. **Minimal Reflows**: Optimized for performance
4. **Cleanup**: Proper event listener removal

### Bundle Impact
- GSAP: ~45KB gzipped (industry standard)
- @gsap/react: ~3KB gzipped  
- Total addition: ~48KB for professional animations

## 📖 Usage Examples

### Gallery Page
Check out `/gallery` for a comprehensive demo of all features:
- Hero images with blur loading
- Profile image variants
- Thumbnail grids
- Different transition types
- Performance showcases

### Component Showcase
Visit `/components` to see all UI components including:
- Image component variations
- Transition link examples
- Interactive demos
- Code examples

## 🔧 Configuration

### Tailwind Integration
The components use Tailwind classes and CSS variables defined in your theme:

```css
/* Already configured in index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  /* ... more variables */
}
```

### GSAP Registration
GSAP is automatically registered with React:

```tsx
// Automatic registration via @gsap/react
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

// Ready to use in any component!
```

## 🎨 Customization

### Custom Transition Types
Extend the TransitionLink with custom animations:

```tsx
const customTransition = (element: Element): Promise<void> => {
  return new Promise((resolve) => {
    gsap.to(element, {
      rotationY: 180,
      duration: 0.5,
      onComplete: resolve
    });
  });
};
```

### Image CDN Integration
Modify the `getOptimizedSrc` function in `image.tsx` for CDN support:

```tsx
const getOptimizedSrc = (originalSrc: string) => {
  // Example: Cloudinary transformations
  return originalSrc.replace(
    'upload/',
    'upload/c_fill,w_800,q_auto,f_auto/'
  );
};
```

## 🔍 Best Practices

### Image Usage
1. Always provide meaningful `alt` text
2. Use appropriate `aspectRatio` for consistent layouts
3. Enable `blur` for better perceived performance
4. Set `lazy={false}` for above-the-fold images
5. Provide fallback images for better UX

### Transition Usage  
1. Use consistent transition types per section
2. Keep durations between 0.2-0.5 seconds
3. Avoid transitions on slow devices (use `prefers-reduced-motion`)
4. Test transitions with slow network connections

### Performance
1. Lazy load images below the fold
2. Use WebP/AVIF formats when possible
3. Implement proper image sizing
4. Monitor Core Web Vitals impact
5. Consider using `loading="eager"` for critical images

## 🆘 Troubleshooting

### Common Issues

**Images not loading**:
- Check image URLs and CORS settings
- Verify fallback image exists
- Check network connectivity

**Transitions not working**:
- Ensure GSAP is properly installed
- Check for JavaScript errors
- Verify page container exists with `data-page-container`

**Performance issues**:
- Reduce image sizes
- Limit concurrent animations  
- Use `will-change` CSS property sparingly
- Monitor memory usage with dev tools

### Debug Mode
Enable GSAP dev tools in development:

```tsx
// Add to main.tsx for debugging
if (process.env.NODE_ENV === 'development') {
  gsap.registerPlugin(); // Add debug plugins here
}
```

## 📚 Additional Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [React Router Documentation](https://reactrouter.com/)
- [Web Performance Best Practices](https://web.dev/fast/)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)

Happy coding! 🚀