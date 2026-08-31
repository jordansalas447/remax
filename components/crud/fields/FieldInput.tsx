"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { getTableConfig, type FieldConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";
import type { ReactNode } from "react";

export interface FieldInputProps {
  field: FieldConfig;
  value: string | number | boolean | null | undefined;
  options: SelectOption[];
  disabled?: boolean;
  onChange?: (val: string) => void;
  onQuickCreate?: (field: FieldConfig) => void;
}

export type CustomFieldRenderer = (props: FieldInputProps) => ReactNode;

const customFieldRenderers: Record<string, CustomFieldRenderer> = {};

export function registerCustomField(key: string, renderer: CustomFieldRenderer) {
  customFieldRenderers[key] = renderer;
}

function normalizeInputValue(field: FieldConfig, value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) return "";

  if (field.type === "date") {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return "";
      const datePart = trimmed.includes("T") ? trimmed.split("T")[0] : trimmed;
      const normalized = datePart.includes(" ") ? datePart.split(" ")[0] : datePart;
      if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
      return "";
    }
    return String(value);
  }

  return String(value);
}

export function FieldInput(props: FieldInputProps) {
  const { field, value, options, disabled, onChange, onQuickCreate } = props;
  const baseClass = "w-full";
  const inputValue = normalizeInputValue(field, value);
  const placeholder = field.ui?.placeholder;

  if (field.type === "custom") {
    const renderer = field.ui?.component ? customFieldRenderers[field.ui.component] : undefined;
    if (renderer) return renderer(props);
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        id={field.name}
        name={field.name}
        rows={3}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <NativeSelect
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={baseClass}
      >
        <option value="false">No</option>
        <option value="true">Sí</option>
      </NativeSelect>
    );
  }

  if (field.type === "select") {
    const showQuickCreate = !disabled && Boolean(field.foreignKey) && Boolean(onQuickCreate);
    const selectElement = (
      <NativeSelect
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      >
        <option value="">Seleccionar…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    );

    if (showQuickCreate && field.selectplus !== false) {
      const targetTableConfig = field.foreignKey ? getTableConfig(field.foreignKey.table) : null;
      const targetLabel = targetTableConfig?.label ?? field.label;
      return (
        <div className="flex items-center gap-2">
          {selectElement}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onQuickCreate?.(field)}
            title={`Crear nuevo (${targetLabel})`}
            className="shrink-0 border-zinc-300 dark:border-zinc-700 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            <Plus className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </div>
      );
    }

    return selectElement;
  }

  if (field.type === "date") {
    return (
      <DatePicker
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(newDate) => onChange?.(newDate)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      />
    );
  }

  return (
    <Input
      id={field.name}
      name={field.name}
      type={field.type === "number" ? "number" : "text"}
      step={field.type === "number" ? "any" : undefined}
      value={inputValue}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      required={field.required}
      disabled={disabled}
      className={baseClass}
    />
  );
}
