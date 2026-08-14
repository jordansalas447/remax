"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { es } from "date-fns/locale"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
}

function DatePicker({
  value,
  defaultValue,
  onChange,
  disabled,
  id,
  name,
  required,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Use Date type for internal state to avoid timezone/dst bugs common with yyyy-MM-dd string
  const parseDate = (val?: string) => {
    if (!val) return undefined;
    // Treat as UTC to avoid shifting when parsing from yyyy-MM-dd
    const [year, month, day] = val.split("-").map(Number);
    if (!year || !month || !day) return undefined;
    // Create a local Date with only year, month, day info
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    // Always format as yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Internal state for selected date as Date type
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? parseDate(value) : defaultValue ? parseDate(defaultValue) : undefined
  );

  // Keep internal state in sync with value prop (if it's a controlled component)
  React.useEffect(() => {
    if (value !== undefined) {
      const parsed = parseDate(value);
      // Only update if value changes
      if (
        (!parsed && selectedDate) ||
        (parsed && (!selectedDate || parsed.getTime() !== selectedDate.getTime()))
      ) {
        setSelectedDate(parsed);
      }
    }
    // No console.log in production
  }, [value]); // eslint-disable-line

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const nextValue = date ? formatDate(date) : "";
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground", className)}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, "PPP", { locale: es })
              : "Seleccionar fecha"}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={es}
        />
      </PopoverContent>
      <Input
        id={id}
        name={name}
        type="hidden"
        value={selectedDate ? formatDate(selectedDate) : ""}
        required={required}
      />
    </Popover>
  );
}

export { DatePicker };
