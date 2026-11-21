type FechaFormato = "date" | "datetime" | "long" | "auto";

export function fechaPeru(
  valor: string | Date | null | undefined,
  formato: FechaFormato = "auto"
): string {
  if (!valor) return "";

  // DATE puro: no convertir zona horaria para evitar cambio de día
  const esFechaPura =
    typeof valor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(valor);

  const tieneHora =
    valor instanceof Date ||
    (typeof valor === "string" && /[T ]\d{2}:\d{2}/.test(valor));

  let date: Date;

  if (esFechaPura) {
    date = new Date(`${valor}T12:00:00`);
  } else {
    const normalizado =
      typeof valor === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(valor) &&
      !/(Z|[+-]\d{2}:\d{2})$/.test(valor)
        ? `${valor}Z`
        : valor;

    date = normalizado instanceof Date
      ? normalizado
      : new Date(normalizado);
  }

  if (isNaN(date.getTime())) return "";

  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: "America/Lima",
  };

  switch (formato) {
    case "date":
      opciones.day = "2-digit";
      opciones.month = "2-digit";
      opciones.year = "numeric";
      break;

    case "datetime":
      opciones.day = "2-digit";
      opciones.month = "2-digit";
      opciones.year = "numeric";
      opciones.hour = "2-digit";
      opciones.minute = "2-digit";
      opciones.second = "2-digit";
      opciones.hourCycle = "h23";
      break;

    case "long":
      opciones.weekday = "long";
      opciones.day = "numeric";
      opciones.month = "long";
      opciones.year = "numeric";
      break;

    case "auto":
      opciones.day = "2-digit";
      opciones.month = "2-digit";
      opciones.year = "numeric";

      if (tieneHora) {
        opciones.hour = "2-digit";
        opciones.minute = "2-digit";
        opciones.second = "2-digit";
        opciones.hourCycle = "h23";
      }
      break;
  }

  return new Intl.DateTimeFormat("es-PE", opciones).format(date);
}