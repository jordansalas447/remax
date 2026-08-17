"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UsersRound } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { AsociadoProfileCard } from "./_components/asociado-profile-card";
import { ContratosSection } from "./_components/contratos-section";
import { PropiedadFicha } from "./_components/propiedad-ficha";
import { PropietariosSection } from "./_components/propietarios-section";
import {
  getAsociadoDetalle,
  getAsociados,
  type AsociadoDetalle,
  type AsociadoListItem,
} from "@/lib/supabase/queries/asociados";
import {
  getContratosByAsociadoId,
  type ContratoConPropiedad,
} from "@/lib/supabase/queries/contratos";
import { getPropiedadDetalleById, type PropiedadDetalle } from "@/lib/supabase/queries/propiedades";
import {
  getPropietariosByPropiedadId,
  type PropietarioDetalle,
} from "@/lib/supabase/queries/propietarios";

export default function AsociadoPage() {
  const [asociados, setAsociados] = useState<AsociadoListItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAsociadoId, setSelectedAsociadoId] = useState<number | null>(null);
  const [selectedContratoId, setSelectedContratoId] = useState<number | null>(null);
  const [selectedPropiedadId, setSelectedPropiedadId] = useState<number | null>(null);

  const [asociadoDetalle, setAsociadoDetalle] = useState<AsociadoDetalle | null>(null);
  const [contratos, setContratos] = useState<ContratoConPropiedad[]>([]);
  const [propiedad, setPropiedad] = useState<PropiedadDetalle | null>(null);
  const [propietarios, setPropietarios] = useState<PropietarioDetalle[]>([]);

  const [loadingAsociados, setLoadingAsociados] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingContratos, setLoadingContratos] = useState(false);
  const [loadingPropiedad, setLoadingPropiedad] = useState(false);
  const [loadingPropietarios, setLoadingPropietarios] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingAsociados(true);
      try {
        const data = await getAsociados();
        if (!cancelled) setAsociados(data);
      } finally {
        if (!cancelled) setLoadingAsociados(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAsociados = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return asociados;
    return asociados.filter((item) => {
      const nombre = item.nombre_completo?.toLowerCase() ?? "";
      const id = String(item.id_asociado);
      return nombre.includes(query) || id.includes(query);
    });
  }, [asociados, search]);

  useEffect(() => {
    if (selectedAsociadoId == null) {
      setAsociadoDetalle(null);
      setContratos([]);
      setSelectedContratoId(null);
      setSelectedPropiedadId(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoadingDetalle(true);
      setLoadingContratos(true);
      setSelectedContratoId(null);
      setSelectedPropiedadId(null);

      try {
        const [detalle, contratosData] = await Promise.all([
          getAsociadoDetalle(selectedAsociadoId),
          getContratosByAsociadoId(selectedAsociadoId),
        ]);

        if (cancelled) return;

        setAsociadoDetalle(detalle);
        setContratos(contratosData);

        if (contratosData.length > 0) {
          const first = contratosData[0];
          setSelectedContratoId(first.id_contrato);
          setSelectedPropiedadId(first.id_propiedad);
        }
      } finally {
        if (!cancelled) {
          setLoadingDetalle(false);
          setLoadingContratos(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedAsociadoId]);

  useEffect(() => {
    if (selectedPropiedadId == null) {
      setPropiedad(null);
      setPropietarios([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoadingPropiedad(true);
      setLoadingPropietarios(true);

      try {
        const [propiedadData, propietariosData] = await Promise.all([
          getPropiedadDetalleById(selectedPropiedadId),
          getPropietariosByPropiedadId(selectedPropiedadId),
        ]);

        if (cancelled) return;

        setPropiedad(propiedadData);
        setPropietarios(propietariosData);
      } finally {
        if (!cancelled) {
          setLoadingPropiedad(false);
          setLoadingPropietarios(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedPropiedadId]);

  const handleSelectContrato = useCallback((id_contrato: number, id_propiedad: number) => {
    setSelectedContratoId(id_contrato);
    setSelectedPropiedadId(id_propiedad);
  }, []);

  const selectedContrato = useMemo(
    () => contratos.find((item) => item.id_contrato === selectedContratoId) ?? null,
    [contratos, selectedContratoId],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <UsersRound className="size-5" />
          <span className="text-sm font-medium">Gestión de asociados</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ficha del asociado
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Selecciona un asociado para consultar su perfil, contratos, propiedades vinculadas y
          propietarios.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o ID..."
              className="pl-9"
            />
          </div>
          <NativeSelect
            value={selectedAsociadoId ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedAsociadoId(value ? Number(value) : null);
            }}
            disabled={loadingAsociados}
          >
            <option value="">
              {loadingAsociados ? "Cargando asociados..." : "Seleccionar asociado"}
            </option>
            {filteredAsociados.map((item) => (
              <option key={item.id_asociado} value={item.id_asociado}>
                {item.nombre_completo ?? `Asociado #${item.id_asociado}`}
              </option>
            ))}
          </NativeSelect>
        </div>
      </section>

      <AsociadoProfileCard asociado={asociadoDetalle} loading={loadingDetalle} />

      <ContratosSection
        contratos={contratos}
        selectedContratoId={selectedContratoId}
        onSelectContrato={handleSelectContrato}
        loading={loadingContratos}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <PropiedadFicha
          propiedad={propiedad}
          loading={loadingPropiedad}
          contratoId={selectedContratoId}
        />
        <PropietariosSection
          propietarios={propietarios}
          loading={loadingPropietarios}
          propiedadId={selectedPropiedadId}
        />
      </div>

      {selectedContrato?.observaciones && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
          <p className="mb-1 font-medium">Observaciones del contrato</p>
          <p>{selectedContrato.observaciones}</p>
        </section>
      )}
    </div>
  );
}
