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
  search: string;
  setSearch: (value: string) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  filteredItems: T[];
  loading: boolean;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => number;
  inputPlaceholder?: string;
  selectPlaceholder?: string;
}

export function InputSearch<T>({
  search,
  setSearch,
  selectedId,
  setSelectedId,
  filteredItems,
  loading,
  getOptionLabel,
  getOptionValue,
  inputPlaceholder = "Buscar...",
  selectPlaceholder = "Seleccionar",
}: InputSearchProps<T>) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Filtra por el texto de búsqueda sobre 'getOptionLabel'
  const options = useMemo(
    () =>
      search.trim() === ""
        ? filteredItems
        : filteredItems.filter((item) =>
          getOptionLabel(item)
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        ),
    [filteredItems, getOptionLabel, search]
  );

  const selectedItem =
    filteredItems.find((item) => getOptionValue(item) === selectedId) ?? null;

  return (
    <div>
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
          rounded-md
          border
          px-3
          py-2
          text-sm
          shadow-xs
        "
          aria-expanded={popoverOpen}
          role="combobox">

          {loading
            ? "Cargando..."
            : selectedItem
              ? getOptionLabel(selectedItem)
              : selectPlaceholder}
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
                  return (
                    <CommandItem
                      key={value}
                      value={getOptionLabel(item)}
                      onSelect={() => {
                        setSelectedId(getOptionValue(item));
                        setPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedId === getOptionValue(item)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {getOptionLabel(item)}
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