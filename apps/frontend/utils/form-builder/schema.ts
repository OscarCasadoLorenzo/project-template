import { z } from "zod";
import {
  FieldConfig,
  FormConfig,
  FormSectionConfig,
  FormTabConfig,
} from "./types";

/**
 * Creates a Zod validation schema from a form configuration
 */
export function createValidationSchema(config: FormConfig) {
  const schemaShape: Record<string, z.ZodType<any>> = {};

  // Handle both sections and tabs
  const allSections = config.sections || [];
  if (config.tabs) {
    config.tabs.forEach((tab) => {
      allSections.push(...tab.sections);
    });
  }

  allSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.validation) {
        schemaShape[field.name] = field.validation;
      } else {
        // Auto-generate basic validation based on field type
        schemaShape[field.name] = createDefaultValidation(field);
      }
    });
  });

  return z.object(schemaShape);
}

/**
 * Creates default validation for a field based on its type and configuration
 */
function createDefaultValidation(field: FieldConfig): z.ZodType<any> {
  let schema: z.ZodType<any>;

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "url":
    case "textarea":
      schema = z.string();
      if (field.type === "email") {
        schema = (schema as z.ZodString).email("Invalid email format");
      }
      if (field.type === "url") {
        schema = (schema as z.ZodString).url("Invalid URL format");
      }
      if ("maxLength" in field && field.maxLength) {
        schema = (schema as z.ZodString).max(
          field.maxLength,
          `Maximum ${field.maxLength} characters`,
        );
      }
      if ("minLength" in field && field.minLength) {
        schema = (schema as z.ZodString).min(
          field.minLength,
          `Minimum ${field.minLength} characters`,
        );
      }
      break;

    case "number":
      schema = z.number();
      if ("min" in field && field.min !== undefined) {
        schema = (schema as z.ZodNumber).min(
          field.min,
          `Minimum value is ${field.min}`,
        );
      }
      if ("max" in field && field.max !== undefined) {
        schema = (schema as z.ZodNumber).max(
          field.max,
          `Maximum value is ${field.max}`,
        );
      }
      break;

    case "checkbox":
      schema = z.boolean();
      break;

    case "select":
    case "radio":
      if (field.type === "select" && field.multiple) {
        schema = z.array(z.union([z.string(), z.number()]));
      } else {
        schema = z.union([z.string(), z.number()]);
      }
      break;

    case "date":
    case "datetime-local":
    case "time":
      schema = z.string().or(z.date());
      break;

    case "file":
      schema = z.any(); // File handling is complex, leave flexible
      break;

    case "string-list":
      // Array of objects with text property
      let itemSchema = z.object({
        text: z.string(),
      });

      // Apply maxLength to the text field if specified
      if ("maxLength" in field && field.maxLength) {
        itemSchema = z.object({
          text: z
            .string()
            .max(field.maxLength, `Maximum ${field.maxLength} characters`),
        });
      }

      schema = z.array(itemSchema);
      break;

    default:
      schema = z.any();
      break;
  }

  // Apply required/optional
  if (field.required) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(1, `${field.label} is required`);
    }
  } else {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Extracts default values from form configuration
 */
export function extractDefaultValues(config: FormConfig): Record<string, any> {
  const defaultValues: Record<string, any> = {};

  // Handle both sections and tabs
  const allSections = config.sections || [];
  if (config.tabs) {
    config.tabs.forEach((tab) => {
      allSections.push(...tab.sections);
    });
  }

  allSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      } else {
        // Set sensible defaults based on field type
        switch (field.type) {
          case "checkbox":
            defaultValues[field.name] = false;
            break;
          case "select":
            if (field.multiple) {
              defaultValues[field.name] = [];
            } else {
              defaultValues[field.name] = "";
            }
            break;
          case "string-list":
            defaultValues[field.name] = [];
            break;
          case "number":
            defaultValues[field.name] = 0;
            break;
          default:
            defaultValues[field.name] = "";
            break;
        }
      }
    });
  });

  return defaultValues;
}

/**
 * Utility to create a form field configuration with proper typing
 */
export function createField(type: string, config: any): any {
  return { type, ...config };
}

/**
 * Utility to create a form section
 */
export function createSection(config: {
  title?: string;
  description?: string;
  className?: string;
  fields: FieldConfig[];
  columns?: 1 | 2 | 3 | 4;
}): FormSectionConfig {
  return {
    columns: 1,
    ...config,
  } as FormSectionConfig;
}

/**
 * Utility to create a form tab
 */
export function createTab(config: {
  id: string;
  label: string;
  sections: FormSectionConfig[];
}): FormTabConfig {
  return config;
}

/**
 * Utility to create a complete form configuration
 */
export function createFormConfig(config: FormConfig): FormConfig {
  return config;
}
