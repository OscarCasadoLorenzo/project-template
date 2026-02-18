import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig, Endpoint, FieldHook } from 'payload'
import { APIError } from 'payload'
import { adminOrEditor, authenticatedOrPublished } from '../access'

// Type definitions for Lexical editor content
interface LexicalNode {
  text?: string
  children?: LexicalNode[]
  type?: string
}

interface LexicalContent {
  root?: {
    children?: LexicalNode[]
  }
}

/**
 * Calculate estimated reading time based on content
 * Assumes average reading speed of 200 words per minute
 */
function calculateReadingTime(content: unknown): number {
  if (!content) return 0

  // Extract text content from lexical editor format
  let textContent = ''

  try {
    if (typeof content === 'string') {
      textContent = content
    } else if (
      typeof content === 'object' &&
      content !== null &&
      'root' in content &&
      (content as LexicalContent).root?.children
    ) {
      // Parse lexical JSON structure
      const extractText = (node: LexicalNode): string => {
        if (node.text) return node.text
        if (node.children) {
          return node.children.map(extractText).join(' ')
        }
        return ''
      }
      const lexicalContent = content as LexicalContent
      if (lexicalContent.root) {
        textContent = extractText(lexicalContent.root)
      }
    }
  } catch (error) {
    console.error('Error extracting text for reading time:', error)
    return 0
  }

  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200)

  return readingTime > 0 ? readingTime : 1
}

/**
 * Auto-generate slug from title if not provided
 */
const generateSlug: FieldHook = ({ data, value, operation }) => {
  if (operation === 'create' || operation === 'update') {
    // If slug is provided, use it
    if (value) {
      return value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    }

    // Otherwise generate from title
    if (data?.title) {
      return data.title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }

  return value
}

/**
 * Validate slug uniqueness
 */
const validateUniqueSlug: FieldHook = async ({ value, operation, req, originalDoc }) => {
  if (operation === 'create' || operation === 'update') {
    if (!value) {
      throw new APIError('Slug is required', 400)
    }

    // Check for existing documents with the same slug
    const existingPosts = await req.payload.find({
      collection: 'blog-posts',
      where: {
        slug: {
          equals: value,
        },
      },
      limit: 1,
      req,
    })

    // Allow update if the existing doc is the current doc
    if (existingPosts.docs.length > 0) {
      const existingDoc = existingPosts.docs[0]
      if (operation === 'update' && originalDoc && existingDoc.id === originalDoc.id) {
        return value
      }
      throw new APIError(`A blog post with slug "${value}" already exists`, 400)
    }
  }

  return value
}

/**
 * Auto-generate excerpt from content if not provided
 */
const generateExcerpt: FieldHook = ({ data, value, operation }) => {
  if (operation === 'create' || operation === 'update') {
    // If excerpt is provided, use it
    if (value) {
      return value
    }

    // Otherwise generate from content
    if (data?.content) {
      try {
        let textContent = ''

        if (typeof data.content === 'string') {
          textContent = data.content
        } else if (
          typeof data.content === 'object' &&
          data.content !== null &&
          'root' in data.content &&
          (data.content as LexicalContent).root?.children
        ) {
          const extractText = (node: LexicalNode): string => {
            if (node.text) return node.text
            if (node.children) {
              return node.children.map(extractText).join(' ')
            }
            return ''
          }
          const lexicalContent = data.content as LexicalContent
          if (lexicalContent.root) {
            textContent = extractText(lexicalContent.root)
          }
        }

        // Take first 160 characters for excerpt
        const excerpt = textContent.trim().substring(0, 160)
        return excerpt ? `${excerpt}...` : ''
      } catch (error) {
        console.error('Error generating excerpt:', error)
      }
    }
  }

  return value
}

/**
 * Calculate and set reading time based on content
 */
const setReadingTime: FieldHook = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    return calculateReadingTime(data?.content)
  }
  return undefined
}

/**
 * Normalize tags to lowercase and remove duplicates
 */
const normalizeTags: FieldHook = ({ value }) => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((tag) => (typeof tag === 'string' ? tag.trim().toLowerCase() : tag))
      .filter((tag, index, self) => tag && self.indexOf(tag) === index)
    return normalized
  }
  return value
}

/**
 * Set publishedAt when status changes to published
 */
const setPublishedAt: FieldHook = ({ data, value, operation, originalDoc }) => {
  if (operation === 'create' || operation === 'update') {
    const isNowPublished = data?.status === 'published'
    const wasPublished = originalDoc?.status === 'published'

    // Set publishedAt if transitioning to published and not already set
    if (isNowPublished && !wasPublished && !value) {
      return new Date().toISOString()
    }
  }

  return value
}

/**
 * Custom endpoint to get published blog posts with pagination and filtering
 */
