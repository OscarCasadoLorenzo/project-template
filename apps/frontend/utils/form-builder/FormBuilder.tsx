import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@project-template/ui";
import { FieldValues, FormProvider } from "react-hook-form";
import { FormField } from "./FormField";
import { FormBuilderProps } from "./types";

export const FormBuilder = <T extends FieldValues = FieldValues>({
  config,
  form,
  onSubmit,
  isLoading = false,
  children,
}: FormBuilderProps<T>) => {
  const handleSubmit = form.handleSubmit(onSubmit);

  const getGridClassName = (columns: number = 1) => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1";
    }
  };

  const renderSections = (sections: typeof config.sections) => {
    if (!sections) return null;

    return sections.map((section, sectionIndex) => (
      <Card key={sectionIndex} className={section.className}>
        {(section.title || section.description) && (
          <CardHeader>
            {section.title && <CardTitle>{section.title}</CardTitle>}
            {section.description && (
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            )}
          </CardHeader>
        )}

        <CardContent>
          <div className={cn("grid gap-4", getGridClassName(section.columns))}>
            {section.fields.map((field, fieldIndex) => (
              <FormField
                key={`${sectionIndex}-${fieldIndex}-${field.name}`}
                config={field}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn("space-y-6", config.className)}
      >
        {/* Form title and description */}
        {(config.title || config.description) && (
          <div className="space-y-2">
            {config.title && (
              <h2 className="text-2xl font-bold tracking-tight">
                {config.title}
              </h2>
            )}
            {config.description && (
              <p className="text-muted-foreground">{config.description}</p>
            )}
          </div>
        )}

        {/* Form content - either tabs or sections */}
        {config.tabs ? (
          <Tabs defaultValue={config.tabs[0]?.id} className="w-full">
            <TabsList
              className="!flex !flex-col xs:!flex-row xs:justify-start h-auto p-1"
              style={{ width: "100%" }}
            >
              {config.tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="w-full xs:w-auto xs:flex-1"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {config.tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                {renderSections(tab.sections)}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          renderSections(config.sections)
        )}

        {/* Custom children content */}
        {children}

        {/* Form actions */}
        {(config.submitButton || config.cancelButton) && (
          <>
            <Separator />
            <div className="flex justify-end space-x-4">
              {config.cancelButton && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={config.cancelButton.onClick}
                  className={config.cancelButton.className}
                  disabled={isLoading}
                >
                  {config.cancelButton.text}
                </Button>
              )}

              {config.submitButton && (
                <Button
                  type="submit"
                  className={config.submitButton.className}
                  disabled={
                    isLoading ||
                    config.submitButton.disabled ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                >
                  {isLoading || config.submitButton.loading
                    ? "Loading..."
                    : config.submitButton.text}
                </Button>
              )}
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
};

export default FormBuilder;
