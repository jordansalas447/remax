import { cn } from "@/lib/utils";
import { Badge, type badgeVariants } from "@/components/ui/badge";

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  boldValue?: boolean; // Permite configurar si el texto debe ir en negrita
  badge?: boolean; // Nuevo prop para renderizar el valor en un Badge
  badgeVariant?: React.ComponentProps<typeof Badge>["variant"]; // Fix: use correct type for variant
  textColorClass?: string; // Nueva prop para color de texto extra, ej. 'text-red-500'
}

/**
 * Si la prop `badge` está activa, renderiza el valor como un <Badge />.
 * Permite customizar el color utilizando el prop `badgeVariant`.
 * Permite customizar el color del texto con textColorClass.
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
  return (
    <div className={cn("space-y-1", className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm text-zinc-900 dark:text-zinc-100",
          boldValue && "font-semibold",
          textColorClass
        )}
      >
        {badge ? (
          <Badge variant={badgeVariant}>
            {value ?? "—"}
          </Badge>
        ) : (
          value ?? "—"
        )}
      </dd>
    </div>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // Resta 5 horas (en milisegundos: 5 * 60 * 60 * 1000)
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
