import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig, Endpoint } from 'payload'
import { APIError } from 'payload'
import { adminOrEditor, anyone } from '../access'
import { validateDateRange } from '../hooks'

/**
 * Custom endpoint to get current/ongoing professional experiences
 */
const getCurrentExperiences: Endpoint = {
  path: '/current',
  method: 'get',
  handler: async (req) => {
    try {
      const positions = await req.payload.find({
        collection: 'positions',
        where: {
          isCurrent: {
            equals: true,
          },
        },
        sort: '-startDate',
        depth: 2,
        req,
        overrideAccess: false,
      })

      return Response.json(positions)
    } catch (error) {
      throw new APIError('Failed to fetch current positions', 500)
    }
  },
}

/**
 * Custom endpoint to get experiences by company
 */
const getByCompany: Endpoint = {
  path: '/by-company/:company',
  method: 'get',
  handler: async (req) => {
    try {
      const company = req.routeParams?.company as string | undefined

      if (!company) {
        throw new APIError('Company parameter is required', 400)
      }

      const experiences = await req.payload.find({
        collection: 'professional-experience',
        where: {
          company: {
            contains: decodeURIComponent(company),
          },
        },
        sort: '-startDate',
        depth: 2,
        req,
        overrideAccess: false,
      })

      return Response.json(positions)
    } catch (error) {
      throw new APIError('Failed to fetch positions by company', 500)
    }
  },
}

/**
 * Positions Collection
 *
 * Stores work history, roles, and professional achievements for portfolio display.
 * Supports date ranges, rich text descriptions, company logos, and custom ordering.
 */
export const Positions: CollectionConfig = {
  slug: 'positions',

  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'company', 'startDate', 'endDate', 'isCurrent'],
    group: 'Portfolio',
  },

  access: {
    // Public can read all experiences
    read: anyone,

    // Only admins and editors can create/update/delete
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },

  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title or role (e.g., "Frontend Developer", "Senior Engineer")',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Company or organization name',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Work location (e.g., "San Francisco, CA", "Remote")',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Start date of employment',
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'End date of employment (leave empty if current)',
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
        condition: (data) => !data.isCurrent,
      },
      hooks: {
        beforeValidate: [validateDateRange],
      },
    },
    {
      name: 'isCurrent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if this is your current position',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) => {
            // Clear endDate if isCurrent is true
            if (value === true && siblingData) {
              siblingData.endDate = null
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
      admin: {
        description: 'Detailed description of responsibilities, achievements, and key projects',
      },
    },
    {
      name: 'skills',
      type: 'array',
      admin: {
        description: 'Technologies and skills used in this role',
      },
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Company logo or brand image',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description:
          'Sort order (lower numbers appear first, typically use negative for manual priority)',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      admin: {
        description: 'Key achievements or highlights (bullet points)',
      },
      fields: [
        {
          name: 'highlight',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'companyWebsite',
      type: 'text',
      admin: {
        description: 'Company website URL',
      },
      validate: (value: unknown) => {
        if (!value) return true

        try {
          new URL(value as string)
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
  ],

  timestamps: true,

  // Default sorting: current first, then by start date descending
  defaultSort: '-startDate',

  // Custom endpoints
  endpoints: [getCurrentExperiences, getByCompany],

  // Hooks for additional logic
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Validate that if not current, endDate must be provided
        if (operation === 'create' || operation === 'update') {
          if (!data.isCurrent && !data.endDate) {
            throw new APIError('End date is required when position is not current', 400)
          }
        }
        return data
      },
    ],
  },
}
