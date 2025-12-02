# Style Guide

## Code Style Conventions

This document defines the coding style and conventions for the Project Template project.

---

## Comments & Documentation

### JSDoc for Public APIs

```typescript
/**
 * Fetches an item by ID
 * @param id - The item's unique identifier
 * @returns Promise resolving to the item data
 * @throws {NotFoundError} When item doesn't exist
 */
export async function getItem(id: string): Promise<Item> {
  // Implementation
}
```

### Inline Comments

- **Explain "why"**, not "what"
- **Use sparingly** - prefer self-documenting code
- **TODO comments** - Include ticket reference: `// TODO(SPM-123): Implement caching`

## Git Commit Style

Follow Conventional Commits format with GitFlow branch prefixes:

```
SPM-<ticket> <type>: <description>

Examples:
SPM-34 feat: Add item creation form
SPM-35 fix: Resolve login redirect issue
SPM-36 refactor: Extract API client to utility
```

See `.ai/prompts/commit-changes.md` for automated commit workflows.
