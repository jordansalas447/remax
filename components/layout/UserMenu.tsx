import Link from "next/link";
import { LogOut } from "lucide-react";
import { getDisplayName, getInitials, getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";

/** Tarjeta del usuario autenticado para el pie del sidebar. */
export async function UserMenu() {
  const session = await getSession();
  if (!session) return null;

  const name = getDisplayName(session);
  const photo = session.persona?.url_foto;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href="/perfil"
        id="sidebar-profile-link"
        className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
        title="Mi perfil"
      >
        {photo ? (
          <img src={photo} alt={name} className="size-9 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#003DA5] to-[#1a56c4] text-sm font-semibold text-white">
            {getInitials(name)}
          </span>
        )}
        <span className="min-w-0 text-left">
          <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
          <span className="block truncate text-xs capitalize text-zinc-500">
            {session.profile?.role ?? session.user.email}
          </span>
        </span>
      </Link>
      <form action={logout}>
        <button
          id="sidebar-logout"
          type="submit"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="flex size-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-50 hover:text-[#DC1C2E] dark:hover:bg-red-950/40"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}
