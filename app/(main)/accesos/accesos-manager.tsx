"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Ban,
  CalendarClock,
  KeyRound,
  Mail,
  Pencil,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { guardarAcceso } from "./actions";
import {
  cambiarBaneo,
  enviarMagicLink,
  enviarResetPassword,
  invitarUsuario,
  type UserActionResult,
} from "./user-actions";
import { DIAS_CORTOS, DIAS_SEMANA, type AccesoUsuario, type HorarioDia } from "./types";

type FilaDia = { habilitado: boolean; hora_inicio: string; hora_fin: string };
type Filas = Record<number, FilaDia>;

const HORARIO_POR_DEFECTO = { hora_inicio: "08:00", hora_fin: "18:00" };

function filasDesde(horarios: HorarioDia[]): Filas {
  const filas: Filas = {};
  for (const d of DIAS_SEMANA) {
    const h = horarios.find((x) => x.dia_semana === d.value);
    filas[d.value] = h
      ? { habilitado: h.activo, hora_inicio: h.hora_inicio, hora_fin: h.hora_fin }
      : { habilitado: false, ...HORARIO_POR_DEFECTO };
  }
  return filas;
}

function resumen(horarios: HorarioDia[]) {
  return horarios
    .filter((h) => h.activo)
    .sort((a, b) => ((a.dia_semana + 6) % 7) - ((b.dia_semana + 6) % 7));
}

