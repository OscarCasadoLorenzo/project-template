# Frontend Pagination Support

## Overview

The frontend has been updated to support the new paginated API responses while maintaining backward compatibility with existing code.

## Changes Made

### 1. Type Definitions (`types/index.ts`)

Added new types to support pagination:

```typescript
export interface PaginationMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type MaybePaginated<T> = T[] | PaginatedResponse<T>;
```

Updated `Character` type:

- Changed `playerId` → `userId` to match backend
- Added optional fields: `user`, `auraGifts`, `effects`, `inventories`, `narrative`

### 2. Pagination Utilities (`lib/pagination.ts`)

Created helper functions to work with paginated responses:

```typescript
// Check if a response is paginated
isPaginatedResponse<T>(response): boolean

// Extract data array from response (paginated or not)
extractData<T>(response): T[]

// Get pagination metadata if available
getPaginationMeta<T>(response): PaginationMeta | null
```

### 3. Updated Hooks (`hooks/useCharacters.ts`)

**Automatic Data Extraction**

The `useCharacters` hook now automatically extracts the data array from paginated responses:

```typescript
// Before (manual handling needed)
const { data } = useCharacters();
// data could be: Character[] | { data: Character[], meta: {...} }

// After (automatic extraction)
const { data } = useCharacters();
// data is always: Character[] | undefined
```

**Support for Pagination Parameters**

```typescript
const { data } = useCharacters({
  limit: 10, // Items per page
  offset: 0, // Skip N items
  sort: "-level", // Sort descending by level
  search: "warrior", // Search filter
});
```

## Usage Examples

### Basic Usage (No Changes Required)

Existing code continues to work without modifications:

```tsx
function CharacterList() {
  const { data, isLoading } = useCharacters();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map((char) => (
        <div key={char.id}>{char.characterName}</div>
      ))}
    </div>
  );
}
```

### With Pagination

```tsx
function PaginatedCharacterList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useCharacters({
    limit,
    offset: (page - 1) * limit,
    sort: "-createdAt",
  });

  return (
    <div>
      {data?.map((char) => (
        <CharacterCard key={char.id} character={char} />
      ))}

      <Pagination currentPage={page} onPageChange={setPage} />
    </div>
  );
}
```

### With Search

```tsx
function SearchableCharacterList() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useCharacters({
    search,
    sort: "characterName",
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search characters..."
      />
      {data?.map((char) => (
        <CharacterCard key={char.id} character={char} />
      ))}
    </div>
  );
}
```

### Accessing Pagination Metadata (Advanced)

If you need access to pagination metadata, use the helper functions:

```typescript
import { useApiQuery } from "@/hooks/use-api-query";
import { getPaginationMeta, extractData } from "@/lib/pagination";
import { Character, MaybePaginated } from "@/types";

function CharacterListWithMeta() {
  const { data: response } = useApiQuery<MaybePaginated<Character>>(
    "/characters",
    { params: { limit: 10 } }
  );

  const characters = response ? extractData(response) : [];
  const meta = response ? getPaginationMeta(response) : null;

  return (
    <div>
      {characters.map(char => <CharacterCard key={char.id} character={char} />)}

      {meta && (
        <div>
          Showing {meta.count} of {meta.total} characters
          (Page {meta.currentPage} of {meta.totalPages})
        </div>
      )}
    </div>
  );
}
```

## API Response Formats

### Paginated Response (New)

```json
{
  "data": [
    {
      "id": "...",
      "characterName": "...",
      "userId": "...",
      ...
    }
  ],
  "meta": {
    "total": 150,
    "count": 25,
    "limit": 25,
    "offset": 0,
    "hasMore": true,
    "currentPage": 1,
    "totalPages": 6
  }
}
```

### Legacy Response (Still Supported)

```json
[
  {
    "id": "...",
    "characterName": "...",
    "userId": "...",
    ...
  }
]
```

## Breaking Changes

### Field Name Changes

- **`playerId` → `userId`**: Update any code referencing `character.playerId` to use `character.userId`

Example migration:

```typescript
// Before
const charactersByPlayer = characters.filter((c) => c.playerId === playerId);

// After
const charactersByPlayer = characters.filter((c) => c.userId === userId);
```

### Mutation Hooks

The `useCreateCharacter` and `useUpdateCharacter` hooks now use proper TypeScript types:

```typescript
// Before
const { mutate } = useUpdateCharacter();
mutate({ id: "123", data: { level: 5 } }); // any type

// After
const { mutate } = useUpdateCharacter();
mutate({ id: "123", data: { level: 5 } }); // Partial<Character> type
```

## Migration Checklist

- [x] Update `Character` type definition
- [x] Add pagination types
- [x] Create pagination utility functions
- [x] Update `useCharacters` hook to extract data automatically
- [x] Update mutation hooks to use `userId` instead of `playerId`
- [x] Add TypeScript types to mutation callbacks
- [ ] Update any code using `character.playerId` to use `character.userId`
- [ ] Test character list rendering
- [ ] Test character creation/update/delete
- [ ] Test pagination controls (if implemented)

## Testing

### Manual Testing Steps

1. **List Characters**: Navigate to `/characters` and verify characters load
2. **Create Character**: Create a new character and verify it appears in the list
3. **Update Character**: Update a character and verify changes persist
4. **Delete Character**: Delete a character and verify it's removed from the list
5. **Search**: If search is implemented, verify it filters correctly
6. **Pagination**: If pagination controls exist, verify page navigation works

### Verify Role-Based Access

1. **As PLAYER**: Should only see own characters
2. **As ADMIN**: Should see all characters

## Future Enhancements

Consider implementing:

1. **Pagination Controls**: Add next/previous buttons and page numbers
2. **Items Per Page Selector**: Let users choose 10, 25, 50, or 100 items
3. **Search Debouncing**: Add debounce to search input for better performance
4. **Loading States**: Show skeleton loaders during pagination transitions
5. **Infinite Scroll**: Alternative to traditional pagination
6. **Sort Controls**: UI for changing sort field and direction

## Related Documentation

- [Backend Pagination Guide](../../backend-rest/PAGINATION_GUIDE.md)
- [Role-Based Access Control](../../backend-rest/ROLE_BASED_ACCESS.md)
- [Backend Pagination README](../../backend-rest/PAGINATION_README.md)

---

**Last Updated:** November 20, 2025
