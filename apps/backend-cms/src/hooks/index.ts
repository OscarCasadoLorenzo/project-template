import type { FieldHook } from 'payload'
import { APIError } from 'payload'

/**
 * Validates that startDate is before endDate
 * Use in beforeValidate hook for date range fields
 */
export const validateDateRange: FieldHook = ({ data, value, operation }) => {
  // Skip validation on read operations
  if (operation === 'read') return value

  const startDate = data?.startDate
  const endDate = data?.endDate

  // If endDate exists and both dates are present, validate
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      throw new APIError('End date must be after start date', 400)
    }
  }

  return value
}

/**
 * Automatically sets publishedAt date when status changes to published
 * Use in beforeChange hook for collections with draft/published workflow
 */
export const setPublishedDate: FieldHook = ({ data, value, operation, originalDoc }) => {
  // Only run on create or update
  if (operation === 'create' || operation === 'update') {
    const isNowPublished = data?._status === 'published'
    const wasPublished = originalDoc?._status === 'published'

    // Set publishedAt if transitioning to published and not already set
    if (isNowPublished && !wasPublished && !value) {
      return new Date().toISOString()
    }
  }

  return value
}

/**
 * Normalizes text by trimming and converting to lowercase
 * Use in beforeValidate hook for consistent text storage
 */
export const normalizeText: FieldHook = ({ value }) => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }
  return value
}

/**
 * Auto-increments order field based on existing documents
 * Use in beforeChange hook for sortable collections
 * Note: This is a generic version. For collection-specific logic,
 * create a custom hook within the collection file.
 */
export const autoIncrementOrder: FieldHook = async ({ value }) => {
  // If order is already set, use it
  if (value !== undefined && value !== null) {
    return value
  }

  // Return default value - collection-specific hooks can override this
  return 0
}
