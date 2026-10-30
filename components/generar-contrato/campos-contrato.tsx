"use client";

import React from "react";
import { Input } from "../ui/input";
import { NativeSelect } from "../ui/native-select";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { Propietario } from "./Contratos/shared/types";
import {
  MESES,
  SECCIONES,
  getCamposContrato,
  getCamposPropietario,
  getDenominacionParte,
  type CampoContrato,
  type CampoTextoContratoKey,
  type SeccionCampo,
} from "./Contratos/shared/campos";

export type DatosContrato = Partial<Record<CampoTextoContratoKey, string>>;

interface CamposContratoProps {
  tipoOperacion: number;
  tipoContrato: number;
  NombreAsociado: string | undefined | null;
  nroPropietarios: number;
  datos: DatosContrato;
  propietarios: Propietario[];
  disabled?: boolean;
  onDatoChange: (key: CampoTextoContratoKey, value: string) => void;
  onPropietarioChange: (index: number, key: keyof Propietario, value: string) => void;
  onUsarFechaHoy: () => void;
}

const ORDEN_SECCIONES: SeccionCampo[] = ["inmueble", "condiciones", "firma"];

function Seccion({
  titulo,
  children,
  accion,
}: {
  titulo: string;
  children: React.ReactNode;
  accion?: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border dark:border-zinc-700 p-3">
      <legend className="px-1 text-sm font-semibold">{titulo}</legend>
      {accion && <div className="flex justify-end -mt-1 mb-2">{accion}</div>}
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </fieldset>
  );
}

function Campo({
  id,
  label,
  ancho,
  sufijo,
  children,
}: {
  id: string;
  label: string;
  ancho?: boolean;
  sufijo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", ancho && "col-span-2")}>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {sufijo ? (
        <div className="flex items-center gap-2">
          {children}
          <span className="text-xs text-muted-foreground shrink-0">{sufijo}</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default function CamposContrato({
  tipoOperacion,
  tipoContrato,
  nroPropietarios,
  NombreAsociado,
  datos,
  propietarios,
  disabled,
  onDatoChange,
  onPropietarioChange,
  onUsarFechaHoy,
}: CamposContratoProps) {
  const campos = getCamposContrato(tipoOperacion, tipoContrato);
  const camposPropietario = getCamposPropietario(tipoOperacion);
  const denominacion = getDenominacionParte(tipoOperacion);
  const total = Math.max(1, nroPropietarios);

  const renderCampo = (campo: CampoContrato) => {
    const id = `campo-${campo.key}`;
    const value = datos[campo.key] ?? "";

    if (campo.key === "nombreAsesor") {
      return (
        <Campo
          key={campo.key}
          id={id}
          label={campo.label}
          ancho={campo.ancho}
        >
          <div className="flex items-center gap-2">
            <Input
              id={id}
              placeholder={campo.placeholder}
              value={value ?? NombreAsociado ?? ""}
              disabled={disabled}
              onChange={(e) =>
                onDatoChange(campo.key, e.target.value)
              }
              className="flex-1"
            />
    
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || !NombreAsociado}
              onClick={() =>
                onDatoChange(campo.key, NombreAsociado ?? "")
              }
            >
              + 
            </Button>
          </div>
        </Campo>
      );
    }
    if (campo.type === "mes") {
      return (
        <Campo key={campo.key} id={id} label={campo.label} ancho={campo.ancho}>
          <NativeSelect
            id={id}
            value={value}
            disabled={disabled}
            onChange={(e) => onDatoChange(campo.key, e.target.value)}
          >
            <option value="">—</option>
            {MESES.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </NativeSelect>
        </Campo>
      );
    }

    return (
      <Campo
        key={campo.key}
        id={id}
        label={campo.label}
        ancho={campo.ancho}
        sufijo={campo.sufijo}
      >
        <Input
          id={id}
          type={campo.type === "number" ? "number" : "text"}
          min={campo.type === "number" ? 0 : undefined}
          inputMode={campo.type === "number" ? "numeric" : undefined}
          placeholder={campo.placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onDatoChange(campo.key, e.target.value)}
        />
      </Campo>
    );
  };

  return (
    <div className="grid gap-4">
      {/* Propietarios / Clientes */}
      {Array.from({ length: total }, (_, i) => {
        const p = propietarios[i] ?? {};
        return (
          <Seccion
            key={`propietario-${i}`}
            titulo={total > 1 ? `${denominacion} ${i + 1}` : denominacion}
          >
            {camposPropietario.map((c) => {
              const id = `propietario-${i}-${c.key}`;
              return (
                <Campo key={c.key} id={id} label={c.label} ancho={c.ancho}>
                  <Input
                    id={id}
                    placeholder={c.placeholder}
                    inputMode={c.inputMode}
                    maxLength={c.maxLength}
                    value={p[c.key] ?? ""}
                    disabled={disabled}
                    onChange={(e) => onPropietarioChange(i, c.key, e.target.value)}
                  />
                </Campo>
              );
            })}
          </Seccion>
        );
      })}

      {/* Secciones del contrato */}
      {ORDEN_SECCIONES.map((seccion) => {
        const camposSeccion = campos.filter((c) => c.seccion === seccion);
        if (camposSeccion.length === 0) return null;
        return (
          <Seccion
            key={seccion}
            titulo={tipoOperacion === 4 && seccion === "inmueble" ? "Datos del local comercial" : SECCIONES[seccion]}
            accion={
              seccion === "firma" ? (
                <Button
                  id="btn-fecha-hoy"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onUsarFechaHoy}
                  disabled={disabled}
                >
                  Usar fecha de hoy
                </Button>
              ) : undefined
            }
          >
            {camposSeccion.map(renderCampo)}
          </Seccion>
        );
      })}
    </div>
  );
}
