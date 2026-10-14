import type { Propietario } from "./types";

export const val = (value: string | undefined, blank: string) =>
  value && value.trim() !== "" ? value : blank;

export function listaPropietarios(
  nroPropietarios: number | undefined,
  propietarios?: Propietario[]
): { varios: number; lista: Propietario[] } {
  const varios = nroPropietarios || 1;
  const lista =
    propietarios && propietarios.length > 0
      ? propietarios
      : Array.from({ length: varios }, () => ({}));
  return { varios, lista };
}
