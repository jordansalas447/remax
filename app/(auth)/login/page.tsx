import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | RE/MAX Adelante",
  description: "Accede a la plataforma de gestión de RE/MAX Adelante.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-zinc-500">Ingresa tus credenciales para continuar.</p>
      </header>

      <LoginForm next={next} initialError={error} />

      <p className="text-center text-sm text-zinc-500">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-[#003DA5] hover:underline dark:text-blue-400">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
