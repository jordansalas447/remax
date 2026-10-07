import type { Metadata } from "next";
import { CalendarCheck, KeyRound, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { getDisplayName, getInitials, requireSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { PasswordForm, PersonaForm, type PersonaFormValues } from "./profile-forms";

export const metadata: Metadata = {
  title: "Mi perfil | RE/MAX Adelante",
  description: "Administra tus datos personales y la seguridad de tu cuenta.",
};

const formatDate = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat("es-PE", { dateStyle: "long" }).format(new Date(iso)) : "—";

export default async function PerfilPage() {
  const session = await requireSession();
  const { user, profile, persona } = session;
  const name = getDisplayName(session);
  const email = user.email ?? profile?.email ?? "";

  const initial: PersonaFormValues = {
    nombre: persona?.nombre ?? "",
    apellido_paterno: persona?.apellido_paterno ?? "",
    apellido_materno: persona?.apellido_materno ?? "",
    documento_identidad: persona?.documento_identidad ?? "",
    fecha_nacimiento: persona?.fecha_nacimiento?.slice(0, 10) ?? "",
    numero_telefono: persona?.numero_telefono ?? "",
    numero_telefono_2: persona?.numero_telefono_2 ?? "",
    correo_electronico_2: persona?.correo_electronico_2 ?? "",
    direccion: persona?.direccion ?? "",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-4">
      {/* Cabecera */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#003DA5] via-[#0a2f7a] to-[#0a1f4d] p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-[#DC1C2E]/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {persona?.url_foto ? (
              <img
                src={persona.url_foto}
                alt={name}
                className="size-20 rounded-2xl object-cover ring-4 ring-white/20"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-4 ring-white/20 backdrop-blur">
                {getInitials(name)}
              </div>
            )}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
              <p className="flex items-center gap-1.5 text-sm text-white/75">
                <Mail className="size-3.5" /> {email}
              </p>
              {profile?.role && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-white/20">
                  <ShieldCheck className="size-3" /> {profile.role}
                </span>
              )}
            </div>
          </div>
          <form action={logout}>
            <button
              id="profile-logout"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <LogOut className="size-4" /> Cerrar sesión
            </button>
          </form>
        </div>
      </section>

      {!persona && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Tu usuario aún no está vinculado a una persona. Contacta a un administrador para completar tu ficha.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Datos personales */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <header className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#003DA5]/10 text-[#003DA5] dark:text-blue-400">
              <UserRound className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">Datos personales</h2>
              <p className="text-sm text-zinc-500">Esta información se guarda en tu ficha de persona.</p>
            </div>
          </header>
          {persona ? (
            <PersonaForm initial={initial} email={email} />
          ) : (
            <p className="text-sm text-zinc-500">No hay datos de persona disponibles.</p>
          )}
        </section>

        <div className="space-y-6">
          {/* Seguridad */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <header className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#DC1C2E]/10 text-[#DC1C2E]">
                <KeyRound className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-white">Seguridad</h2>
                <p className="text-sm text-zinc-500">Cambia tu contraseña.</p>
              </div>
            </header>
            <PasswordForm />
          </section>

          {/* Cuenta */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <CalendarCheck className="size-4 text-zinc-400" /> Cuenta
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Miembro desde</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{formatDate(user.created_at)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Último acceso</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{formatDate(user.last_sign_in_at)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Correo verificado</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {user.email_confirmed_at ? "Sí" : "No"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
