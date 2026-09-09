"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { getTableConfig, type FieldConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";
import { useState, type ReactNode } from "react";
import { InputSearch } from "@/components/input-search/input-search";

export interface FieldInputProps {
  field: FieldConfig;
  value: string | number | boolean | null | undefined;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
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
  const { field, value, options, onChange, onQuickCreate } = props;
  const disabled = Boolean(props.disabled || field.disabled);
  const required = props.required ?? field.required;
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
        required={required}
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

  // Renderiza un InputSearch en vez de NativeSelect si field.type es "inputsearch"
  if (field.type === "inputsearch") {

    const showQuickCreate = !disabled && Boolean(field.foreignKey) && Boolean(onQuickCreate);
    // 'inputValue' contiene el ID seleccionado (como string) que viene del form.
    // 'search' es estado local solo para filtrar; NO se propaga al form.
    // 'onChange' solo se llama al seleccionar un ítem, pasando su ID como string.
    const selectElement = (<InputSearchWrapper
      name={field.name}
      selectedValue={inputValue}
      className={baseClass}
      options={options}
      disabled={disabled}
      placeholder={placeholder}
      label={field.label}
      onChange={onChange}
    />);

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

  if (field.type === "select") {
    const showQuickCreate = !disabled && Boolean(field.foreignKey) && Boolean(onQuickCreate);
    const selectElement = (
      <NativeSelect
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
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
        required={required}
        disabled={disabled}
        className={baseClass}
        dateConstraints={field.dateConstraints}
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
      required={required}
      disabled={disabled}
      className={baseClass}
    />
  );
}

// Wrapper que aísla el estado local de búsqueda del valor del formulario.
// - `selectedValue`: el ID actual como string (viene del form).
// - `onChange`: se llama SOLO al seleccionar un ítem, con el ID (string) del ítem.
// - El texto de búsqueda vive localmente y nunca se propaga al form.
interface InputSearchWrapperProps {
  name: string;
  selectedValue: string;
  className?: string;
  options: SelectOption[];
  disabled: boolean;
  placeholder?: string;
  label?: string;
  onChange?: (val: string) => void;
}

function InputSearchWrapper({
  name,
  selectedValue,
  className,
  options,
  disabled,
  placeholder,
  label,
  onChange,
}: InputSearchWrapperProps) {
  const [search, setSearch] = useState("");

  const selectedId = selectedValue ? Number(selectedValue) : null;

  // Resuelve el label del ítem seleccionado para mostrarlo en modo readonly
  const selectedLabel = options.find(
    (opt) => Number(opt.value) === selectedId
  )?.label ?? "";

  // En modo readonly mostramos un input nativo deshabilitado con el label del ítem,
  // en vez del InputSearch interactivo (que mostraría "Cargando...").
  if (disabled) {
    return (
      <div className={className}>
        <input type="hidden" name={name} value={selectedValue} />
        <input
          type="text"
          value={selectedLabel || placeholder || ""}
          disabled
          readOnly
          className="border-input bg-background flex h-9 w-full rounded-lg border px-3 py-0 text-sm shadow-xs opacity-60 cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Hidden input para que FormData.get(name) devuelva el ID seleccionado al hacer submit */}
      <input type="hidden" name={name} value={selectedValue} />
      <InputSearch
        search={search}
        setSearch={setSearch}
        selectedId={selectedId}
        setSelectedId={(id: number | null) => {
          onChange?.(id !== null ? String(id) : "");
        }}
        filteredItems={options}
        loading={false}
        getOptionLabel={(option: SelectOption) => option.label}
        getOptionValue={(option: SelectOption) => Number(option.value)}
        inputPlaceholder={placeholder || "Buscar..."}
        selectPlaceholder={label || "Seleccionar"}
      />
    </div>
  );
}
