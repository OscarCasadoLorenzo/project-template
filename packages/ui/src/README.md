# UI Components (shadcn/ui)

This directory contains the shadcn/ui component library setup for the Project Template renderer.

## Setup Complete ✅

The following has been configured:

### Dependencies Installed

- `@radix-ui/react-label` - For accessible label components
- `@radix-ui/react-slot` - For composition patterns
- `class-variance-authority` - For component variants
- `clsx` - For conditional classNames
- `tailwind-merge` - For merging Tailwind classes

### Configuration

- **Tailwind Config**: Updated with shadcn/ui colors and CSS variables
- **CSS Variables**: Added to `src/index.css` for light/dark theme support
- **TypeScript Paths**: Added `@/ui/*` alias for easy imports
- **Components.json**: Added shadcn/ui configuration file

### Available Components

#### Core Components

- **Button** - `@/ui/button` - Versatile button with multiple variants
- **Card** - `@/ui/card` - Container with header, content, and footer
- **Input** - `@/ui/input` - Form input field
- **Label** - `@/ui/label` - Accessible form labels
- **Textarea** - `@/ui/textarea` - Multi-line text input
- **Badge** - `@/ui/badge` - Status and category indicators

#### Utility

- **cn** - `@/ui/utils` - Class name merging utility

## Usage Examples

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' placeholder='Enter your name' />
        </div>
        <Button className='mt-4'>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Path Aliases

You can import components using the configured path aliases:

```tsx
// All components from the barrel export
import { Button, Card, Input } from '@/ui';

// Individual components
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';

// Utility function
import { cn } from '@/ui/utils';
```

## Adding New Components

To add new shadcn/ui components:

1. Install any required Radix UI dependencies
2. Create the component file in `src/ui/`
3. Export it from `src/ui/index.ts`
4. Update this README with usage examples

## Theme Support

The setup includes CSS variables for both light and dark themes. Toggle dark mode by adding the `dark` class to your HTML element.

## Example Component

See `src/components/UIExample.tsx` for a comprehensive example of all available components.
