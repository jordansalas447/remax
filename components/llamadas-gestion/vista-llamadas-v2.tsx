'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, FileText, Pencil, Phone, Plus, Search, User, X, type LucideIcon } from 'lucide-react';
import DialogLlamada from '@/components/llamadas-gestion/dialog-llamada';
import {
  getVistaPropietariosContratosLlamadas,
  getPartidasPorContrato,
  type PartidaContrato,
  type VistaPropietarioContratoLlamada,
} from '@/lib/supabase/queries/gestion_llamadas_jerarquia';
import { getEstadoLlamadas, type EstadoLlamadaRow } from '@/lib/supabase/queries/estado_llamada';
import type { LlamadasRow } from '@/lib/supabase/queries/llamadas';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

type Modo = 'contratos' | 'propietarios';
type Tipo = 'contrato' | 'propietario';

type Item = {
  id: number;
  titulo: string | null;
  detalle: string | null;
  fecha_registro: string | null;
  hijos: Set<number>;
  remax: string | number | null;
  asociado: string | null;
  /** id_estado_llamada -> llamadas distintas con ese estado */
  estados: Map<number, Set<number | string>>;
};

const META: Record<Tipo, { label: string; icon: LucideIcon; singular: string; plural: string; sinTitulo: string }> = {
  contrato: { label: 'Contratos', icon: FileText, singular: 'contrato', plural: 'contratos', sinTitulo: 'S/N' },
  propietario: { label: 'Propietarios', icon: User, singular: 'propietario', plural: 'propietarios', sinTitulo: 'Sin nombre' },
};

const otro = (t: Tipo): Tipo => (t === 'contrato' ? 'propietario' : 'contrato');
const idDe = (row: VistaPropietarioContratoLlamada, t: Tipo) =>
  t === 'contrato' ? row.id_contrato : row.id_propietario;

/** Agrupa las filas de la vista por contrato o por propietario. */
function agrupar(rows: VistaPropietarioContratoLlamada[], tipo: Tipo): Item[] {
  const map = new Map<number, Item>();
  for (const row of rows) {
    const id = idDe(row, tipo);
    const titulo = tipo === 'contrato' ? row.nro_contrato : row.nombre_completo;
    const detalle = tipo === 'contrato' && row.id_remax != null ? `Remax ${row.id_remax}` : null;
    const asociado = tipo === 'contrato' ? row.asociado : row.asociado
    const fechaRow = fecha(row.fecha_registro);
    let actual = map.get(id);
    if (!actual) {
      actual = {
        id,
        titulo,
        detalle,
        fecha_registro: fechaRow,
        hijos: new Set(),
        estados: new Map(),
        remax: tipo === 'contrato' ? row.id_remax : null,
        asociado
      };
      map.set(id, actual);
    }
    actual.hijos.add(idDe(row, otro(tipo)));
    if (row.id_estado_llamada) {
      const llamadasEstado = actual.estados.get(row.id_estado_llamada) ?? new Set<number | string>();
      llamadasEstado.add(row.id ?? `${row.id_contrato}-${row.id_propietario}-${llamadasEstado.size}`);
      actual.estados.set(row.id_estado_llamada, llamadasEstado);
    }
    if (fechaRow && (!actual.fecha_registro || fechaRow > actual.fecha_registro)) actual.fecha_registro = fechaRow;
    if (!actual.titulo && titulo) actual.titulo = titulo;
    if (!actual.detalle && detalle) actual.detalle = detalle;
  }
  return Array.from(map.values());
}

const porTitulo = (a: Item, b: Item) => (a.titulo ?? '').localeCompare(b.titulo ?? '');

