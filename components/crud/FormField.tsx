"use client";

import { FieldInput } from "@/components/crud/fields/FieldInput";
import type { FieldConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";

export function FormField({
  field,
  value,
  options,
  disabled,
  onChange,
  onQuickCreate,
}: {
  field: FieldConfig;
  value: string | number | boolean | null | undefined;
  options: SelectOption[];
  disabled?: boolean;
  onChange?: (val: string) => void;
  onQuickCreate?: (field: FieldConfig) => void;
}) {
  return (
    <div>
      <label
        htmlFor={field.name}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {field.label}
        {field.required && !disabled ? " *" : ""}
      </label>
      {field.ui?.description ? (
        <p className="mb-1.5 text-xs text-zinc-500 dark:text-zinc-400">{field.ui.description}</p>
      ) : null}
      <FieldInput
        field={field}
        value={value}
        options={options}
        disabled={disabled}
        onChange={onChange}
        onQuickCreate={onQuickCreate}
      />
    </div>
  );
}
