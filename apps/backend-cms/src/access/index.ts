import type { Access } from 'payload'
import type { User } from '../payload-types'

type UserWithRoles = User & {
  roles?: ('admin' | 'editor' | 'user')[]
}

/**
 * Allows access to anyone (public access)
 * Use for public-facing content
 */
export const anyone: Access = () => true

/**
 * Requires user to be authenticated
 * Use for any operations that need a logged-in user
 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/**
 * Restricts access to admin role only
 * Use for sensitive operations or system-level changes
 */
export const adminOnly: Access = ({ req: { user } }) => {
  return (user as UserWithRoles)?.roles?.includes('admin') ?? false
}

/**
 * Allows access to admin or editor roles
 * Use for content management operations
 */
export const adminOrEditor: Access = ({ req: { user } }) => {
  return (
    (user as UserWithRoles)?.roles?.some((role: string) => ['admin', 'editor'].includes(role)) ??
    false
  )
}

/**
 * Public can read published content, authenticated users can read all
 * Use for content with published/draft states
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  // Authenticated users see everything
  if (user) return true

  // Public sees only published content
  return {
    _status: {
      equals: 'published',
    },
  }
}

/**
 * Allows admins full access, users can only access their own documents
 * Use for user-specific resources
 */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false

  if ((user as UserWithRoles).roles?.includes('admin')) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
