"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Campo de formulario con etiqueta e icono                            */
/* ------------------------------------------------------------------ */
type FieldProps = ComponentProps<"input"> & {
  label: string;
  icon?: ReactNode;
  hint?: string;
};

export function AuthField({ label, icon, hint, id, className, type, ...props }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </label>
      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400 transition-colors group-focus-within:text-[#003DA5] [&_svg]:size-4">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={isPassword && visible ? "text" : type}
          className={cn(
            "h-11 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 text-sm text-zinc-900 shadow-sm outline-none transition-all",
            "placeholder:text-zinc-400 hover:border-zinc-300",
            "focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10",
            "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
            "dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100",
            icon && "pl-10",
            isPassword && "pr-10",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 transition-colors hover:text-zinc-700"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Botón submit con estado de carga                                    */
/* ------------------------------------------------------------------ */
export function SubmitButton({
  children,
  pendingText = "Procesando…",
  className,
  id,
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
  id?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      id={id}
      type="submit"
      disabled={pending}
      className={cn(
        "relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-semibold text-white shadow-lg shadow-[#003DA5]/25 transition-all",
        "bg-linear-to-r from-[#003DA5] to-[#1a56c4] hover:shadow-xl hover:shadow-[#003DA5]/30 hover:brightness-110 active:scale-[0.99]",
        "disabled:cursor-wait disabled:opacity-80",
        className,
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Alerta de error / éxito                                             */
/* ------------------------------------------------------------------ */
export function FormAlert({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  const isError = Boolean(error);
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm animate-in fade-in slide-in-from-top-1 duration-300",
        isError
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
      )}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{error ?? success}</span>
    </div>
  );
}
