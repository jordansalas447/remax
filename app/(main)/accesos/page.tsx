import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { AccesosManager } from "./accesos-manager";
import type { AccesoUsuario } from "./types";

export const metadata: Metadata = {
  title: "Control de acceso | RE/MAX Adelante",
  description: "Administra los horarios en los que cada usuario puede ingresar al sistema.",
};

export default async function AccesosPage() {
  await requireRole("admin");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_listar_accesos" as never);
  const usuarios = (data ?? []) as unknown as AccesoUsuario[];

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-4">
      <header className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#003DA5]/10 text-[#003DA5] dark:text-blue-400">
          <Clock className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Control de acceso por horario
          </h1>
          <p className="text-sm text-zinc-500">
            Define los días y horas (zona horaria de Lima) en que cada usuario puede ingresar.
          </p>
        </div>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          No se pudo cargar la lista: {error.message}
        </div>
      ) : (
        <AccesosManager usuarios={usuarios} />
      )}
    </div>
  );
}
