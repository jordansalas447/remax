import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Crear cuenta | RE/MAX Adelante",
  description: "Regístrate en la plataforma de gestión de RE/MAX Adelante.",
};

export default function RegistroPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Crea tu cuenta</h1>
        <p className="text-sm text-zinc-500">Completa tus datos para acceder a la plataforma.</p>
      </header>

      <SignupForm />

      <p className="text-center text-sm text-zinc-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-[#003DA5] hover:underline dark:text-blue-400">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
