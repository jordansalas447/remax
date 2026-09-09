"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { Matcher } from "react-day-picker";

import { es } from "date-fns/locale"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateConstraints } from "@/lib/crud/types";

export interface DatePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  /** Restricciones de selección de fecha. Ver {@link DateConstraints}. */
  dateConstraints?: DateConstraints;
}

/**
 * Convierte una DateConstraints en un array de Matchers de react-day-picker.
 * Un Matcher que devuelve `true` (o coincide) deshabilita el día.
 */
function buildDisabledMatchers(c: DateConstraints): Matcher[] {
  const matchers: Matcher[] = [];

  const parseYMD = (val: string): Date => {
    const [y, m, d] = val.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };

  const resolveDate = (val: string | (() => string)): Date =>
    parseYMD(typeof val === "function" ? val() : val);

  // allowedDates tiene prioridad máxima: solo esas fechas están habilitadas
  if (c.allowedDates && c.allowedDates.length > 0) {
    const allowed = new Set(c.allowedDates);
    const toKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    matchers.push((date: Date) => !allowed.has(toKey(date)));
  } else {
    // minDate → deshabilita todo lo anterior al mínimo
    if (c.minDate) {
      const min = resolveDate(c.minDate);
      // "before" matcher: deshabilita días anteriores a min
      matchers.push({ before: min });
    }

    // maxDate → deshabilita todo lo posterior al máximo
    if (c.maxDate) {
      const max = resolveDate(c.maxDate);
      matchers.push({ after: max });
    }

    // allowedWeekdays → deshabilita los días NO incluidos en la lista
    if (c.allowedWeekdays && c.allowedWeekdays.length > 0) {
      const allowed = new Set(c.allowedWeekdays);
      matchers.push((date: Date) => !allowed.has(date.getDay()));
    }
  }

  // disabledDates → siempre deshabilita esas fechas exactas (acumulativo)
  if (c.disabledDates && c.disabledDates.length > 0) {
    matchers.push(...c.disabledDates.map((s) => parseYMD(s)));
  }

  return matchers;
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
  dateConstraints,
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

  // Build disabled matchers from dateConstraints (memoized to avoid recalculating every render)
  const disabledMatchers = React.useMemo<Matcher | Matcher[] | undefined>(() => {
    if (!dateConstraints) return undefined;
    const matchers = buildDisabledMatchers(dateConstraints);
    if (matchers.length === 0) return undefined;
    return matchers.length === 1 ? matchers[0] : matchers;
  }, [dateConstraints]); // eslint-disable-line

  // react-day-picker v10: captionLayout="dropdown" requires startMonth and endMonth
  // to populate the month/year dropdowns. Derive from dateConstraints when available.
  const parseYMD = (val: string | (() => string)): Date => {
    const s = typeof val === "function" ? val() : val;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };

  const calendarStartMonth = React.useMemo(() => {
    if (dateConstraints?.minDate) return parseYMD(dateConstraints.minDate);
    const d = new Date();
    d.setFullYear(d.getFullYear() - 60);
    d.setMonth(0, 1);
    return d;
  }, [dateConstraints?.minDate]); // eslint-disable-line

  const calendarEndMonth = React.useMemo(() => {
    if (dateConstraints?.maxDate) return parseYMD(dateConstraints.maxDate);
    const d = new Date();
    d.setFullYear(d.getFullYear() + 20);
    d.setMonth(11, 31);
    return d;
  }, [dateConstraints?.maxDate]); // eslint-disable-line

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
            size="lg"
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
          captionLayout="dropdown"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={es}
          disabled={disabledMatchers}
          startMonth={calendarStartMonth}
          endMonth={calendarEndMonth}
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
