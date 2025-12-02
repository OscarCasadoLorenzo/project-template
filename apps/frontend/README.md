# Frontend Architecture Guide

This guide explains the structure and best practices for organizing components, pages, and logic in our Next.js frontend application.

## Directory Structure

```
apps/frontend/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── [feature]/         # Feature-specific pages
│       ├── components/    # Page-specific components
│       ├── page.tsx       # Feature page
│       └── layout.tsx     # Feature layout
├── components/            # Shared components
├── hooks/                # Custom hooks for business logic
├── lib/                  # Utility functions and configurations
├── services/            # API service layer
└── types/               # TypeScript type definitions
```

## Components Structure

We follow a clear separation of concerns between components and business logic:

### 1. Component Types

#### Presentational Components (`components/`)

- Focus solely on UI rendering
- Receive data via props
- Don't contain business logic or data fetching
- Handle UI events and pass them to parent components
- Example:

```tsx
interface ButtonProps {
  onClick: () => void;
  label: string;
}

export function Button({ onClick, label }: ButtonProps) {
  return (
    <button onClick={onClick} className="...">
      {label}
    </button>
  );
}
```

#### Container Components (`app/[feature]/components/`)

- Use hooks to fetch and manage data
- Pass data to presentational components
- Handle business logic coordination
- Example:

```tsx
export function ItemListWithData() {
  const { data: items, isLoading } = useItems();

  if (isLoading) return <LoadingSpinner />;

  return <ItemList items={items} />;
}
```

### 2. Custom Hooks (`hooks/`)

All business logic should be extracted into custom hooks:

```tsx
export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: () => characterService.getCharacters(),
  });
}
```

Key characteristics:

- Handle data fetching
- Manage state
- Contain business logic
- Provide loading and error states
- Return data and functions to modify it

## Best Practices

### 1. Component Organization

```
components/
├── feature/                # Feature-specific components
│   ├── ComponentName.tsx   # Main component file
│   └── index.ts           # Export file
└── shared/                # Shared/common components
```

### 2. Hook Organization

```
hooks/
├── useFeatureName.ts      # Feature-specific hooks
└── useSharedLogic.ts      # Shared business logic
```

### 3. Code Structure Pattern

1. **Data Layer** (`services/`)
   - API calls
   - Data transformations
   - HTTP client configuration

2. **Logic Layer** (`hooks/`)
   - Business logic
   - State management
   - Data fetching via services

3. **UI Layer** (`components/`)
   - Components
   - Styling
   - Event handling

## Examples

### Bad Practice ❌

```tsx
// Component mixing data fetching and UI
function BadCharacterList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("/api/characters").then(/*...*/);
  }, []);

  return <div>{/* rendering */}</div>;
}
```

### Good Practice ✅

```tsx
// Hook (hooks/useCharacters.ts)
export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: () => characterService.getCharacters(),
  });
}

// Container (app/characters/components/CharacterListWithData.tsx)
export function CharacterListWithData() {
  const { data, isLoading } = useCharacters();
  return <CharacterList characters={data} isLoading={isLoading} />;
}

// Presentational (components/CharacterList.tsx)
export function CharacterList({ characters, isLoading }: Props) {
  if (isLoading) return <LoadingSpinner />;
  return <div>{/* pure rendering */}</div>;
}
```

## File Naming Conventions

1. Components:
   - PascalCase for component files: `CharacterList.tsx`
   - Suffix data-fetching containers with "WithData": `CharacterListWithData.tsx`

2. Hooks:
   - camelCase with 'use' prefix: `useCharacters.ts`
   - Feature-specific hooks match feature name: `useCharacterHealth.ts`

3. Services:
   - camelCase with 'Service' suffix: `characterService.ts`

## Testing Structure

```
__tests__/
├── components/            # Component tests
├── hooks/                # Hook tests
└── services/            # Service tests
```

## When to Create New Files

1. Create a new hook when:
   - Sharing logic between components
   - Managing complex state
   - Handling data fetching
   - Implementing business logic

2. Create a new component when:
   - UI pattern is reused
   - Complex UI section needs isolation
   - Breaking down large components

3. Create a new service when:
   - Adding new API endpoints
   - Implementing new data operations
   - Adding third-party integrations

## State Management

1. Local State:
   - Use `useState` for component-specific state
   - Use custom hooks for shared state

2. Server State:
   - Use `react-query` through custom hooks
   - Centralize query keys and cache management

## Performance Considerations

1. Components:
   - Memoize when needed with `useMemo` and `useCallback`
   - Split large components into smaller ones

2. Data Fetching:
   - Use proper caching strategies in hooks
   - Implement optimistic updates where appropriate

Remember: Always prioritize code organization and maintainability while keeping the components focused on their specific responsibilities.
