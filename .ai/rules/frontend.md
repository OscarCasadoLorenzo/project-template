## UI Component Development

### Use shadcn/ui Primitives

**When creating or modifying Next.js components, pages, views, or layouts, ALWAYS prefer using the shadcn-based UI primitives from the `@repo/ui` package instead of generic HTML tags.**

**Benefits:**

- **Maintainability** - Consistent component API across the application
- **Styling** - Pre-configured with project theme and Tailwind CSS
- **Accessibility** - Built-in ARIA attributes and keyboard navigation
- **Type Safety** - Full TypeScript support with proper types
- **Responsiveness** - Mobile-first design patterns included

**Primitive Catalog:**

Refer to [`packages/ui/src/primitives/README.md`](../../../packages/ui/src/primitives/README.md) for the complete catalog of available primitives organized by category:

- **Layout & Structure** - Accordion, Card, Sidebar, Tabs, Separator, etc.
- **Navigation** - Breadcrumb, Navigation Menu, Menubar, Pagination
- **Forms & Input** - Button, Input, Select, Checkbox, Form, Label, Textarea, etc.
- **Feedback & Overlays** - Dialog, Alert, Drawer, Sheet, Tooltip, Popover
- **Display & Data** - Avatar, Badge, Table, Progress, Skeleton
- **Interactive** - Carousel, Command, Context Menu, Dropdown Menu

### Component Usage Examples

**❌ Don't use generic HTML:**

```tsx
function UserCard({ user }) {
  return (
    <div className="border rounded p-4">
      <div className="flex items-center gap-2">
        <img src={user.avatar} className="w-8 h-8 rounded-full" />
        <h3 className="font-bold">{user.name}</h3>
      </div>
      <p className="text-gray-500">{user.bio}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Follow
      </button>
    </div>
  );
}
```

**✅ Do use shadcn primitives:**

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@repo/ui/card";
import { Button } from "@repo/ui/button";

function UserCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">{user.name}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{user.bio}</p>
      </CardContent>
      <CardFooter>
        <Button>Follow</Button>
      </CardFooter>
    </Card>
  );
}
```

### Import Patterns

Import primitives from the centralized UI package:

```tsx
// ✅ Correct
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardHeader, CardContent } from "@repo/ui/card";

// ❌ Incorrect - don't import from nested paths
import { Button } from "@repo/ui/src/primitives/button";
```

### When to Use HTML Tags

Only use native HTML tags when:

- No suitable primitive exists (check the catalog first!)
- Creating semantic wrappers (`<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Working with specific semantic elements (`<time>`, `<address>`, etc.)

---

## TypeScript Conventions

### General Rules

- **Strict mode enabled** - All TypeScript projects must use strict mode
- **Explicit types** - Prefer explicit return types for functions
- **No `any`** - Avoid `any` type; use `unknown` or proper types
- **Interface over type** - Prefer `interface` for object shapes, `type` for unions/intersections

```tsx
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return fetchApi<User>(`/users/${id}`);
}

// ❌ Bad
function getUser(id: any) {
  return fetchApi(`/users/${id}`);
}
```

---

## React/Next.js Conventions

### Component Structure

- **Use functional components** with hooks
- **Named exports** for components
- **Props interface** defined above component

```tsx
interface UserProfileProps {
  userId: string;
  showActions?: boolean;
}

export function UserProfile({ userId, showActions = true }: UserProfileProps) {
  // Component logic
}
```

### File Naming

- **Components** - PascalCase: `UserProfile.tsx`, `ItemList.tsx`
- **Utilities/Hooks** - camelCase: `useItems.ts`, `formatDate.ts`
- **Pages (Next.js App Router)** - lowercase: `page.tsx`, `layout.tsx`, `loading.tsx`

### Hooks

- **Custom hooks** start with `use`: `useAuth`, `useItems`
- **Extract complex logic** into custom hooks for reusability
- **Organize hooks** in `hooks/` directory

---

## NestJS Backend Conventions

### Module Organization

- **Feature-based modules** - Each domain has its own module
- **DTOs for validation** - Use class-validator decorators
- **Service layer** - Business logic in services, not controllers

```typescript
// ✅ Good structure
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createDto: CreateItemDto) {
    return this.itemsService.create(createDto);
  }
}
```

### Naming Conventions

- **Controllers** - `*.controller.ts`
- **Services** - `*.service.ts`
- **DTOs** - `*.dto.ts` in `dto/` subdirectory
- **Modules** - `*.module.ts`

---

## Formatting

### Prettier Configuration

Follow the project's Prettier configuration:

- **Indent** - 2 spaces
- **Quotes** - Single quotes
- **Semicolons** - Required
- **Trailing commas** - ES5 style
- **Line width** - 100 characters

### Code Organization

```tsx
// 1. External imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. Internal imports (absolute paths)
import { Button } from "@repo/ui/button";
import { useItems } from "@/hooks/useItems";

// 3. Types/Interfaces
interface Props {
  id: string;
}

// 4. Component
export function Component({ id }: Props) {
  // ...
}
```

---

## CSS & Styling

### Tailwind CSS

- **Use Tailwind utility classes** for styling
- **Design tokens** - Use CSS variables from theme: `bg-background`, `text-foreground`, `border-input`
- **Responsive modifiers** - Mobile-first: `md:`, `lg:`, `xl:`
- **Dark mode** - Use `dark:` modifier for dark theme variants

```tsx
// ✅ Good - Uses theme variables
<div className="bg-background text-foreground border border-input rounded-lg p-4" />

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black border-gray-300 rounded-lg p-4" />
```

### Custom Styles

- **Avoid inline styles** unless dynamic
- **Use `cn()` utility** from `@repo/ui/lib/utils` to merge classes

```tsx
import { cn } from "@repo/ui/lib/utils";

<Button className={cn("w-full", isLoading && "opacity-50")} />;
```
