"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface InputSearchProps<T> {
  className?: string;
  search: string;
  setSearch: (value: string) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  filteredItems: T[];
  loading: boolean;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => number;
  /** Devuelve el texto secundario del ítem (ej: RUC, código). Si no existe, no se muestra nada. */
  getOptionSublabel?: (item: T) => string | undefined;
  inputPlaceholder?: string;
  selectPlaceholder?: string;
}

export function InputSearch<T>({
  className,
  search,
  setSearch,
  selectedId,
  setSelectedId,
  filteredItems,
  loading,
  getOptionLabel,
  getOptionValue,
  getOptionSublabel,
  inputPlaceholder = "Buscar...",
  selectPlaceholder = "Seleccionar",
}: InputSearchProps<T>) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Filtra por texto de búsqueda sobre label Y sublabel
  const options = useMemo(
    () =>
      search.trim() === ""
        ? filteredItems
        : filteredItems.filter((item) => {
            const q = search.trim().toLowerCase();
            const matchLabel = getOptionLabel(item).toLowerCase().includes(q);
            const sublabel = getOptionSublabel?.(item);
            const matchSublabel = sublabel
              ? sublabel.toLowerCase().includes(q)
              : false;
            return matchLabel || matchSublabel;
          }),
    [filteredItems, getOptionLabel, getOptionSublabel, search]
  );

  const selectedItem =
    filteredItems.find((item) => getOptionValue(item) === selectedId) ?? null;

  const selectedLabel = selectedItem ? getOptionLabel(selectedItem) : null;
  const selectedSublabel = selectedItem
    ? getOptionSublabel?.(selectedItem)
    : undefined;

  return (
    <div className={className}>
      {/* <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={inputPlaceholder}
            className="pl-9"
            disabled={loading}
          />
        </div> */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger
          disabled={loading}
          className="
          border-input
          bg-background
          hover:bg-accent
          hover:text-accent-foreground
          flex
          h-9
          w-full
          items-center
          justify-between
          rounded-lg
          border
          px-3
          py-0
          text-sm
          shadow-xs
        "
          aria-expanded={popoverOpen}
          role="combobox">

          <span className="flex min-w-0 flex-col items-start leading-tight">
            {loading ? (
              "Cargando..."
            ) : selectedLabel ? (
              <>
                <span className="truncate">{selectedLabel}</span>
                {selectedSublabel && (
                  <span className="truncate text-xs text-muted-foreground">
                    {selectedSublabel}
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{selectPlaceholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />

        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={inputPlaceholder}
            // Evitamos que sobreescriba el input general si ambos editan a la vez
            // disabled={loading}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? "Cargando..." : "No se encontraron resultados."}
              </CommandEmpty>
              <CommandGroup>
                {options.map((item) => {
                  const value = String(getOptionValue(item));
                  const label = getOptionLabel(item);
                  const sublabel = getOptionSublabel?.(item);
                  const isSelected = selectedId === getOptionValue(item);
                  return (
                    <CommandItem
                      key={value}
                      value={label}
                      onSelect={() => {
                        setSelectedId(getOptionValue(item));
                        setPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex flex-col">
                        <span>{label}</span>
                        {sublabel && (
                          <span className="text-xs text-muted-foreground">
                            {sublabel}
                          </span>
                        )}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}