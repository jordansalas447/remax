"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";
import { login, type ActionState } from "@/lib/auth/actions";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/form-ui";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(login, { error: initialError });

  return (
    <form action={action} className="space-y-5" id="login-form">
      <input type="hidden" name="next" value={next ?? "/"} />
      <FormAlert error={state.error} success={state.success} />

      <AuthField
        label="Correo electrónico"
        name="email"
        id="login-email"
        type="email"
        autoComplete="email"
        placeholder="tu@remax.pe"
        icon={<Mail />}
        defaultValue={state.fields?.email}
        required
        autoFocus
      />

      <div className="space-y-1.5">
        <AuthField
          label="Contraseña"
          name="password"
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock />}
          required
        />
        <div className="flex justify-end">
          <Link
            href="/recuperar-contrasena"
            className="text-xs font-medium text-[#003DA5] hover:underline dark:text-blue-400"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <SubmitButton id="login-submit" pendingText="Ingresando…">
        Iniciar sesión
      </SubmitButton>
    </form>
  );
}
