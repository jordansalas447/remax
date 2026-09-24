"use client";

import { FieldInput } from "@/components/crud/fields/FieldInput";
import type { FieldConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";

export function FormField({
  field,
  value,
  options,
  disabled,
  required,
  htmlName,
  htmlId,
  onChange,
  onQuickCreate,
}: {
  field: FieldConfig;
  value: string | number | boolean | null | undefined;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  htmlName?: string;
  htmlId?: string;
  onChange?: (val: string) => void;
  onQuickCreate?: (field: FieldConfig) => void;
}) {
  const isRequired = required ?? field.required;
  const inputId = htmlId ?? field.name;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {field.label}
        {isRequired && !disabled ? (
          <span className="text-red-600"> *</span>
        ) : ""}
      </label>
 
      {field.ui?.description ? (
        <p className="mb-1.5 text-xs text-zinc-500 dark:text-zinc-400">{field.ui.description}</p>
      ) : null}
      <FieldInput
        field={field}
        value={value}
        options={options}
        disabled={disabled}
        required={isRequired}
        htmlName={htmlName}
        htmlId={inputId}
        onChange={onChange}
        onQuickCreate={onQuickCreate}
      />
    </div>
  );
}
