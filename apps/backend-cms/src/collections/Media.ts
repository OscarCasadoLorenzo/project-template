import type { CollectionConfig } from 'payload'

/**
 * Media Collection - R2-backed storage via official S3 adapter
 *
 * This collection uses PayloadCMS's official S3 storage adapter
 * configured for Cloudflare R2. Files are stored directly in R2
 * and metadata is managed by Payload.
 *
 * Features:
 * - Image previews in admin panel
 * - S3-compatible R2 storage
 * - Public/private visibility control
 */
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      admin: {
        description: 'Public files are accessible via CDN, private require authentication',
      },
    },
  ],
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'visibility', 'updatedAt'],
  },
  timestamps: true,
}
