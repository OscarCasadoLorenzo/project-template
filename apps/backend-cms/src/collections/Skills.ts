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
      unique: false, // We'll validate uniqueness per category in hooks
      index: true,
      admin: {
        description: 'Skill name (e.g., "TypeScript", "Docker", "React")',
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
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description or notes about this skill',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Skill icon or logo (optional)',
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

  // Hooks for validation
  hooks: {
    beforeValidate: [
      async ({ data, operation, req, originalDoc }) => {
        // Validate unique name (skill names should be globally unique)
        if (operation === 'create' || operation === 'update') {
          if (data?.name) {
            const existingSkills = await req.payload.find({
              collection: 'skills',
              where: {
                name: {
                  equals: data.name,
                },
              },
              limit: 1,
            })

            // For updates, check if the found skill is not the current one
            if (operation === 'update') {
              const currentId = originalDoc?.id
              const hasConflict = existingSkills.docs.some((skill) => skill.id !== currentId)
              if (hasConflict) {
                throw new APIError(`A skill named "${data.name}" already exists`, 400)
              }
            } else if (existingSkills.totalDocs > 0) {
              throw new APIError(`A skill named "${data.name}" already exists`, 400)
            }
          }

          // Validate unique order
          if (data?.order !== undefined && data.order !== null) {
            const existingOrder = await req.payload.find({
              collection: 'skills',
              where: {
                order: {
                  equals: data.order,
                },
              },
              limit: 1,
            })

            // For updates, check if the found skill is not the current one
            if (operation === 'update') {
              const currentId = originalDoc?.id
              const hasConflict = existingOrder.docs.some((skill) => skill.id !== currentId)
              if (hasConflict) {
                throw new APIError(
                  `A skill with order ${data.order} already exists. Please choose a different order value.`,
                  400,
                )
              }
            } else if (existingOrder.totalDocs > 0) {
              throw new APIError(
                `A skill with order ${data.order} already exists. Please choose a different order value.`,
                400,
              )
            }
          }
        }
        return data
      },
    ],
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
