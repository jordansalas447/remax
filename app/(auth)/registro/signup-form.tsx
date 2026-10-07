"use client";

import { useActionState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { signup, type ActionState } from "@/lib/auth/actions";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/form-ui";

export function SignupForm() {
  const [state, action] = useActionState<ActionState, FormData>(signup, {});

  if (state.success) {
    return (
      <div className="space-y-4">
        <FormAlert success={state.success} />
        <p className="text-sm text-zinc-500">
          ¿No llegó el correo? Revisa tu carpeta de spam o vuelve a intentarlo en unos minutos.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" id="signup-form">
      <FormAlert error={state.error} />

      <AuthField
        label="Nombres"
        name="nombre"
        id="signup-nombre"
        autoComplete="given-name"
        placeholder="Juan Carlos"
        icon={<User />}
        defaultValue={state.fields?.nombre}
        required
        autoFocus
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          label="Apellido paterno"
          name="apellido_paterno"
          id="signup-apellido-paterno"
          autoComplete="family-name"
          defaultValue={state.fields?.apellido_paterno}
        />
        <AuthField
          label="Apellido materno"
          name="apellido_materno"
          id="signup-apellido-materno"
          defaultValue={state.fields?.apellido_materno}
        />
      </div>
      <AuthField
        label="Correo electrónico"
        name="email"
        id="signup-email"
        type="email"
        autoComplete="email"
        placeholder="tu@remax.pe"
        icon={<Mail />}
        defaultValue={state.fields?.email}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          label="Contraseña"
          name="password"
          id="signup-password"
          type="password"
          autoComplete="new-password"
          icon={<Lock />}
          minLength={8}
          required
        />
        <AuthField
          label="Confirmar"
          name="confirm_password"
          id="signup-confirm-password"
          type="password"
          autoComplete="new-password"
          icon={<Lock />}
          minLength={8}
          required
        />
      </div>
      <p className="text-xs text-zinc-500">Mínimo 8 caracteres.</p>

      <SubmitButton id="signup-submit" pendingText="Creando cuenta…">
        Crear cuenta
      </SubmitButton>
    </form>
  );
}
