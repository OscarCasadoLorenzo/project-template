// Main exports
export { FormBuilder } from "./FormBuilder";
export { FormField } from "./FormField";

// Types
export type {
  BaseFieldConfig,
  CheckboxFieldConfig,
  DateFieldConfig,
  FieldConfig,
  FieldProps,
  FileFieldConfig,
  FormBuilderProps,
  FormConfig,
  FormMode,
  FormSectionConfig,
  FormTabConfig,
  NumberFieldConfig,
  RadioGroupFieldConfig,
  SelectFieldConfig,
  StringListFieldConfig,
  TextFieldConfig,
  TextareaFieldConfig,
} from "./types";

// Utilities
export {
  createField,
  createFormConfig,
  createSection,
  createTab,
  createValidationSchema,
  extractDefaultValues,
} from "./schema";

export { isCreateMode, isFieldEditable, isViewMode } from "./types";
// Re-export default
export { default } from "./FormBuilder";
