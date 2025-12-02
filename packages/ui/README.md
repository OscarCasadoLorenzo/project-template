# UI Package

## Overview

Shared UI component library used across the Project Template applications.

## Best Practices

### Component Design

1. **Component Architecture**
   - Make components atomic and reusable
   - Implement proper prop typing
   - Support composition patterns
   - Document usage examples

2. **Styling**
   - Use Tailwind CSS
   - Maintain consistent theming
   - Support dark/light modes
   - Follow design system tokens

3. **Accessibility**
   - Follow WCAG guidelines
   - Implement proper ARIA attributes
   - Support keyboard navigation
   - Test with screen readers

### Development Guidelines

1. **Component Creation**

   ```typescript
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     children: ReactNode;
   }

   export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
     return (
       <button className={cn(styles[variant], styles[size])}>
         {children}
       </button>
     );
   }
   ```

2. **Documentation**
   - Document all props
   - Provide usage examples
   - Include accessibility notes
   - Document variants/styles

### Testing

1. **Test Requirements**
   - Unit test all components
   - Test accessibility
   - Test responsive behavior
   - Test theme variations

## File Structure

```
src/
├── components/          # UI components
│   ├── atoms/         # Basic components
│   ├── molecules/    # Composite components
│   └── organisms/   # Complex components
├── styles/          # Global styles
└── utils/         # Helper functions
```

## Development Workflow

1. **Building**

   ```bash
   npm run build
   ```

2. **Testing**

   ```bash
   npm run test
   ```

3. **Storybook**
   ```bash
   npm run storybook
   ```

## Common Issues

1. **Build Issues**
   - Check TypeScript configuration
   - Verify dependency versions
   - Check import paths

2. **Style Issues**
   - Verify Tailwind configuration
   - Check CSS module imports
   - Verify theme tokens

## Dependencies

Check `package.json` for the complete list of dependencies and their versions.
