const MS_PER_DAY = 1000 * 60 * 60 * 24;

type FechasContrato = {
  fecha_contrato_recibido?: string | null;
  fecha_contrato_entregado?: string | null;
  fecha_contrato_sigi?: string | null;
};

function toDate(value?: string | null): Date | null {
  return value ? new Date(value) : null;
}

function toUtcDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function diferenciaDias(inicio: Date | null, fin: Date | null): number | null {
  if (!inicio || !fin) return null;
  return Math.round((fin.getTime() - inicio.getTime()) / MS_PER_DAY);
}

function diasDesde(fecha: Date | null, hasta: Date = new Date()): number | null {
  if (!fecha) return null;
  return Math.round((toUtcDay(hasta) - toUtcDay(fecha)) / MS_PER_DAY);
}

/** Días entre contrato recibido y contrato entregado. */
export function calcularDiferenciaDias(contrato: FechasContrato): number | null {
  return diferenciaDias(
    toDate(contrato.fecha_contrato_recibido),
    toDate(contrato.fecha_contrato_entregado),
  );
}

/** Días entre contrato entregado y fecha SIGI. */
export function calcularDiferenciaDiasSigi(contrato: FechasContrato): number | null {
  return diferenciaDias(
    toDate(contrato.fecha_contrato_recibido),
    toDate(contrato.fecha_contrato_sigi),
  );
}

/** Días transcurridos desde la fecha de entrega hasta hoy. */
export function calcularDiasDesdeEntregado(contrato: FechasContrato): number | null {
  return diasDesde(toDate(contrato.fecha_contrato_entregado));
}

/** Días transcurridos desde la fecha de entrega (entrada) hasta hoy. */
export function calcularDiasDesdeEntrada(contrato: FechasContrato): number | null {
  return diasDesde(toDate(contrato.fecha_contrato_entregado));
}