const getPublishedPosts: Endpoint = {
  path: '/published',
  method: 'get',
  handler: async (req) => {
    try {
      if (!req.url) {
        throw new APIError('Request URL is required', 400)
      }
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1', 10)
      const limit = parseInt(searchParams.get('limit') || '10', 10)
      const tag = searchParams.get('tag')
      const featured = searchParams.get('featured')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {
        status: {
          equals: 'published',
        },
      }

      if (tag) {
        where.tags = {
          contains: tag,
        }
      }

      if (featured === 'true') {
        where.isFeatured = {
          equals: true,
        }
      }

      const posts = await req.payload.find({
        collection: 'blog-posts',
        where,
        sort: '-publishedAt',
        page,
        limit,
        depth: 3,
        req,
        overrideAccess: false,
      })

      return Response.json(posts)
    } catch (error) {
      throw new APIError('Failed to fetch published posts', 500)
    }
  },
}

/**
 * Custom endpoint to get a single blog post by slug
 */
const getBySlug: Endpoint = {
  path: '/slug/:slug',
  method: 'get',
  handler: async (req) => {
    try {
      const slug = req.routeParams?.slug as string | undefined

      if (!slug) {
        throw new APIError('Slug parameter is required', 400)
      }

      const posts = await req.payload.find({
        collection: 'blog-posts',
        where: {
          slug: {
            equals: decodeURIComponent(slug),
          },
        },
        limit: 1,
        depth: 3,
        req,
        overrideAccess: false,
      })

      if (posts.docs.length === 0) {
        throw new APIError('Blog post not found', 404)
      }

      return Response.json(posts.docs[0])
    } catch (error) {
      if (error instanceof APIError) throw error
      throw new APIError('Failed to fetch blog post', 500)
    }
  },
}

/**
 * Custom endpoint to get posts by tag
 */
const getByTag: Endpoint = {
  path: '/by-tag/:tag',
  method: 'get',
  handler: async (req) => {
    try {
      const tag = req.routeParams?.tag as string | undefined

      if (!tag) {
        throw new APIError('Tag parameter is required', 400)
      }

      const posts = await req.payload.find({
        collection: 'blog-posts',
        where: {
          tags: {
            contains: decodeURIComponent(tag),
          },
          status: {
            equals: 'published',
          },
        },
        sort: '-publishedAt',
        depth: 2,
        req,
        overrideAccess: false,
      })

      return Response.json(posts)
    } catch (error) {
      throw new APIError('Failed to fetch posts by tag', 500)
    }
  },
}

/**
 * Custom endpoint to get all unique tags
 */
const getAllTags: Endpoint = {
  path: '/tags',
  method: 'get',
  handler: async (req) => {
    try {
      const posts = await req.payload.find({
        collection: 'blog-posts',
        where: {
          status: {
            equals: 'published',
          },
        },
        limit: 1000,
        depth: 0,
        req,
        overrideAccess: false,
      })

      // Extract and deduplicate tags
      const tagsSet = new Set<string>()
      posts.docs.forEach((post) => {
        if ('tags' in post && Array.isArray(post.tags)) {
          post.tags.forEach((tag: unknown) => {
            if (typeof tag === 'string') {
              tagsSet.add(tag)
            }
          })
        }
      })

      const tags = Array.from(tagsSet).sort()

      return Response.json({ tags, total: tags.length })
    } catch (error) {
      throw new APIError('Failed to fetch tags', 500)
    }
  },
}

/**
 * BlogPosts Collection
 *
 * Stores blog posts with rich text content (Lexical editor), cover images,
 * tags, and publication management. Supports draft/published workflow,
 * estimated reading time, and SEO-friendly slugs.
 */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'author', 'readingTime'],
    group: 'Content',
    description: 'Blog posts, articles, and case studies for your portfolio',
  },

  access: {
    // Public can read published posts, authenticated users can read all
    read: authenticatedOrPublished,

    // Only admins and editors can create/update/delete
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },

  // Custom endpoints for enhanced functionality
  endpoints: [getPublishedPosts, getBySlug, getByTag, getAllTags],

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 200,
      admin: {
        description: 'Blog post title (3-200 characters)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'SEO-friendly URL slug (auto-generated from title if not provided, must be unique)',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [generateSlug, validateUniqueSlug],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
      admin: {
        description: 'Main blog post content with rich text formatting, images, and code blocks',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description:
          'Short summary for previews and SEO (auto-generated from content if not provided, max 300 characters)',
        placeholder: 'Enter a brief excerpt or leave blank for auto-generation',
      },
      hooks: {
        beforeChange: [generateExcerpt],
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the blog post',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description:
          'Tags for categorization and filtering (e.g., "typescript", "react", "tutorial")',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [normalizeTags],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Publication status of the blog post',
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Mark this blog post as featured to display it prominently on the blog page',
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Publication date (automatically set when status changes to published)',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [setPublishedAt],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Author of the blog post',
        position: 'sidebar',
      },
      defaultValue: ({ user }: { user?: { id?: string | number } }) => user?.id,
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Estimated reading time in minutes (auto-calculated from content)',
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [setReadingTime],
      },
    },
  ],

  // Enable automatic timestamps
  timestamps: true,
}
