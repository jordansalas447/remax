"use client";

import { FormField } from "@/components/crud/FormField";
import { FormSection } from "@/components/crud/FormSection";
import { isAutoIncrementField } from "@/lib/crud/utils";
import type { FieldConfig, TableConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";
import type { FormColumns, FormLayout, FormSectionConfig } from "@/lib/crud/types";

type FormMode = "create" | "edit";

interface DynamicFormProps {
  config: TableConfig;
  mode: FormMode;
  values: Record<string, string | number | boolean | null | undefined>;
  options: Record<string, SelectOption[]>;
  onChange: (fieldName: string, value: string) => void;
  onQuickCreate: (field: FieldConfig) => void;
}

interface ResolvedSection {
  title?: string;
  description?: string;
  columns: FormColumns;
  layout?: FormLayout;
  fields: FieldConfig[];
  allDisabled?: boolean;
}

function fieldByName(config: TableConfig, name: string): FieldConfig | undefined {
  return config.fields.find((field) => field.name === name);
}

function shouldSkipField(field: FieldConfig, config: TableConfig, mode: FormMode): boolean {
  return mode === "create" && isAutoIncrementField(field, config);
}

function resolveFields(
  names: string[],
  config: TableConfig,
  mode: FormMode,
): FieldConfig[] {
  return names
    .map((name) => fieldByName(config, name))
    .filter((field): field is FieldConfig => {
      if (!field) return false;
      return !shouldSkipField(field, config, mode);
    });
}

function resolveSections(config: TableConfig, mode: FormMode): ResolvedSection[] {
  const form = config.form;
  const defaultColumns: FormColumns = form?.columns ?? 1;
  const defaultLayout = form?.layout;

  if (form?.sections?.length) {
    return form.sections.map((section: FormSectionConfig) => ({
      title: section.title,
      description: section.description,
      columns: section.columns ?? defaultColumns,
      layout: section.layout ?? defaultLayout,
      fields: resolveFields(section.fields, config, mode),
    }));
  }

  if (form?.fields?.length) {
    return [
      {
        columns: defaultColumns,
        layout: defaultLayout,
        fields: resolveFields(form.fields, config, mode),
      },
    ];
  }

  const editable = config.fields.filter((field) => {
    if (shouldSkipField(field, config, mode)) return false;
    if (mode === "edit" && field.readOnlyOnEdit) return false;
    return true;
  });

  const readOnly =
    mode === "edit" ? config.fields.filter((field) => field.readOnlyOnEdit) : [];

  const sections: ResolvedSection[] = [
    {
      columns: defaultColumns,
      layout: defaultLayout,
      fields: editable,
    },
  ];

  if (readOnly.length > 0) {
    sections.push({
      columns: 1,
      layout: "stack",
      fields: readOnly,
      allDisabled: true,
    });
  }

  return sections;
}

export function DynamicForm({
  config,
  mode,
  values,
  options,
  onChange,
  onQuickCreate,
}: DynamicFormProps) {
  const sections = resolveSections(config, mode).filter((section) => section.fields.length > 0);

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <FormSection
          key={section.title ?? `section-${index}`}
          title={section.title}
          description={section.description}
          columns={section.columns}
          layout={section.layout}
        >
          {section.fields.map((field) => {
            const disabled = Boolean(section.allDisabled || (mode === "edit" && field.readOnlyOnEdit));
            return (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                options={options[field.name] ?? []}
                disabled={disabled}
                onChange={(val) => onChange(field.name, val)}
                onQuickCreate={disabled ? undefined : onQuickCreate}
              />
            );
          })}
        </FormSection>
      ))}
    </div>
  );
}
