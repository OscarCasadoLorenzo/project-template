import {
  Button,
  Checkbox,
  cn,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@project-template/ui";
import { Plus, Trash2, X } from "lucide-react";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FieldConfig, FieldProps } from "./types";

// Error message component
const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <p className="text-sm text-red-500 mt-1">{message}</p>;
};

// Description component
const FieldDescription: React.FC<{ description?: string }> = ({
  description,
}) => {
  if (!description) return null;
  return <p className="text-sm text-muted-foreground mt-1">{description}</p>;
};

// Text input field
const TextFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<
    FieldConfig,
    { type: "text" | "email" | "password" | "url" }
  >;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            id={config.name}
            type={fieldConfig.type}
            placeholder={config.placeholder}
            disabled={config.disabled}
            maxLength={fieldConfig.maxLength}
            className={error ? "border-red-500" : ""}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Number input field
const NumberFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<FieldConfig, { type: "number" }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            id={config.name}
            type="number"
            placeholder={config.placeholder}
            disabled={config.disabled}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.step}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              field.onChange(e.target.value ? Number(e.target.value) : "")
            }
            className={error ? "border-red-500" : ""}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Textarea field
const TextareaFieldComponent: React.FC<FieldProps> = ({
  config,
  className,
}) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<FieldConfig, { type: "textarea" }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={config.name}
            placeholder={config.placeholder}
            disabled={config.disabled}
            rows={fieldConfig.rows}
            maxLength={fieldConfig.maxLength}
            className={error ? "border-red-500" : ""}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Select field
const SelectFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<FieldConfig, { type: "select" }>;
  const error = form.formState.errors[config.name]?.message as string;

  if (fieldConfig.multiple) {
    // Multi-select implementation would require a custom component
    // For now, we'll implement single select
    console.warn(
      "Multi-select not yet implemented, falling back to single select",
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={config.disabled}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Checkbox field
const CheckboxFieldComponent: React.FC<FieldProps> = ({
  config,
  className,
}) => {
  const form = useFormContext();
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={config.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={config.disabled}
            />
            <Label
              htmlFor={config.name}
              className={
                config.required
                  ? 'after:content-["*"] after:text-red-500 after:ml-1'
                  : ""
              }
            >
              {config.label}
            </Label>
          </div>
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Radio group field
const RadioGroupFieldComponent: React.FC<FieldProps> = ({
  config,
  className,
}) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<FieldConfig, { type: "radio" }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={config.disabled}
          >
            {fieldConfig.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={String(option.value)}
                  id={`${config.name}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label htmlFor={`${config.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Date field
const DateFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<
    FieldConfig,
    { type: "date" | "datetime-local" | "time" }
  >;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            id={config.name}
            type={fieldConfig.type}
            disabled={config.disabled}
            className={error ? "border-red-500" : ""}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// File field
const FileFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<FieldConfig, { type: "file" }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required
            ? 'after:content-["*"] after:text-red-500 after:ml-1'
            : ""
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field: { onChange, ...field } }) => (
          <Input
            {...field}
            id={config.name}
            type="file"
            accept={fieldConfig.accept}
            multiple={fieldConfig.multiple}
            disabled={config.disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.files)
            }
            className={error ? "border-red-500" : ""}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// String list field component for dynamic arrays of strings
// String list field component for dynamic arrays of strings
const StringListFieldComponent: React.FC<FieldProps> = ({
  config,
  className,
}) => {
  const form = useFormContext();
  const fieldConfig = config as Extract<FieldConfig, { type: "string-list" }>;
  const error = form.formState.errors[config.name]?.message as string;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: config.name,
  });

  const handleAdd = () => {
    append({ text: "" });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const getErrorMessage = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldErrors = form.formState.errors[config.name] as any;
    return fieldErrors?.[index]?.text?.message;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div>
          <Label
            htmlFor={config.name}
            className={
              config.required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {config.label}
          </Label>
          {config.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          )}
        </div>
        {!config.disabled && (
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {fieldConfig.addButtonText || "Add"}
          </Button>
        )}
      </div>

      <div className="space-y-3 mt-3">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">
              {fieldConfig.emptyStateText ||
                `No items added. Click "${fieldConfig.addButtonText || "Add"}" to begin.`}
            </p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <div className="relative">
                  <Controller
                    name={`${config.name}.${index}.text`}
                    control={form.control}
                    render={({ field: controllerField }) => (
                      <Textarea
                        {...controllerField}
                        disabled={config.disabled}
                        placeholder={config.placeholder || "Enter text..."}
                        maxLength={fieldConfig.maxLength}
                        rows={fieldConfig.rows || 2}
                        className={cn(
                          "resize-none",
                          getErrorMessage(index) && "border-red-500",
                        )}
                      />
                    )}
                  />
                  {getErrorMessage(index) && (
                    <p className="text-sm text-red-600 mt-1">
                      {getErrorMessage(index)}
                    </p>
                  )}
                </div>
              </div>
              {!config.disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="mt-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

// Custom field component for handling special field types
const CustomFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const fieldConfig = config as Extract<FieldConfig, { type: "custom" }>;

  // Handle delete button for inventory items
  if (fieldConfig.customComponent === "delete-button") {
    const { itemId, itemName, onDelete, isMarkedForDeletion } =
      fieldConfig.customProps || {};

    const handleDeleteClick = () => {
      if (onDelete && typeof onDelete === "function") {
        onDelete(itemId, itemName);
      } else {
        toast.error("No se pudo marcar el objeto para eliminación.");
      }
    };

    return (
      <div className={cn("space-y-2 flex items-end", className)}>
        <Button
          type="button"
          variant={
            isMarkedForDeletion
              ? "outline"
              : fieldConfig.customProps?.variant || "destructive"
          }
          size={fieldConfig.customProps?.size || "sm"}
          onClick={handleDeleteClick}
          className={cn(
            "w-full",
            isMarkedForDeletion &&
              "border-green-500 text-green-600 hover:bg-green-50",
          )}
        >
          {isMarkedForDeletion ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Restaurar
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Marcar para eliminar
            </>
          )}
        </Button>
      </div>
    );
  }

  // Legacy deleteButton support (kept for backward compatibility)
  if (fieldConfig.customComponent === "deleteButton") {
    const handleDeleteClick = () => {
      if (fieldConfig.customProps) {
        const { itemId, itemName } = fieldConfig.customProps;

        if (
          window.confirm(`¿Estás seguro de que quieres eliminar "${itemName}"?`)
        ) {
          // Get the delete handler from the form context or global context
          const deleteHandler = (window as any).__deleteInventoryHandler;
          if (deleteHandler) {
            deleteHandler(itemId, itemName);
          } else {
            toast.error("No se pudo eliminar el objeto. Inténtalo de nuevo.");
          }
        }
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        <Label>{fieldConfig.label}</Label>
        <Button
          type="button"
          variant={fieldConfig.customProps?.variant || "destructive"}
          size={fieldConfig.customProps?.size || "sm"}
          onClick={handleDeleteClick}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    );
  }

  return null;
};

// Main field component that renders the appropriate field type
export const FormField: React.FC<FieldProps> = ({ config, className }) => {
  const combinedClassName = cn(config.className, className);

  switch (config.type) {
    case "text":
    case "email":
    case "password":
    case "url":
      return (
        <TextFieldComponent config={config} className={combinedClassName} />
      );
    case "number":
      return (
        <NumberFieldComponent config={config} className={combinedClassName} />
      );
    case "textarea":
      return (
        <TextareaFieldComponent config={config} className={combinedClassName} />
      );
    case "select":
      return (
        <SelectFieldComponent config={config} className={combinedClassName} />
      );
    case "checkbox":
      return (
        <CheckboxFieldComponent config={config} className={combinedClassName} />
      );
    case "radio":
      return (
        <RadioGroupFieldComponent
          config={config}
          className={combinedClassName}
        />
      );
    case "date":
    case "datetime-local":
    case "time":
      return (
        <DateFieldComponent config={config} className={combinedClassName} />
      );
    case "file":
      return (
        <FileFieldComponent config={config} className={combinedClassName} />
      );
    case "string-list":
      return (
        <StringListFieldComponent
          config={config}
          className={combinedClassName}
        />
      );
    case "custom":
      return (
        <CustomFieldComponent config={config} className={combinedClassName} />
      );
    default:
      console.warn(`Unknown field type: ${(config as any).type}`);
      return null;
  }
};
