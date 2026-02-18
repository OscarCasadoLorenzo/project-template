import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { BlogPosts } from './collections/BlogPosts'
import { Media } from './collections/Media'
import { Positions } from './collections/Positions'
import { Skills } from './collections/Skills'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: ['@/components/Logout#LogoutButton'],
    },
  },
  collections: [Users, Media, BlogPosts, Positions, Skills],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: process.env.R2_PREFIX || 'media',
          // Use public R2 URL for direct public access
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            return `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY || '',
          secretAccessKey: process.env.R2_SECRET_KEY || '',
        },
        endpoint: process.env.R2_ENDPOINT,
        region: 'auto', // Cloudflare R2 uses 'auto' as region
        forcePathStyle: true, // Required for R2
      },
    }),
  ],
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
})