export function AccesosManager({ usuarios }: { usuarios: AccesoUsuario[] }) {
  const [query, setQuery] = useState("");
  const [editando, setEditando] = useState<AccesoUsuario | null>(null);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) =>
      [u.full_name, u.email, u.role].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [usuarios, query]);

  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [invitando, setInvitando] = useState(false);
  const [pending, startAction] = useTransition();

  const ejecutar = (fn: () => Promise<UserActionResult>) => {
    setAviso(null);
    startAction(async () => {
      const res = await fn();
      setAviso(res.ok ? { ok: true, texto: res.message } : { ok: false, texto: res.error });
    });
  };

  return (
    <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              id="accesos-buscar"
              placeholder="Buscar por nombre, correo o rol…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button id="accesos-invitar" onClick={() => setInvitando(true)}>
            <UserPlus /> Invitar usuario
          </Button>
        </div>

        {aviso && (
          <p
            role="status"
            className={`rounded-lg p-2 text-sm ${aviso.ok
                ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
              }`}
          >
            {aviso.texto}
          </p>
        )}
        {invitando && (
          <InvitarDialog
            onClose={() => setInvitando(false)}
            onDone={(m) => setAviso({ ok: true, texto: m })}
          />
        )}

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtrados.length === 0 && (
              <li className="p-6 text-center text-sm text-zinc-500">No se encontraron usuarios.</li>
            )}
            {filtrados.map((u) => {
              const dias = resumen(u.horarios);
              return (
                <li
                  key={u.user_id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium text-zinc-900 dark:text-white">
                      {u.full_name || u.email}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {u.email} · <span className="capitalize">{u.role ?? "sin rol"}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dias.length === 0 ? (
                        <span className="text-xs text-zinc-400">Sin horario asignado</span>
                      ) : (
                        dias.map((h) => (
                          <Badge key={h.dia_semana} variant="gray">
                            {DIAS_CORTOS[h.dia_semana]} {h.hora_inicio}–{h.hora_fin}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {u.baneado && (
                        <Badge variant="red">
                          <Ban /> Baneado
                        </Badge>
                      )}
                      {u.activo ? (
                        <Badge variant="green">
                          <ShieldCheck /> Habilitado
                        </Badge>
                      ) : (
                        <Badge variant="red">
                          <ShieldOff /> Bloqueado
                        </Badge>
                      )}
                      <Button
                        id={`accesos-editar-${u.user_id}`}
                        variant="outline"
                        onClick={() => setEditando(u)}
                      >
                        <Pencil /> Editar
                      </Button>
                      {u.email && (
                        <>
                          <Button
                            id={`accesos-reset-${u.user_id}`}
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            title="Enviar enlace para restablecer contraseña"
                            onClick={() => ejecutar(() => enviarResetPassword(u.email!))}
                          >
                            <KeyRound /> Reset
                          </Button>
                          <Button
                            id={`accesos-magic-${u.user_id}`}
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            title="Enviar magic link"
                            onClick={() => ejecutar(() => enviarMagicLink(u.email!))}
                          >
                            <Mail /> Magic link
                          </Button>
                        </>
                      )}
                      <Button
                        id={`accesos-ban-${u.user_id}`}
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        title={u.baneado ? "Desbanear usuario" : "Banear usuario"}
                        onClick={() => {
                          const accion = u.baneado ? "desbanear" : "banear";
                          if (confirm(`¿Seguro que deseas ${accion} a ${u.full_name || u.email}?`)) {
                            ejecutar(() => cambiarBaneo(u.user_id, !u.baneado));
                          }
                        }}
                      >
                        {u.baneado ? <UserCheck /> : <Ban />} {u.baneado ? "Desbanear" : "Banear"}
                      </Button>
                    </div>
                </li>
              );
            })}
          </ul>
        </div>

        {editando && (
          <EditarAccesoDialog key={editando.user_id} usuario={editando} onClose={() => setEditando(null)} />
        )}
    </section>
  );
}

function EditarAccesoDialog({ usuario, onClose }: { usuario: AccesoUsuario; onClose: () => void }) {
  const [activo, setActivo] = useState(usuario.activo);
  const [filas, setFilas] = useState<Filas>(() => filasDesde(usuario.horarios));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const actualizar = (dia: number, cambios: Partial<FilaDia>) =>
    setFilas((prev) => ({ ...prev, [dia]: { ...prev[dia], ...cambios } }));

  const copiarLunesALaSemana = () =>
    setFilas((prev) => {
      const base = prev[1];
      const next = { ...prev };
      for (const d of [2, 3, 4, 5]) {
        next[d] = { habilitado: base.habilitado, hora_inicio: base.hora_inicio, hora_fin: base.hora_fin };
      }
      return next;
    });

  const guardar = () => {
    setError(null);
    const horarios: HorarioDia[] = DIAS_SEMANA.flatMap((d) => {
      const f = filas[d.value];
      return f.habilitado
        ? [{ dia_semana: d.value, hora_inicio: f.hora_inicio, hora_fin: f.hora_fin, activo: true }]
        : [];
    });

    for (const h of horarios) {
      if (!h.hora_inicio || !h.hora_fin || h.hora_inicio >= h.hora_fin) {
        setError("En cada día habilitado, la hora de inicio debe ser menor que la de fin.");
        return;
      }
    }

    startTransition(async () => {
      const res = await guardarAcceso(usuario.user_id, activo, horarios);
      if (res.ok) onClose();
      else setError(res.error);
    });
  };

  return (
    <Dialog open preventOutsideClose={false} onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="size-4" /> Horario de acceso
          </DialogTitle>
          <DialogDescription>
            {usuario.full_name || usuario.email}. Horas en zona horaria de Lima. Al guardar, el usuario
            deberá iniciar sesión nuevamente.
          </DialogDescription>
        </DialogHeader>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
          <span>
            <span className="block font-medium">Acceso habilitado</span>
            <span className="block text-xs text-zinc-500">
              Si se desactiva, el usuario no podrá ingresar en ningún horario.
            </span>
          </span>
          <input
            id="accesos-activo"
            type="checkbox"
            className="size-4 accent-[#003DA5]"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
        </label>

        <div className="space-y-2">
          {DIAS_SEMANA.map((d) => {
            const f = filas[d.value];
            return (
              <div key={d.value} className="grid grid-cols-[7rem_1fr_1fr] items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    id={`accesos-dia-${d.value}`}
                    type="checkbox"
                    className="size-4 accent-[#003DA5]"
                    checked={f.habilitado}
                    onChange={(e) => actualizar(d.value, { habilitado: e.target.checked })}
                  />
                  {d.label}
                </label>
                <Input
                  id={`accesos-inicio-${d.value}`}
                  type="time"
                  aria-label={`Hora de inicio ${d.label}`}
                  disabled={!f.habilitado}
                  value={f.hora_inicio}
                  onChange={(e) => actualizar(d.value, { hora_inicio: e.target.value })}
                />
                <Input
                  id={`accesos-fin-${d.value}`}
                  type="time"
                  aria-label={`Hora de fin ${d.label}`}
                  disabled={!f.habilitado}
                  value={f.hora_fin}
                  onChange={(e) => actualizar(d.value, { hora_fin: e.target.value })}
                />
              </div>
            );
          })}
          <Button type="button" variant="ghost" size="sm" onClick={copiarLunesALaSemana}>
            Copiar horario del lunes a martes–viernes
          </Button>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button id="accesos-cancelar" variant="outline" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button id="accesos-guardar" onClick={guardar} disabled={pending}>
            {pending ? "Guardando…" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InvitarDialog({ onClose, onDone }: { onClose: () => void; onDone: (msg: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const enviar = (fd: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await invitarUsuario({
        email: String(fd.get("email") ?? ""),
        nombre: String(fd.get("nombre") ?? ""),
        apellido_paterno: String(fd.get("apellido_paterno") ?? ""),
        apellido_materno: String(fd.get("apellido_materno") ?? ""),
      });
      if (res.ok) {
        onDone(res.message);
        onClose();
      } else setError(res.error);
    });
  };

  return (
    <Dialog open preventOutsideClose={false} onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4" /> Invitar usuario
          </DialogTitle>
          <DialogDescription>
            Se enviar� un correo de invitaci�n para que cree su contrase�a.
          </DialogDescription>
        </DialogHeader>
        <form action={enviar} className="space-y-3">
          <Input id="invitar-email" name="email" type="email" required placeholder="Correo" />
          <Input id="invitar-nombre" name="nombre" required placeholder="Nombre" />
          <Input id="invitar-ap" name="apellido_paterno" placeholder="Apellido paterno" />
          <Input id="invitar-am" name="apellido_materno" placeholder="Apellido materno" />
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancelar
            </Button>
            <Button id="invitar-enviar" type="submit" disabled={pending}>
              {pending ? "Enviando�" : "Enviar invitaci�n"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
