import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the user',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        // Only admins can update roles
        update: ({ req: { user } }) => {
          if (!user) return false
          const userRoles = (user as { roles?: string[] }).roles
          return userRoles?.includes('admin') ?? false
        },
      },
      admin: {
        description: 'User roles for access control',
      },
    },
  ],
}
