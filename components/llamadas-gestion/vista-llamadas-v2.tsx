'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, FileText, Phone, Plus, Search, User, X } from 'lucide-react';
import DialogLlamada from '@/components/llamadas-gestion/dialog-llamada';
import {
  getVistaPropietariosContratosLlamadas,
  type VistaPropietarioContratoLlamada,
} from '@/lib/supabase/queries/gestion_llamadas_jerarquia';
import { getEstadoLlamadas, type EstadoLlamadaRow } from '@/lib/supabase/queries/estado_llamada';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const fecha = (v?: string | null) => (v ? v.slice(0, 10) : null);

function tieneLlamada(row: VistaPropietarioContratoLlamada) {
  return Boolean(
    row.fecha_bienvenida ||
      row.curso_llamada?.trim() ||
      row.observacion?.trim() ||
      row.fecha_seguimiento_llamada ||
      row.observacion_seguimiento?.trim() ||
      row.id_estado_llamada
  );
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function PanelVacio({ texto }: { texto: string }) {
  return (
    <Card className="flex min-h-48 flex-1 items-center justify-center border-dashed">
      <p className="px-6 text-center text-sm text-muted-foreground">{texto}</p>
    </Card>
  );
}

type PropietarioVista = {
  id_propietario: number;
  nombre_completo: string | null;
  fecha_registro: string | null;
};

type ContratoVista = {
  id_contrato: number;
  id_propietario: number;
  nro_contrato: string | null;
  id_remax: string | number | null;
};

export default function VistaLlamadasV2() {
  const [filas, setFilas] = useState<VistaPropietarioContratoLlamada[]>([]);
  const [estados, setEstados] = useState<EstadoLlamadaRow[]>([]);
  const [selPropId, setSelPropId] = useState<number | null>(null);
  const [selContratoId, setSelContratoId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cargar = () => {
    setError(null);
    return Promise.all([
      getVistaPropietariosContratosLlamadas(),
      getEstadoLlamadas().catch(() => [] as EstadoLlamadaRow[]),
    ])
      .then(([vista, catalogo]) => {
        setFilas(vista);
        setEstados(catalogo);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'No se pudo cargar la vista.');
      });
  };

  useEffect(() => {
    cargar().finally(() => setLoading(false));
  }, []);

  const estadoPorId = useMemo(() => {
    const map = new Map<number, EstadoLlamadaRow>();
    for (const estado of estados) map.set(estado.id, estado);
    return map;
  }, [estados]);

  const propietarios = useMemo(() => {
    const map = new Map<number, PropietarioVista>();
    for (const row of filas) {
      const actual = map.get(row.id_propietario);
      const fechaRow = fecha(row.fecha_registro);
      if (!actual) {
        map.set(row.id_propietario, {
          id_propietario: row.id_propietario,
          nombre_completo: row.nombre_completo,
          fecha_registro: fechaRow,
        });
        continue;
      }
      if (fechaRow && (!actual.fecha_registro || fechaRow > actual.fecha_registro)) {
        actual.fecha_registro = fechaRow;
      }
      if (!actual.nombre_completo && row.nombre_completo) actual.nombre_completo = row.nombre_completo;
    }
    return Array.from(map.values()).sort((a, b) => {
      const d = (b.fecha_registro ?? '').localeCompare(a.fecha_registro ?? '');
      return d !== 0 ? d : (a.nombre_completo ?? '').localeCompare(b.nombre_completo ?? '');
    });
  }, [filas]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return propietarios;
    const ids = new Set<number>();
    for (const row of filas) {
      const coincide = [row.nombre_completo, row.nro_contrato, row.id_remax?.toString()].some((v) =>
        v?.toLowerCase().includes(q)
      );
      if (coincide) ids.add(row.id_propietario);
    }
    return propietarios.filter((p) => ids.has(p.id_propietario));
  }, [filas, propietarios, busqueda]);

  const contratos = useMemo(() => {
    if (selPropId == null) return [];
    const map = new Map<number, ContratoVista>();
    for (const row of filas) {
      if (row.id_propietario !== selPropId || map.has(row.id_contrato)) continue;
      map.set(row.id_contrato, {
        id_contrato: row.id_contrato,
        id_propietario: row.id_propietario,
        nro_contrato: row.nro_contrato,
        id_remax: row.id_remax,
      });
    }
    return Array.from(map.values()).sort((a, b) =>
      (a.nro_contrato ?? '').localeCompare(b.nro_contrato ?? '')
    );
  }, [filas, selPropId]);

  const llamadas = useMemo(() => {
    if (selPropId == null || selContratoId == null) return [];
    return filas.filter(
      (row) =>
        row.id_propietario === selPropId &&
        row.id_contrato === selContratoId &&
        tieneLlamada(row)
    );
  }, [filas, selPropId, selContratoId]);

  const selProp = propietarios.find((p) => p.id_propietario === selPropId) ?? null;
  const contratoSel = contratos.find((c) => c.id_contrato === selContratoId) ?? null;

  const cerrarPropietario = () => {
    setSelPropId(null);
    setSelContratoId(null);
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3 overflow-x-auto pb-2">
        <Card className={cn('shrink-0 transition-all duration-300', selProp ? 'w-80' : 'w-full')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-4" /> Propietarios
              <Badge variant="secondary">{filtrados.length}</Badge>
            </CardTitle>
            <CardDescription>Selecciona un propietario para ver sus contratos.</CardDescription>
            <div className="relative">
              <Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, contrato o Remax"
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ListSkeleton />
            ) : filtrados.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin propietarios.</p>
            ) : (
              <div className="max-h-[70vh] space-y-1 overflow-y-auto">
                {filtrados.map((p) => (
                  <button
                    key={p.id_propietario}
                    type="button"
                    onClick={() => {
                      setSelPropId(p.id_propietario);
                      setSelContratoId(null);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                      selPropId === p.id_propietario && 'border-primary bg-accent'
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{p.nombre_completo ?? 'Sin nombre'}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        Registro {p.fecha_registro ?? '—'}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selProp ? (
          <Card className={cn('shrink-0 transition-all duration-300', contratoSel ? 'w-80' : 'min-w-0 flex-1')}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-4" /> Contratos
                    <Badge variant="secondary">{contratos.length}</Badge>
                  </CardTitle>
                  <CardDescription className="truncate">{selProp.nombre_completo}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={cerrarPropietario} aria-label="Cerrar propietario">
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {contratos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin contratos ni inmuebles.</p>
              ) : (
                <div className="max-h-[70vh] space-y-1 overflow-y-auto">
                  {contratos.map((c) => (
                    <button
                      key={c.id_contrato}
                      type="button"
                      onClick={() => setSelContratoId(c.id_contrato)}
                      className={cn(
                        'flex w-full flex-col rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                        selContratoId === c.id_contrato && 'border-primary bg-accent'
                      )}
                    >
                      <span className="font-medium">{c.nro_contrato ?? 'S/N'}</span>
                      <span className="text-xs text-muted-foreground">Remax {c.id_remax ?? '—'}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <PanelVacio texto="Elige un propietario para ver sus contratos e inmuebles." />
        )}

        {selProp && contratoSel ? (
          <Card className="min-w-[22rem] flex-1">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="size-4" /> Llamadas
                    <Badge variant="secondary">{llamadas.length}</Badge>
                  </CardTitle>
                  <CardDescription>Contrato {contratoSel.nro_contrato ?? 'S/N'}</CardDescription>
                </div>
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus className="size-4" /> Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {llamadas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin llamadas registradas.</p>
              ) : (
                <div className="max-h-[70vh] space-y-3 overflow-y-auto">
                  {llamadas.map((l, idx) => {
                    const estado = l.id_estado_llamada ? estadoPorId.get(l.id_estado_llamada) : null;
                    return (
                      <div key={`${l.id_contrato}-${idx}`} className="space-y-2 rounded-md border p-3">
                        {estado?.estado_llamada && (
                          <Badge variant={(estado.color as BadgeVariant) || 'secondary'}>
                            {estado.estado_llamada}
                          </Badge>
                        )}
                        {l.curso_llamada?.trim() && (
                          <p className="text-sm font-medium">{l.curso_llamada}</p>
                        )}
                        {fecha(l.fecha_bienvenida) && (
                          <p className="text-xs text-muted-foreground">Bienvenida {fecha(l.fecha_bienvenida)}</p>
                        )}
                        {l.observacion?.trim() && (
                          <p className="text-sm whitespace-pre-line">{l.observacion}</p>
                        )}
                        {(fecha(l.fecha_seguimiento_llamada) || l.observacion_seguimiento?.trim()) && (
                          <div className="space-y-1 border-t pt-2">
                            {fecha(l.fecha_seguimiento_llamada) && (
                              <p className="text-xs text-muted-foreground">
                                Seguimiento {fecha(l.fecha_seguimiento_llamada)}
                              </p>
                            )}
                            {l.observacion_seguimiento?.trim() && (
                              <p className="text-sm whitespace-pre-line">{l.observacion_seguimiento}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          selProp && <PanelVacio texto="Elige un contrato para ver sus llamadas." />
        )}
      </div>

      {contratoSel && (
        <DialogLlamada
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          idPropiedadPropietario={0}
          vinculo={{
            id_propietario: contratoSel.id_propietario,
            id_contrato: contratoSel.id_contrato,
          }}
          llamada={null}
          descripcion={`${selProp?.nombre_completo ?? 'Propietario'} · contrato ${contratoSel.nro_contrato ?? contratoSel.id_contrato}`}
          onSaved={() => {
            cargar();
          }}
        />
      )}
    </div>
  );
}
