import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { MENSAJE_FUERA_DE_HORARIO, accesoHabilitado } from "@/lib/auth/acceso";

/** Rutas accesibles sin sesión. */
const PUBLIC_ROUTES = ["/login", "/registro", "/recuperar-contrasena", "/auth"];
/** Rutas a las que un usuario autenticado no debería volver (redirige a /). */
const GUEST_ONLY_ROUTES = ["/login", "/registro", "/recuperar-contrasena"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

/**
 * Refresca la sesión de Supabase en cada request y protege las rutas.
 * Se invoca desde `proxy.ts` (antes "middleware" en Next.js < 16).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: no ejecutar código entre createServerClient y getClaims().
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    Object.entries(params ?? {}).forEach(([k, v]) => url.searchParams.set(k, v));
    const redirect = NextResponse.redirect(url);
    // Conservar las cookies de sesión refrescadas
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (!isAuthenticated && !matches(pathname, PUBLIC_ROUTES)) {
    return redirectTo("/login", { next: `${pathname}${search}` });
  }

  // Control de acceso por horario (se omite en /auth, que registra la sesión por su cuenta)
  if (isAuthenticated && !matches(pathname, ["/auth"])) {
    if (!(await accesoHabilitado(supabase))) {
      await supabase.auth.signOut({ scope: "local" });
      return redirectTo("/login", { error: MENSAJE_FUERA_DE_HORARIO });
    }
  }

  if (isAuthenticated && matches(pathname, GUEST_ONLY_ROUTES)) {
    return redirectTo("/");
  }

  return response;
}
