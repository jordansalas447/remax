"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { requestPasswordReset, type ActionState } from "@/lib/auth/actions";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/form-ui";

export default function RecuperarContrasenaPage() {
  const [state, action] = useActionState<ActionState, FormData>(requestPasswordReset, {});

  return (
    <div className="space-y-8">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" /> Volver al inicio de sesión
      </Link>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm text-zinc-500">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </header>

      <form action={action} className="space-y-5" id="recover-form">
        <FormAlert error={state.error} success={state.success} />
        {!state.success && (
          <>
            <AuthField
              label="Correo electrónico"
              name="email"
              id="recover-email"
              type="email"
              autoComplete="email"
              placeholder="tu@remax.pe"
              icon={<Mail />}
              defaultValue={state.fields?.email}
              required
              autoFocus
            />
            <SubmitButton id="recover-submit" pendingText="Enviando…">
              Enviar enlace
            </SubmitButton>
          </>
        )}
      </form>
    </div>
  );
}
