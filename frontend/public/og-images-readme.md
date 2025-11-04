# Open Graph Images for Maglo

This document outlines the required images for optimal SEO and social media sharing.

## Required Images

### 1. Primary Open Graph Image

- **Filename**: `og-image.png`
- **Dimensions**: 1200x630 pixels
- **Format**: PNG or JPG
- **Purpose**: Default image for social media sharing
- **Content**: Maglo logo with financial dashboard preview

### 2. Twitter Card Image

- **Filename**: `twitter-card.png`
- **Dimensions**: 1200x675 pixels (16:9 aspect ratio)
- **Format**: PNG or JPG
- **Purpose**: Twitter social media cards
- **Content**: Similar to OG image with Twitter-optimized layout

### 3. Favicon Package

- **Filename**: `favicon.ico`
- **Dimensions**: 32x32, 16x16 pixels (multi-size ICO)
- **Format**: ICO
- **Purpose**: Browser tab icon

### 4. Apple Touch Icon

- **Filename**: `apple-touch-icon.png`
- **Dimensions**: 180x180 pixels
- **Format**: PNG
- **Purpose**: iOS home screen icon

### 5. App Icon (SVG)

- **Filename**: `icon.svg`
- **Format**: SVG
- **Purpose**: Modern browser icon, PWA icon
- **Content**: Maglo logo in vector format

### 6. PWA Icons (Future)

- **Filename**: `icon-192.png`, `icon-512.png`
- **Dimensions**: 192x192, 512x512 pixels
- **Format**: PNG
- **Purpose**: Progressive Web App installation

## Image Guidelines

### Content Requirements

- Include Maglo branding
- Use primary brand color (#9AE93A)
- Show financial dashboard elements (charts, cards, etc.)
- Keep text readable at small sizes
- Use high contrast for accessibility

### Technical Requirements

- Optimize for web (use appropriate compression)
- Include alt text in implementation
- Ensure images work in both light and dark themes
- Test on various social media platforms

### Brand Colors

- Primary: #9AE93A (Green)
- Background: #ffffff (Light), #111827 (Dark)
- Text: #374151 (Light), #f9fafb (Dark)

## Implementation

Images are referenced in:

1. `index.html` - Default meta tags
2. `SEO.tsx` - Dynamic meta tags
3. `manifest.json` - PWA configuration

## Tools for Creation

1. **Figma/Sketch** - Design tools
2. **Canva** - Template-based design
3. **ImageOptim** - Compression
4. **RealFaviconGenerator.net** - Favicon generation

## Testing

Test images on:

- Facebook Sharing Debugger
- Twitter Card Validator
- LinkedIn Post Inspector
- WhatsApp preview
- Discord embeds
