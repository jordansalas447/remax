"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, User, UsersRound } from "lucide-react";
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
import { type PropiedadDetalle } from "@/lib/supabase/queries/propiedades";
import {
  getPropietariosByPropiedadId,

  type PropietarioDetalle,
} from "@/lib/supabase/queries/propietarios";
import { InputSearch } from "@/components/input-search/input-search";
import { RevisionesEstatusItem } from "./_components/propiedad-estatus-item";
import { getPropiedadPropietarioInmueblesByContrato, getRevisionesDetalleByContratoVista, getRevisionesDetalleByPropiedadId, InmuebleDetalle, PropiedadPropietarioDetalle } from "@/lib/supabase/queries/propiedad_propietarios";
import { getVistaRevisiones } from "@/lib/supabase/queries/revisiones";
import { ContratoDetalle } from "@/lib/business";
import HistorialObservaciones from "./_components/historial-observaciones";
import ObservacionInput from "./_components/componente-observaciones";
import { createHistorialObservacion, getHistorialObservacionById, getHistorialObservacionByIdInmueblePropietarioContrato, HistorialObservacionesDetalle } from "@/lib/supabase/queries/historial_observaciones";
import { toast } from "@/components/ui/toast";
import { AlcanceDetalle, getAlcances } from "@/lib/supabase/queries/alcance";


