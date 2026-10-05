"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { FormField } from "@/components/crud/FormField";
import { FormSection } from "@/components/crud/FormSection";
import { DetailsRepeater } from "@/components/crud/DetailsRepeater";
import { buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { resolveFieldState } from "@/lib/crud/rules";
import type { FieldConfig, TableConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";
import type { FormColumns, FormLayout, FormSectionConfig } from "@/lib/crud/types";
import type { DetailRow } from "@/lib/crud/details";
import type { TableName } from "@/lib/types/database";

type FormMode = "create" | "edit";

interface DynamicFormProps {
  config: TableConfig;
  mode: FormMode;
  values: Record<string, string | number | boolean | null | undefined>;
  options: Record<string, SelectOption[]>;
  details?: Record<string, DetailRow[]>;
  detailOptions?: Record<string, Record<string, SelectOption[]>>;
  onChange: (fieldName: string, value: string) => void;
  onDetailChange?: (name: string, rows: DetailRow[]) => void;
  onQuickCreate: (field: FieldConfig, sourceTable?: TableName) => void;
  onDetailQuickCreate?: (collection: string, index: number, field: FieldConfig) => void;
}

interface ResolvedSection {
  title?: string;
  description?: string;
  columns: FormColumns;
  layout?: FormLayout;
  fields: FieldConfig[];
  collapsedFields: FieldConfig[];
  allDisabled?: boolean;
}

function fieldByName(config: TableConfig, name: string): FieldConfig | undefined {
  return config.fields.find((field) => field.name === name);
}

function shouldSkipField(field: FieldConfig, config: TableConfig, mode: FormMode): boolean {
  return resolveFieldState(config, field, mode).hidden;
}

function isFieldDisabled(
  config: TableConfig,
  field: FieldConfig,
  mode: FormMode,
  values: DynamicFormProps["values"],
  allDisabled?: boolean,
): boolean {
  return allDisabled || resolveFieldState(config, field, mode, values).disabled;
}

function hasFilledValue(value: DynamicFormProps["values"][string]): boolean {
  return value !== null && value !== undefined && value !== "";
}

function splitCollapsed(fields: FieldConfig[]): {
  fields: FieldConfig[];
  collapsedFields: FieldConfig[];
} {
  return {
    fields: fields.filter((field) => !field.collapsedInForm),
    collapsedFields: fields.filter((field) => field.collapsedInForm),
  };
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
    return form.sections.map((section: FormSectionConfig) => {
      const split = splitCollapsed(resolveFields(section.fields, config, mode));
      return {
        title: section.title,
        description: section.description,
        columns: section.columns ?? defaultColumns,
        layout: section.layout ?? defaultLayout,
        ...split,
      };
    });
  }

  if (form?.fields?.length) {
    return [
      {
        columns: defaultColumns,
        layout: defaultLayout,
        ...splitCollapsed(resolveFields(form.fields, config, mode)),
      },
    ];
  }

  const editable = config.fields.filter((field) => {
    if (shouldSkipField(field, config, mode)) return false;
    if (mode === "edit" && field.readOnlyOnEdit) return false;
    return true;
  });

  const readOnly =
    mode === "edit"
      ? config.fields.filter((field) => field.readOnlyOnEdit && !shouldSkipField(field, config, mode))
      : [];

  const sections: ResolvedSection[] = [
    {
      columns: defaultColumns,
      layout: defaultLayout,
      ...splitCollapsed(editable),
    },
  ];

  if (readOnly.length > 0) {
    const split = splitCollapsed(readOnly);
    sections.push({
      columns: 1,
      layout: "stack",
      allDisabled: true,
      ...split,
    });
  }

  return sections;
}

function SectionFields({
  config,
  mode,
  values,
  options,
  fields,
  allDisabled,
  onChange,
  onQuickCreate,
}: {
  config: TableConfig;
  mode: FormMode;
  values: DynamicFormProps["values"];
  options: DynamicFormProps["options"];
  fields: FieldConfig[];
  allDisabled?: boolean;
  onChange: DynamicFormProps["onChange"];
  onQuickCreate: DynamicFormProps["onQuickCreate"];
}) {
  return (
    <>
      {fields.map((field) => {
        const state = resolveFieldState(config, field, mode, values);
        if (state.hidden) return null;
        const disabled = isFieldDisabled(config, field, mode, values, allDisabled);
        return (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            options={options[field.name] ?? []}
            disabled={disabled}
            required={state.required}
            onChange={(val) => onChange(field.name, val)}
            onQuickCreate={disabled ? undefined : onQuickCreate}
          />
        );
      })}
    </>
  );
}

function CollapsedFields({
  label,
  defaultOpen,
  children,
}: {
  label: string;
  defaultOpen: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
      className="col-span-full"
    >
      <CollapsibleTrigger
        type="button"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-between border border-gray-200 rounded-lg py-4")}
      >
        <span>{open ? "Ocultar campos adicionales" : label}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function DynamicForm({
  config,
  mode,
  values,
  options,
  details,
  detailOptions,
  onChange,
  onDetailChange,
  onQuickCreate,
  onDetailQuickCreate,
}: DynamicFormProps) {
  const sections = resolveSections(config, mode).filter(
    (section) => section.fields.length > 0 || section.collapsedFields.length > 0,
  );
  const detailCollections = config.details ?? [];
  const collapsedLabel = config.form?.collapsedFieldsLabel ?? "Más campos";

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
          <SectionFields
            config={config}
            mode={mode}
            values={values}
            options={options}
            fields={section.fields}
            allDisabled={section.allDisabled}
            onChange={onChange}
            onQuickCreate={onQuickCreate}
          />
          {section.collapsedFields.length > 0 ? (
            <CollapsedFields      
              label={collapsedLabel}
              defaultOpen={section.collapsedFields.some((field) =>
                hasFilledValue(values[field.name]),
              )}
            >
              <FormSection columns={section.columns} layout={section.layout}>
                <SectionFields
                  config={config}
                  mode={mode}
                  values={values}
                  options={options}
                  fields={section.collapsedFields}
                  allDisabled={section.allDisabled}
                  onChange={onChange}
                  onQuickCreate={onQuickCreate}
                />
              </FormSection>
            </CollapsedFields>
          ) : null}
        </FormSection>
      ))}

      {detailCollections.map((detail) => (
        <DetailsRepeater
          key={detail.name}
          detail={detail}
          rows={details?.[detail.name] ?? []}
          options={detailOptions?.[detail.name] ?? {}}
          onChange={(rows) => onDetailChange?.(detail.name, rows)}
          onQuickCreate={
            onDetailQuickCreate
              ? (field, index) => onDetailQuickCreate(detail.name, index, field)
              : undefined
          }
        />
      ))}
    </div>
  );
}
