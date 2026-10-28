export type HorarioDia = {
  dia_semana: number; // 0 = domingo … 6 = sábado (igual que EXTRACT(DOW))
  hora_inicio: string; // "HH:MM"
  hora_fin: string; // "HH:MM"
  activo: boolean;
};

export type AccesoUsuario = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  activo: boolean;
  horarios: HorarioDia[];
};

export const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
] as const;

export const DIAS_CORTOS: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};
