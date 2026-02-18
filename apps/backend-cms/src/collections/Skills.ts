import type { CollectionConfig, Endpoint } from 'payload'
import { APIError } from 'payload'
import { adminOrEditor, anyone } from '../access'

/**
 * Predefined skill categories for software development
 */
const SKILL_CATEGORIES = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Database', value: 'database' },
  { label: 'DevOps', value: 'devops' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Testing', value: 'testing' },
  { label: 'Security', value: 'security' },
  { label: 'Agile', value: 'agile' },
  { label: 'Tools', value: 'tools' },
  { label: 'Design', value: 'design' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'AI/ML', value: 'ai-ml' },
  { label: 'Data Science', value: 'data-science' },
  { label: 'API', value: 'api' },
  { label: 'Version Control', value: 'version-control' },
  { label: 'CI/CD', value: 'ci-cd' },
  { label: 'Monitoring', value: 'monitoring' },
  { label: 'Performance', value: 'performance' },
  { label: 'Blockchain', value: 'blockchain' },
]

/**
 * Custom endpoint to get skills by category
 */
const getByCategory: Endpoint = {
  path: '/by-category/:category',
  method: 'get',
  handler: async (req) => {
    try {
      const category = req.routeParams?.category as string | undefined

      if (!category) {
        throw new APIError('Category parameter is required', 400)
      }

      const skills = await req.payload.find({
        collection: 'skills',
        where: {
          categories: {
            contains: decodeURIComponent(category),
          },
        },
        sort: 'order',
        depth: 1,
        req,
        overrideAccess: false,
      })

      return Response.json(skills)
    } catch (error) {
      throw new APIError('Failed to fetch skills by category', 500)
    }
  },
}

/**
 * Skills Collection
 *
 * Stores technical skills, tools, and technologies for portfolio display.
 * Supports multiple categories, icons, and custom ordering.
 */
export const Skills: CollectionConfig = {
  slug: 'skills',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'categories', 'order'],
    group: 'Portfolio',
  },

  access: {
    // Public can read all skills
    read: anyone,

    // Only admins and editors can create/update/delete
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Skill name (e.g., "TypeScript", "Docker", "React") - must be unique',
      },
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: SKILL_CATEGORIES,
      index: true,
      admin: {
        description: 'Skill categories (can select multiple)',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within category (lower numbers appear first)',
      },
    },
  ],

  timestamps: true,

  // Default sorting by order, then name
  defaultSort: 'order',

  // Custom endpoints
  endpoints: [getByCategory],

  // Hooks for data normalization
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Normalize name for consistency
        if (data?.name) {
          data.name = data.name.trim()
        }
        return data
      },
    ],
  },
}
