"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { AlcanceDetalle } from "@/lib/supabase/queries/alcance";

// Opciones de alcance estándar
// const ALCANCES_OPCIONES = [
//   { value: 1, label: "Comentarios Docs" },
//   { value: 2, label: "Levantamiento de Observaciones" },
//   { value: 3, label: "Informe" },
//   { value: 4, label: "EETT" },
//   { value: 5, label: "Observación" },
//   { value: 6, label: "Estado" },
// ];


// Componente auxiliar para input de nueva observación y selección de alcance
const ObservacionInput: React.FC<{
  nuevaObservacion: string;
  setNuevaObservacion: (v: string) => void;
  alcance: number;
  setAlcance: (v: number) => void;
  onGuardar: () => void;
  guardando?: boolean;
  loading?: boolean;
  AlcancesOptions: AlcanceDetalle[]

}> = ({
  nuevaObservacion,
  setNuevaObservacion,
  alcance,
  setAlcance,
  onGuardar,
  loading = false,
  guardando = false,
  AlcancesOptions
}) => {
    return (
      <div className="flex items-end gap-2 mb-4 mt-1">
        <div className="flex-1 flex flex-col gap-1">
          <label className="block text-xs text-zinc-500 mb-0.5 ml-1" htmlFor="nueva-observacion-textarea">
            Nueva Observación
          </label>
          <Textarea
            id="nueva-observacion-textarea"
            className="resize-none min-h-[38px]"
            value={nuevaObservacion}
            onChange={e => setNuevaObservacion(e.target.value)}
            rows={1}
            placeholder="Escribe una nueva observación..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-xs text-zinc-500 mb-0.5 ml-1" htmlFor="alcance-select">
            Alcance
          </label>
          <NativeSelect
            id="alcance-select"
            name="alcance"
            value={alcance}
            onChange={e => setAlcance(Number(e.target.value))}
       
            className="w-[20vh]"
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {AlcancesOptions.map(opt => (
              <option key={opt.id_alcance} value={opt.id_alcance}>
                {opt.alcance}
              </option>
            ))}
          </NativeSelect>
     
        </div>
        <Button
          className="mt-5"
          onClick={onGuardar}
          disabled={!nuevaObservacion.trim() || guardando}
          type="button"
          size="lg"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    );
};

export default ObservacionInput;