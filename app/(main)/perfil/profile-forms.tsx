"use client";

import { useActionState } from "react";
import { CalendarDays, IdCard, Lock, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { updatePassword, updateProfile, type ActionState } from "@/lib/auth/actions";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/form-ui";

export type PersonaFormValues = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  documento_identidad: string;
  fecha_nacimiento: string;
  numero_telefono: string;
  numero_telefono_2: string;
  correo_electronico_2: string;
  direccion: string;
};

export function PersonaForm({ initial, email }: { initial: PersonaFormValues; email: string }) {
  const [state, action] = useActionState<ActionState, FormData>(updateProfile, {});
  const v = (k: keyof PersonaFormValues) => state.fields?.[k] ?? initial[k];

  return (
    <form action={action} className="space-y-5" id="profile-form">
      <FormAlert error={state.error} success={state.success} />

      <div className="grid gap-4 sm:grid-cols-3">
        <AuthField label="Nombres" name="nombre" id="profile-nombre" icon={<User />} defaultValue={v("nombre")} required />
        <AuthField label="Apellido paterno" name="apellido_paterno" id="profile-apellido-paterno" defaultValue={v("apellido_paterno")} />
        <AuthField label="Apellido materno" name="apellido_materno" id="profile-apellido-materno" defaultValue={v("apellido_materno")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField label="Documento de identidad" name="documento_identidad" id="profile-documento" icon={<IdCard />} defaultValue={v("documento_identidad")} />
        <AuthField label="Fecha de nacimiento" name="fecha_nacimiento" id="profile-fecha-nacimiento" type="date" icon={<CalendarDays />} defaultValue={v("fecha_nacimiento")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField label="Correo principal" id="profile-email" icon={<Mail />} value={email} disabled readOnly hint="Es tu usuario de acceso." />
        <AuthField label="Correo alternativo" name="correo_electronico_2" id="profile-email-2" type="email" icon={<Mail />} defaultValue={v("correo_electronico_2")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField label="Teléfono" name="numero_telefono" id="profile-telefono" type="tel" icon={<Phone />} defaultValue={v("numero_telefono")} />
        <AuthField label="Teléfono alternativo" name="numero_telefono_2" id="profile-telefono-2" type="tel" icon={<Phone />} defaultValue={v("numero_telefono_2")} />
      </div>

      <AuthField label="Dirección" name="direccion" id="profile-direccion" icon={<MapPin />} defaultValue={v("direccion")} />

      <div className="flex justify-end pt-2">
        <SubmitButton id="profile-submit" pendingText="Guardando…" className="sm:w-auto sm:px-6">
          <Save className="size-4" /> Guardar cambios
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(updatePassword, {});

  return (
    // `key` resetea los campos tras un cambio exitoso
    <form action={action} className="space-y-4" id="password-form" key={state.success}>
      <FormAlert error={state.error} success={state.success} />
      <AuthField label="Nueva contraseña" name="password" id="password-new" type="password" autoComplete="new-password" icon={<Lock />} minLength={8} required />
      <AuthField label="Confirmar contraseña" name="confirm_password" id="password-confirm" type="password" autoComplete="new-password" icon={<Lock />} minLength={8} required />
      <SubmitButton id="password-submit" pendingText="Actualizando…">
        Actualizar contraseña
      </SubmitButton>
    </form>
  );
}
