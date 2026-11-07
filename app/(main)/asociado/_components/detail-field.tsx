import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  boldValue?: boolean; // Texto del valor en negrita
  badge?: boolean; // Renderiza el valor dentro de un Badge
  badgeVariant?: React.ComponentProps<typeof Badge>["variant"];
  textColorClass?: string; // Color extra de texto, ej. 'text-red-500'
}

/**
 * Muestra una etiqueta y su valor.
 * - `badge`: renderiza el valor como <Badge /> (color con `badgeVariant`).
 * - `textColorClass`: color de texto adicional.
 * Los textos largos conservan saltos de línea y no desbordan el contenedor.
 */
export function DetailField({
  label,
  value,
  className,
  boldValue = false,
  badge = false,
  badgeVariant,
  textColorClass = "",
}: DetailFieldProps) {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div className={cn("min-w-0 space-y-0.5", className)}>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd
        className={cn(
          "whitespace-pre-wrap break-words text-sm text-zinc-900 dark:text-zinc-100",
          boldValue && "font-semibold",
          isEmpty && "text-zinc-400 dark:text-zinc-600",
          textColorClass
        )}
      >
        {isEmpty ? "—" : badge ? <Badge variant={badgeVariant}>{value}</Badge> : value}
      </dd>
    </div>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // Suma 5 horas para compensar la zona horaria (UTC-5)
  date.setHours(date.getHours() + 5);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}