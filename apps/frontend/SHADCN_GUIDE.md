# shadcn/ui Integration Guide

This document explains how shadcn/ui has been integrated into the Maglo frontend application.

## 🚀 What's Included

### Installed Components
- **Button** - Various button styles and sizes
- **Card** - Container components with headers and content
- **Input** - Form input fields
- **Label** - Form labels
- **Alert** - Notification and alert messages
- **Badge** - Status indicators and tags
- **Avatar** - User profile pictures and fallbacks
- **Table** - Data tables with proper styling

### Configuration Files
- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Updated with shadcn/ui theme variables
- `src/index.css` - CSS variables for light and dark themes
- `src/lib/utils.ts` - Utility function for className merging

## 📁 File Structure

```
src/
├── components/
│   └── ui/
│       ├── index.ts          # Barrel exports for all components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       └── table.tsx
└── lib/
    └── utils.ts             # cn() utility function
```

## 🎨 Usage Examples

### Button Component
```tsx
import { Button } from '../components/ui/button';

<Button variant="default">Default Button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🏠</Button>
```

### Card Component
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Form Components
```tsx
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### Alert Component
```tsx
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

<Alert>
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>
    This is an informational message.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong!
  </AlertDescription>
</Alert>
```

## 🎯 Importing Components

### Individual Imports
```tsx
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
```

### Barrel Imports (Recommended)
```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
```

## 🎨 Theming

The project supports both light and dark themes through CSS variables:

### Light Theme Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}
```

### Dark Theme Variables
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more variables */
}
```

## 🔧 Adding New Components

To add new shadcn/ui components:

```bash
cd apps/frontend
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add form
```

## 📦 Dependencies

The following packages are required for shadcn/ui:

- `@radix-ui/react-*` - Primitive components
- `class-variance-authority` - Component variants
- `clsx` - Conditional className utility
- `lucide-react` - Icons
- `tailwind-merge` - Tailwind class merging
- `tailwindcss-animate` - Animation utilities

## 🔗 Useful Links

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com)
- [Components Showcase](/components) - View all available components

## 📱 Responsive Design

All shadcn/ui components are mobile-first and fully responsive. Use Tailwind's responsive prefixes:

```tsx
<Card className="w-full md:w-1/2 lg:w-1/3">
  <CardContent className="p-4 md:p-6">
    Content that adapts to screen size
  </CardContent>
</Card>
```

## ♿ Accessibility

shadcn/ui components are built on Radix UI primitives, ensuring:
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management
- Color contrast compliance