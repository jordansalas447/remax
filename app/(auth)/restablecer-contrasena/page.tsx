"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { updatePassword, type ActionState } from "@/lib/auth/actions";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/form-ui";

/** Se llega aquí desde el enlace del correo de recuperación (ya con sesión). */
export default function RestablecerContrasenaPage() {
  const [state, action] = useActionState<ActionState, FormData>(updatePassword, {});

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Nueva contraseña</h1>
        <p className="text-sm text-zinc-500">Elige una contraseña segura de al menos 8 caracteres.</p>
      </header>

      <form action={action} className="space-y-5" id="reset-form">
        <input type="hidden" name="redirect_to" value="/" />
        <FormAlert error={state.error} success={state.success} />
        <AuthField
          label="Nueva contraseña"
          name="password"
          id="reset-password"
          type="password"
          autoComplete="new-password"
          icon={<Lock />}
          minLength={8}
          required
          autoFocus
        />
        <AuthField
          label="Confirmar contraseña"
          name="confirm_password"
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          icon={<Lock />}
          minLength={8}
          required
        />
        <SubmitButton id="reset-submit" pendingText="Guardando…">
          Guardar contraseña
        </SubmitButton>
      </form>
    </div>
  );
}