export default function VistaLlamadasV2() {
  const [filas, setFilas] = useState<VistaPropietarioContratoLlamada[]>([]);
  const [estados, setEstados] = useState<EstadoLlamadaRow[]>([]);
  const [partidas, setPartidas] = useState<PartidaContrato[]>([]);
  const [modo, setModo] = useState<Modo>('contratos');
  const [sel1Id, setSel1Id] = useState<number | null>(null);
  const [sel2Id, setSel2Id] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [llamadaEdit, setLlamadaEdit] = useState<LlamadasRow | null>(null);

  const tipo1: Tipo = modo === 'contratos' ? 'contrato' : 'propietario';
  const tipo2 = otro(tipo1);
  const meta1 = META[tipo1];
  const meta2 = META[tipo2];

  const contratoId = tipo1 === 'contrato' ? sel1Id : sel2Id;
  const propId = tipo1 === 'propietario' ? sel1Id : sel2Id;

  const cambiarModo = (m: Modo) => {
    if (m === modo) return;
    setModo(m);
    setSel1Id(null);
    setSel2Id(null);
  };

  const abrirDialogo = (l: VistaPropietarioContratoLlamada | null) => {
    setLlamadaEdit(
      l
        ? {
          id: l.id ?? 0,
          create_at: null,
          curso_llamada: l.curso_llamada,
          eliminado: false,
          fecha_bienvenida: l.fecha_bienvenida,
          fecha_seguimiento_llamada: l.fecha_seguimiento_llamada,
          id_estado_llamada: l.id_estado_llamada,
          id_llamadas: null,
          id_propietario: l.id_propietario,
          id_remax: typeof l.id_remax === 'number' ? l.id_remax : null,
          id_seguimiento: null,
          observacion: l.observacion,
          observacion_seguimiento: l.observacion_seguimiento,
        }
        : null
    );
    setDialogOpen(true);
  };

  const cargar = () => {
    setError(null);
    return Promise.all([
      getVistaPropietariosContratosLlamadas(),
      getEstadoLlamadas().catch(() => [] as EstadoLlamadaRow[]),
      getPartidasPorContrato().catch(() => [] as PartidaContrato[]),
    ])
      .then(([vista, catalogo, listaPartidas]) => {
        setFilas(vista);
        setEstados(catalogo);
        setPartidas(listaPartidas);
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

  const renderEstados = (conteo: Item['estados']) =>
    Array.from(conteo).map(([id, llamadasEstado]) => {
      const est = estadoPorId.get(id);
      if (!est?.estado_llamada) return null;
      const veces = llamadasEstado.size;
      return (
        <Badge
          key={id}
          variant={(est.color as BadgeVariant) || 'secondary'}
          title={`${veces} llamada${veces === 1 ? '' : 's'} con estado "${est.estado_llamada}"`}
        >
          {est.estado_llamada}
          {veces > 1 && (
            <span className="ml-1 rounded-full bg-background/30 px-1.5 text-[10px] font-semibold tabular-nums">
              {veces}
            </span>
          )}
        </Badge>
      );
    });

  // Nivel 1
  const nivel1 = useMemo(
    () =>
      agrupar(filas, tipo1).sort((a, b) => {
        const d = (b.fecha_registro ?? '').localeCompare(a.fecha_registro ?? '');
        return d !== 0 ? d : porTitulo(a, b);
      }),
    [filas, tipo1]
  );

  // Partidas agrupadas por el id del nivel 1 (contrato o propietario)
  const partidasPorId = useMemo(() => {
    const map = new Map<number, Set<string>>();
    for (const p of partidas) {
      const id = tipo1 === 'contrato' ? p.id_contrato : p.id_propietario;
      const set = map.get(id) ?? new Set<string>();
      set.add(p.n_partida);
      map.set(id, set);
    }
    return map;
  }, [partidas, tipo1]);

  const renderPartidas = (id: number) => {
    const lista = Array.from(partidasPorId.get(id) ?? []).sort();
    if (lista.length === 0) return <span className="text-muted-foreground">—</span>;
    return lista.map((n) => (
      <Badge key={n} variant="outline" className="tabular-nums">
        {n}
      </Badge>
    ));
  };

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return nivel1;
    const ids = new Set<number>();
    for (const row of filas) {
      const coincide = [row.nro_contrato, row.id_remax?.toString(), row.nombre_completo].some((v) =>
        v?.toLowerCase().includes(q)
      );
      if (coincide) ids.add(idDe(row, tipo1));
    }
    for (const [id, set] of partidasPorId) {
      if (Array.from(set).some((n) => n.toLowerCase().includes(q))) ids.add(id);
    }
    return nivel1.filter((i) => ids.has(i.id));
  }, [filas, nivel1, busqueda, tipo1, partidasPorId]);

  console.log(nivel1)

  // Nivel 2
  const nivel2 = useMemo(() => {
    if (sel1Id == null) return [];
    return agrupar(
      filas.filter((row) => idDe(row, tipo1) === sel1Id),
      tipo2
    ).sort(porTitulo);
  }, [filas, sel1Id, tipo1, tipo2]);

  // Nivel 3: llamadas del contrato + propietario
  const llamadas = useMemo(() => {
    if (contratoId == null || propId == null) return [];
    return filas.filter(
      (row) => row.id_contrato === contratoId && row.id_propietario === propId && tieneLlamada(row)
    );
  }, [filas, contratoId, propId]);

  const item1 = nivel1.find((i) => i.id === sel1Id) ?? null;
  const item2 = nivel2.find((i) => i.id === sel2Id) ?? null;

  // Datos del vínculo contrato/propietario seleccionado
  const vinculo = useMemo(() => {
    if (contratoId == null || propId == null) return null;
    return filas.find((r) => r.id_contrato === contratoId && r.id_propietario === propId) ?? null;
  }, [filas, contratoId, propId]);

  const nombreProp = vinculo?.nombre_completo ?? 'Propietario';
  const nroContrato = vinculo?.nro_contrato ?? 'S/N';

  const cerrarNivel1 = () => {
    setSel1Id(null);
    setSel2Id(null);
  };

  const Icon1 = meta1.icon;
  const Icon2 = meta2.icon;

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Ver por:</span>
        <Button
          size="sm"
          variant={modo === 'contratos' ? 'default' : 'outline'}
          onClick={() => cambiarModo('contratos')}
        >
          <FileText className="size-4" /> Contratos → Propietarios
        </Button>
        <Button
          size="sm"
          variant={modo === 'propietarios' ? 'default' : 'outline'}
          onClick={() => cambiarModo('propietarios')}
        >
          <User className="size-4" /> Propietarios → Contratos
        </Button>
      </div>

      <div className="flex items-start gap-1 overflow-x-auto pb-2">
        {/* Nivel 1 */}
        <Card className={cn('shrink-0 transition-all duration-300', item1 ? 'w-80' : 'w-full')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon1 className="size-4" /> {meta1.label}
              <Badge variant="secondary">{filtrados.length}</Badge>
            </CardTitle>
            <CardDescription>
              Selecciona un {meta1.singular} para ver sus {meta2.plural}.
            </CardDescription>
            <div className="relative">
              <Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por contrato, Remax, propietario o partida"
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ListSkeleton />
            ) : filtrados.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin {meta1.plural}.</p>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto border">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-card">
                    <TableRow>
                      <TableHead>{tipo1 === 'contrato' ? 'Contrato' : 'Propietario'}</TableHead>
                      {!item1 && (
                        <>
                          {tipo1 === 'contrato' && <TableHead>Remax</TableHead>}
                          <TableHead>Asociado</TableHead>
                          <TableHead className="text-right">{meta2.label}</TableHead>
                        </>
                      )}
                      <TableHead>Estados</TableHead>
                      {!item1 && <TableHead>Partidas</TableHead>}
                      {!item1 && <TableHead>Registro</TableHead>}
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtrados.map((i) => {
                      const seleccionar = () => {
                        setSel1Id(i.id);
                        setSel2Id(null);
                      };
                      return (
                        <TableRow
                          key={i.id}
                          tabIndex={0}
                          data-state={sel1Id === i.id ? 'selected' : undefined}
                          onClick={seleccionar}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              seleccionar();
                            }
                          }}
                          className="cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <TableCell className="max-w-56 font-medium">
                            <span className="block truncate">{i.titulo ?? meta1.sinTitulo}</span>
                            {item1 && (i.detalle || i.asociado) && (
                              <span className="block truncate text-xs font-normal text-muted-foreground">
                                {[i.detalle, i.asociado].filter(Boolean).join(' · ')}
                              </span>
                            )}
                          </TableCell>
                          {!item1 && (
                            <>
                              {tipo1 === 'contrato' && <TableCell>{i.remax ?? '—'}</TableCell>}
                              <TableCell className="max-w-48 truncate">{i.asociado ?? '—'}</TableCell>
                              <TableCell className="text-right tabular-nums">{i.hijos.size}</TableCell>
                            </>
                          )}
                          <TableCell className="whitespace-normal">
                            <div className="flex flex-wrap gap-1">{renderEstados(i.estados)}</div>
                          </TableCell>
                          {!item1 && (
                            <TableCell className="whitespace-normal">
                              <div className="flex flex-wrap gap-1">{renderPartidas(i.id)}</div>
                            </TableCell>
                          )}
                          {!item1 && (
                            <TableCell className="text-muted-foreground tabular-nums">
                              {i.fecha_registro ?? '—'}
                            </TableCell>
                          )}
                          <TableCell>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nivel 2 */}
        {item1 && (
          <Card className={cn('shrink-0 transition-all duration-300', item2 ? 'w-80' : 'min-w-0 flex-1')}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <Icon2 className="size-4" /> {meta2.label}
                    <Badge variant="secondary">{nivel2.length}</Badge>
                  </CardTitle>
                  <CardDescription className="truncate">
                    {tipo1 === 'contrato' ? `Contrato ${item1.titulo ?? 'S/N'}` : item1.titulo ?? 'Sin nombre'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={cerrarNivel1} aria-label={`Cerrar ${meta1.singular}`}>
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {nivel2.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin {meta2.plural}.</p>
              ) : (
                <div className="max-h-[70vh] space-y-1 overflow-y-auto">
                  {nivel2.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setSel2Id(i.id)}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-none border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                        sel2Id === i.id && 'border-primary bg-accent'
                      )}
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-1.5 font-medium">
                          <span className="truncate">{i.titulo ?? meta2.sinTitulo}</span>
                          {renderEstados(i.estados)}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {i.detalle ? `${i.detalle} · ` : ''}Registro {i.fecha_registro ?? '—'}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Llamadas */}
        {item1 && item2 && vinculo ? (
          <Card className="min-w-[22rem] flex-1">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="size-4" /> Llamadas
                    <Badge variant="secondary">{llamadas.length}</Badge>
                  </CardTitle>
                  <CardDescription className="truncate">
                    {nombreProp} · contrato {nroContrato}
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => abrirDialogo(null)}>
                  <Plus className="size-4" /> Agregar llamada
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
                      <div key={`${l.id_contrato}-${idx}`} className="space-y-2 rounded-none border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {l.id != null && <small className="text-muted-foreground">#{l.id}</small>}
                            {estado?.estado_llamada && (
                              <Badge variant={(estado.color as BadgeVariant) || 'secondary'}>
                                {estado.estado_llamada}
                              </Badge>
                            )}
                          </div>
                          <Button type="button" size="sm" variant="outline" onClick={() => abrirDialogo(l)}>
                            <Pencil className="size-3.5" /> Editar
                          </Button>
                        </div>
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
          item1 && <PanelVacio texto={`Elige un ${meta2.singular} para ver sus llamadas.`} />
        )}
      </div>

      {vinculo && contratoId != null && propId != null && (
        <DialogLlamada
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          idPropiedadPropietario={0}
          vinculo={{ id_propietario: propId, id_contrato: contratoId }}
          llamada={llamadaEdit}
          descripcion={`${nombreProp} · contrato ${vinculo.nro_contrato ?? contratoId}`}
          onSaved={(guardada) => {
            setFilas((prev) => {
              const camposLlamada = {
                id: guardada.id,
                id_llamada: guardada.id,
                fecha_bienvenida: guardada.fecha_bienvenida,
                id_estado_llamada: guardada.id_estado_llamada,
                curso_llamada: guardada.curso_llamada,
                observacion: guardada.observacion,
                fecha_seguimiento_llamada: guardada.fecha_seguimiento_llamada,
                observacion_seguimiento: guardada.observacion_seguimiento,
              };

              if (prev.some((row) => row.id === guardada.id)) {
                return prev.map((row) => (row.id === guardada.id ? { ...row, ...camposLlamada } : row));
              }

              const idxVacia = prev.findIndex(
                (row) => row.id_propietario === propId && row.id_contrato === contratoId && !tieneLlamada(row)
              );

              if (idxVacia !== -1) {
                return prev.map((row, idx) => (idx === idxVacia ? { ...row, ...camposLlamada } : row));
              }

              return [
                ...prev,
                {
                  id_contrato: contratoId,
                  nro_contrato: vinculo.nro_contrato,
                  id_remax: vinculo.id_remax,
                  id_propietario: propId,
                  nombre_completo: vinculo.nombre_completo,
                  fecha_registro: vinculo.fecha_registro,
                  asociado: vinculo.asociado,
                  ...camposLlamada,
                },
              ];
            });
            cargar();
          }}
        />
      )}
    </div>
  );
}