export default function AsociadoPage() {
  const [asociados, setAsociados] = useState<AsociadoListItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAsociadoId, setSelectedAsociadoId] = useState<number | null>(null);
  const [selectedContratoId, setSelectedContratoId] = useState<number | null>(null);
  const [selectedPropiedadId, setSelectedPropiedadId] = useState<number | null>(null);

  const [asociadoDetalle, setAsociadoDetalle] = useState<AsociadoDetalle | null>(null);
  const [contratos, setContratos] = useState<ContratoConPropiedad[]>([]);

  const [propiedad, setPropiedad] = useState<InmuebleDetalle[]>([]);
  const [contrato, setContrato] = useState<PropiedadDetalle | null>(null);

  const [propietarios, setPropietarios] = useState<PropietarioDetalle[]>([]);

  const [ContratosData, setContratosData] = useState<PropiedadPropietarioDetalle[]>([]);
  const [PropiedadesData, setPropiedadesData] = useState<PropiedadPropietarioDetalle[]>([]);
  const [PropietariosData, setPropietariosData] = useState<PropiedadPropietarioDetalle[]>([]);

  const [ContratoSelecionado, setContratoSelecionado] = useState<InmuebleDetalle | null>(null);


  const [Observaciones, setObservaciones] = useState<string>("");
  const [AlcanceSeleccionado, setAlcanceSeleccionado] = useState<number>(1)
  const [guardandoObservacion, setGuardandoObservacion] = useState(false);

  const [RevisionesData, setRevisionesData] = useState<any[]>([]);

  const [historialObservacionesData,sethistorialObservacionesData] = useState<HistorialObservacionesDetalle[] | null>([]);

  const [alcancesData,setalcancesData] = useState<AlcanceDetalle[]>([]);

  const [RevisionesCheckDataContrato, setRevisionesCheckDataContrato] = useState<any[]>([]);
  const [RevisionesCheckDataPropiedad, setRevisionesCheckDataPropiedad] = useState<any[]>([]);
  const [RevisionesCheckDataPropietarios, setRevisionesCheckDataPropietarios] = useState<any[]>([]);

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
      setPropiedad([]);
      setPropietarios([]);
      return;
    }

    if (selectedContratoId == null) {
      setContrato(null);
      setContratos([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoadingPropiedad(true);
      setLoadingPropietarios(true);

      try {
        const [propiedadData, propietariosData, RevisionesPropiedades, DetalleRevisionesPropietario, RevisionesCheckContratoData, RevisionesCheckPropiedadData] = await Promise.all([
          getPropiedadPropietarioInmueblesByContrato(selectedContratoId),
          getPropietariosByPropiedadId(selectedPropiedadId, selectedContratoId),
          getRevisionesDetalleByPropiedadId(selectedPropiedadId),
          getRevisionesDetalleByContratoVista(selectedContratoId),

          getVistaRevisiones(selectedContratoId, 3),
          getVistaRevisiones(selectedPropiedadId, 1)

          //  getContratoRevisionesDetalleByContratoId(selectedContratoId),
        ]);


        const [HistorialObservacionesData,AlcancesData] = await Promise.all([
          getHistorialObservacionByIdInmueblePropietarioContrato(propiedadData[0].id),
          getAlcances()

          //  getContratoRevisionesDetalleByContratoId(selectedContratoId),
        ]);

        sethistorialObservacionesData(HistorialObservacionesData)
        setalcancesData(AlcancesData)

        if (cancelled) return;

        // Obtener los IDs de los propietarios
        const propietariosIds = Array.isArray(propietariosData)
          ? propietariosData.map((p) => p.id_propietario).filter(Boolean)
          : [];

        // Llama a getRevisionesDetallePropietario solo si hay IDs
        let RevisionesPropietarios: any[] = [];
        let RevisionesPropietariosData: any[] = [];
        if (propietariosIds.length > 0) {
          try {
            for (const id of propietariosIds) {
              const revisionesPropietario = await getVistaRevisiones(id, 2);
              RevisionesPropietariosData.push(...revisionesPropietario);
            }
          } catch (e) {
            RevisionesPropietarios = [];
          }
        }
        setRevisionesCheckDataPropietarios(RevisionesPropietariosData)

        if (cancelled) return;

        setPropiedad(propiedadData);

        console.log(propietariosData);

        setPropietarios(propietariosData);

        setPropiedadesData(RevisionesPropiedades);
        setPropietariosData(RevisionesPropietarios);

        setRevisionesCheckDataContrato(RevisionesCheckContratoData)
        setRevisionesCheckDataPropiedad(RevisionesCheckPropiedadData)

        //console.log(DetalleRevisionesPropietario)
        setRevisionesData(DetalleRevisionesPropietario);
        //setPropietariosData(RevisionesPropietarios);
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
  }, [selectedPropiedadId, selectedContratoId]);


  const handleSelectContrato = useCallback((id_contrato: number, id_propiedad: number) => {
    setSelectedContratoId(id_contrato);
    setSelectedPropiedadId(id_propiedad);
  }, []);

  const selectedContrato = useMemo(
    () => contratos.find((item) => item.id_contrato === selectedContratoId) ?? null,
    [contratos, selectedContratoId],
  );

  const handleGuardarObservacion = useCallback(async () => {
    const operacion = propiedad[0];
    const texto = Observaciones.trim();

    if (!operacion?.id || !texto || !AlcanceSeleccionado) return;

    setGuardandoObservacion(true);

    try {
      const created = await createHistorialObservacion({
        observacion: texto,
        id_alcance: AlcanceSeleccionado,
        id_inmueble_propietario_contrato: operacion.id,
      });




      setPropiedad((prev) => {
        if (prev.length === 0) return prev;
        const [first, ...rest] = prev;
        const historial = Array.isArray(first.historial_observacioness)
          ? first.historial_observacioness
          : [];
        return [
          { ...first, historial_observacioness: [...historial, created] },
          ...rest,
        ];
      });

      setObservaciones("");
      toast.add({
        title: "Observación guardada",
        type: "success",
      });


      const [HistorialObservacionesData] = await Promise.all([
        getHistorialObservacionByIdInmueblePropietarioContrato(propiedad[0].id),

        //  getContratoRevisionesDetalleByContratoId(selectedContratoId),
      ]);

      sethistorialObservacionesData(HistorialObservacionesData)

    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la observación.",
        type: "error",
      });
    } finally {
      setGuardandoObservacion(false);
    }
  }, [propiedad, Observaciones, AlcanceSeleccionado]);

  return (
    <div className="mx-auto flex w-full max-w-lxl flex-col gap-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-blue-600 dark:text-indigo-400">
          <UsersRound className="size-5" />
          <span className="text-sm font-medium">Gestión de asociados</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ficha de asociado
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Selecciona un asociado para consultar su perfil, contratos, inmuebles vinculadas y
          propietarios.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] sm:grid-cols-[300px_1fr] lg:items-start">
        {/* Columna lateral: búsqueda + perfil, fija al hacer scroll */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6">
          <section className="border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-3 flex items-center gap-2">
              <User className="size-5 text-blue-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Asociado
              </span>
            </div>

            <InputSearch
              search={search}
              setSearch={setSearch}
              selectedId={selectedAsociadoId}
              setSelectedId={setSelectedAsociadoId}
              filteredItems={filteredAsociados}
              loading={loadingAsociados}
              getOptionLabel={(item) => item.nombre_completo ?? `Asociado #${item.id_asociado}`}
              getOptionValue={(item) => item.id_asociado}
              inputPlaceholder="Buscar por nombre o ID..."
              selectPlaceholder="Seleccionar asociado"
            />
          </section>

          <AsociadoProfileCard asociado={asociadoDetalle} loading={loadingDetalle} />

        </div>

        {/* Columna principal: todo lo demás apilado verticalmente */}
        <div className="flex flex-col gap-6">
          <ContratosSection
            contratos={contratos}
            selectedContratoId={selectedContratoId}
            onSelectContrato={handleSelectContrato}
            loading={loadingContratos}
            CheckRevision={RevisionesCheckDataContrato}
          />



          {selectedContrato?.observaciones && (
            <section className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
              <p className="mb-1 font-medium">Observaciones del contrato</p>
              <p>{selectedContrato.observaciones}</p>
            </section>
          )}


          {propiedad[0]?.observaciones && propiedad[0].observaciones.length > 0 && (
            <section className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
              <p className="mb-1 font-medium">Observaciones Generales</p>
              {propiedad[0].observaciones.map((obs: string, idx: number) => (
                <p key={idx}>{obs}</p>
              ))}
            </section>
          )}


          {propiedad &&
            propiedad.map(
              (item, idx) =>
                item?.inmueble?.observacion && (
                  <section
                    key={idx}
                    className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100"
                  >
                    <p className="mb-1 font-medium">Observaciones del Inmueble</p>
                    <p>{item.inmueble.observacion}</p>
                  </section>
                )
            )}

          {
            contratos[0] &&
            <div>
            <HistorialObservaciones loading={loadingPropiedad} historial_observacioness={historialObservacionesData}></HistorialObservaciones>
            <ObservacionInput
              nuevaObservacion={Observaciones}
              setNuevaObservacion={setObservaciones}
              alcance={AlcanceSeleccionado}
              setAlcance={setAlcanceSeleccionado}
              onGuardar={handleGuardarObservacion}
              guardando={guardandoObservacion} 
              AlcancesOptions={alcancesData}/>
            </div>                  
          }
          
          <PropiedadFicha
            propiedades={propiedad}
            loading={loadingPropiedad}
            contratoId={selectedContratoId}
            CheckRevision={RevisionesCheckDataPropiedad}
          />

          <PropietariosSection
            propietarios={propietarios}
            loading={loadingPropietarios}
            propiedadId={selectedPropiedadId}
            CheckRevision={RevisionesCheckDataPropietarios}
          />

          <RevisionesEstatusItem
            revisiones={RevisionesData ? RevisionesData : []}
            loading={loadingPropietarios}
          />
        </div>
      </div>
    </div>
  );
}

