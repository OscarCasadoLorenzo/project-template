import { ReactNode } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Base field configuration
export interface BaseFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: z.ZodType<any>;
  defaultValue?: any;
}

// Specific field type configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "url";
  maxLength?: number;
  minLength?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
  minLength?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  multiple?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
}

export interface RadioGroupFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date" | "datetime-local" | "time";
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
}

export interface StringListFieldConfig extends BaseFieldConfig {
  type: "string-list";
  maxLength?: number;
  rows?: number;
  addButtonText?: string;
  emptyStateText?: string;
}

export interface CustomFieldConfig extends BaseFieldConfig {
  type: "custom";
  customComponent: string;
  customProps?: Record<string, any>;
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioGroupFieldConfig
  | DateFieldConfig
  | FileFieldConfig
  | StringListFieldConfig
  | CustomFieldConfig;

// Form section configuration
export interface FormSectionConfig {
  title?: string;
  description?: string;
  className?: string;
  fields: FieldConfig[];
  columns?: 1 | 2 | 3 | 4;
}

// Tab configuration
export interface FormTabConfig {
  id: string;
  label: string;
  sections: FormSectionConfig[];
}

// Main form configuration
export interface FormConfig {
  title?: string;
  description?: string;
  sections?: FormSectionConfig[];
  tabs?: FormTabConfig[];
  submitButton?: {
    text: string;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
  };
  cancelButton?: {
    text: string;
    className?: string;
    onClick?: () => void;
  };
  className?: string;
}

// Form builder props
export interface FormBuilderProps<T extends FieldValues = FieldValues> {
  config: FormConfig;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  isLoading?: boolean;
  children?: ReactNode;
}

// Field component props
export interface FieldProps {
  config: FieldConfig;
  className?: string;
}

// Utility types
export type FormData<T extends FormConfig> = {
  [K in T["sections"] extends readonly any[]
    ? T["sections"][number]["fields"][number]["name"]
    : T["tabs"] extends readonly any[]
      ? T["tabs"][number]["sections"][number]["fields"][number]["name"]
      : never]: any;
};

// Validation schema builder utility
export type ValidationSchema<T extends FormConfig> = z.ZodObject<{
  [K in T["sections"] extends readonly any[]
    ? T["sections"][number]["fields"][number]["name"]
    : T["tabs"] extends readonly any[]
      ? T["tabs"][number]["sections"][number]["fields"][number]["name"]
      : never]: z.ZodType<any>;
}>;

/**
 * Form mode type for character forms
 * - view: Read-only mode, all fields disabled
 * - edit: Edit mode, editable fields enabled
 * - create: Creation mode, all fields enabled (except auto-generated ones)
 */
export type FormMode = "view" | "edit" | "create";

/**
 * Helper function to determine if a field should be editable based on mode
 */
export const isFieldEditable = (mode: FormMode): boolean => {
  return mode === "edit" || mode === "create";
};

/**
 * Helper function to check if we're in create mode
 */
export const isCreateMode = (mode: FormMode): boolean => {
  return mode === "create";
};

/**
 * Helper function to check if we're in view mode
 */
export const isViewMode = (mode: FormMode): boolean => {
  return mode === "view";
};
