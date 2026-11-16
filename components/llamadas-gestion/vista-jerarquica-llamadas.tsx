'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, FileText, Pencil, Phone, Plus, Search, User, X } from 'lucide-react';
import DialogLlamada from '@/components/llamadas-gestion/dialog-llamada';
import {
  getPropietariosConPropiedades,
  getContratosInmueblesByPropietario,
  getLlamadasByIdLlamada,
  type PropietarioResumen,
  type ContratoInmuebleResumen,
  LlamadasDetalle,
} from '@/lib/supabase/queries/gestion_llamadas_jerarquia';
import {
  getPropietarioEstadoLlamadas,
  type LlamadasRow,
  type PropietarioLlamadasEstado,
} from '@/lib/supabase/queries/llamadas';
import { getEstadoLlamadas } from '@/lib/supabase/queries/estado_llamada';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDate } from 'date-fns';

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function VistaJerarquicaLlamadas() {
  const [propietarios, setPropietarios] = useState<PropietarioResumen[]>([]);
  const [contratos, setContratos] = useState<ContratoInmuebleResumen[]>([]);
  const [llamadas, setLlamadas] = useState<LlamadasDetalle[]>([]);
  const [propietarioLlamadasEstado, setpropietarioLlamadasEstado] = useState<PropietarioLlamadasEstado[]>([]);
  const [coloresEstado, setColoresEstado] = useState<Record<string, BadgeVariant>>({});
  const [loadingEstados, setLoadingEstados] = useState<boolean>(true);
  const [selProp, setSelProp] = useState<PropietarioResumen | null>(null);
  const [selContrato, setSelContrato] = useState<number | null>(null);
  const [loading, setLoading] = useState<'prop' | 'cont' | 'lla' | null>('prop');
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [estadoActivo, setEstadoActivo] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [llamadaEdit, setLlamadaEdit] = useState<LlamadasRow | null>(null);

  const cargarEstadosPropietarios = () => {
    setLoadingEstados(true);
    Promise.all([
      getPropietarioEstadoLlamadas(),
      getEstadoLlamadas().catch(() => []),
    ])
      .then(([estados, catalogoEstados]) => {
        setpropietarioLlamadasEstado(estados);
        const mapaColor: Record<string, BadgeVariant> = {};
        for (const item of catalogoEstados) {
          if (item.estado_llamada && item.color) {
            mapaColor[item.estado_llamada] = item.color as BadgeVariant;
          }
        }
        setColoresEstado(mapaColor);
      })
      .catch(() => { })
      .finally(() => setLoadingEstados(false));
  };

  const abrirDialogo = (l: LlamadasRow | null) => {
    setLlamadaEdit(l);
    setDialogOpen(true);
  };

  const onLlamadaGuardada = (guardada: LlamadasRow) => {
    if (selContrato === null) return;
    const idPP = contratos[selContrato]?.id_propiedad_propietario;
    // Si era nueva, enlazar el id_llamada al contrato seleccionado
    setContratos((prev) =>
      prev.map((c) =>
        c.id_propiedad_propietario === idPP ? { ...c, id_llamada: guardada.id } : c
      )
    );
    setLlamadas((prev) => {
      const existe = prev.some((l) => l.id === guardada.id);
      return existe ? prev.map((l) => (l.id === guardada.id ? guardada : l)) : [...prev, guardada];
    });
    cargarEstadosPropietarios();
  };

  useEffect(() => {
    getPropietariosConPropiedades()
      .then((props) => {
        setPropietarios(props);
        // Carga progresiva en segundo plano una vez listados los propietarios
        cargarEstadosPropietarios();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(null));
  }, []);

  const estadosPorPropietario = useMemo(() => {
    const map = new Map<number, PropietarioLlamadasEstado[]>();
    for (const item of propietarioLlamadasEstado) {
      if (item.id_propietario == null) continue;
      const lista = map.get(item.id_propietario) ?? [];
      lista.push(item);
      map.set(item.id_propietario, lista);
    }
    return map;
  }, [propietarioLlamadasEstado]);

  const estadosResumen = useMemo(() => {
    const map = new Map<string, { count: number; color?: BadgeVariant }>();
    for (const item of propietarioLlamadasEstado) {
      const key = item.estado_llamada ?? 'Pendiente';
      const prev = map.get(key);
      const color =
        (item.color as BadgeVariant) ||
        coloresEstado[key] ||
        prev?.color ||
        'secondary';
      map.set(key, {
        count: (prev?.count ?? 0) + (item.total_llamadas ?? 1),
        color,
      });
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [propietarioLlamadasEstado, coloresEstado]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return propietarios.filter((p) => {
      if (estadoActivo) {
        const estadosProp = estadosPorPropietario.get(p.id_propietario) ?? [];
        const tieneEstado = estadosProp.some(
          (e) => (e.estado_llamada ?? 'Pendiente') === estadoActivo
        );
        if (!tieneEstado) return false;
      }
      if (!q) return true;
      return [p.nombre_completo, p.documento_identidad, p.numero_telefono].some((v) =>
        v?.toLowerCase().includes(q)
      );
    });
  }, [propietarios, busqueda, estadoActivo, estadosPorPropietario]);

  const cerrarPropietario = () => {
    setSelProp(null);
    setContratos([]);
    setSelContrato(null);
    setLlamadas([]);
  };

  const seleccionarPropietario = async (p: PropietarioResumen) => {
    setSelProp(p);
    setSelContrato(null);
    setLlamadas([]);
    setContratos([]);
    setLoading('cont');
    setError(null);
    try {
      setContratos(await getContratosInmueblesByPropietario(p.id_propietario));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const seleccionarContrato = async (idx: number, idLlamada: number | null) => {
    setSelContrato(idx);
    setLlamadas([]);
    if (!idLlamada) return;
    setLoading('lla');
    setError(null);
    try {
      setLlamadas(await getLlamadasByIdLlamada(idLlamada));
      console.log(llamadas)
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const compactoProp = !!selProp;
  const compactoContrato = selContrato !== null;
  const contratoSel = selContrato !== null ? contratos[selContrato] : null;

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-1 items-start overflow-x-auto pb-2">
        {/* Columna 1: Propietarios */}
        <Card
          className={cn(
            'shrink-0 transition-all duration-300',
            compactoProp ? 'w-72' : 'w-full'
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-4" /> Propietarios
              <Badge variant="secondary">{filtrados.length}</Badge>
            </CardTitle>
            {!compactoProp && (
              <CardDescription>Selecciona un propietario para ver sus contratos e inmuebles.</CardDescription>
            )}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar…"
                className="pl-8"
              />
            </div>
            {!loadingEstados && estadosResumen.length > 0 && (
              <div
                className="flex flex-wrap gap-2 pt-1"
                role="group"
                aria-label="Filtrar por estado de llamada"
              >
                <button
                  type="button"
                  onClick={() => setEstadoActivo(null)}
                  aria-pressed={estadoActivo === null}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    estadoActivo === null
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  )}
                >
                  Todas <span className="ml-1 tabular-nums opacity-70">{propietarios.length}</span>
                </button>
                {estadosResumen.map(([estado, { count, color }]) => {
                  const activo = estadoActivo === estado;
                  return (
                    <button
                      key={estado}
                      type="button"
                      onClick={() => setEstadoActivo(activo ? null : estado)}
                      aria-pressed={activo}
                      className={cn(
                        'flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                        activo
                          ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800'
                          : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
                      )}
                    >
                      <Badge variant={color as BadgeVariant} className="rounded-full px-2 py-0.5">
                        {estado}
                      </Badge>
                      <span className="tabular-nums text-zinc-600 dark:text-zinc-300">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading === 'prop' ? (
              <ListSkeleton />
            ) : compactoProp ? (
              <div className="max-h-[65vh] space-y-1 overflow-y-auto">
                {filtrados.map((p) => {
                  const activo = selProp?.id_propietario === p.id_propietario;
                  const estados = estadosPorPropietario.get(p.id_propietario) ?? [];
                  return (
                    <button
                      key={`${p.id_propietario}-${p.create_at}`}
                      onClick={() => seleccionarPropietario(p)}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                        activo && 'border-primary bg-accent'
                      )}
                    >
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <span className="truncate">{p.nombre_completo}</span>
                        {loadingEstados ? (
                          <Skeleton className="h-4 w-12 rounded-full" />
                        ) : (
                          estados.map((est, i) => (
                            <Badge
                              key={`${est.estado_llamada}-${i}`}
                              variant={
                                (est.color as BadgeVariant) ||
                                (est.estado_llamada ? coloresEstado[est.estado_llamada] : undefined) ||
                                'secondary'
                              }
                            >
                              {est.estado_llamada ?? 'Sin estado'}: {est.total_llamadas ?? 0}
                            </Badge>
                          ))
                        )}
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto [&_[data-slot=table-container]]:overflow-visible">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-card shadow-xs">
                    <TableRow className="hover:bg-card">
                      <TableHead>Propietario</TableHead>
                      <TableHead>Estado de llamada</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtrados.map((p) => {
                      const estados = estadosPorPropietario.get(p.id_propietario) ?? [];
                      return (
                        <TableRow
                          key={`${p.id_propietario}-${p.create_at}`}
                          onClick={() => seleccionarPropietario(p)}
                          className="cursor-pointer"
                        >
                          <TableCell className="font-medium">{p.nombre_completo}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {loadingEstados ? (
                                <Skeleton className="h-5 w-16 rounded-full" />
                              ) : estados.length > 0 ? (
                                estados.map((est, i) => {
                                  const nombreEstado = est.estado_llamada ?? 'Pendiente';
                                  return (
                                    <Badge
                                      key={`${nombreEstado}-${i}`}
                                      variant={
                                        (est.color as BadgeVariant) ||
                                        coloresEstado[nombreEstado] ||
                                        'secondary'
                                      }
                                    >
                                      {nombreEstado}: {est.total_llamadas ?? 0}
                                    </Badge>
                                  );
                                })
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{p.documento_identidad}</TableCell>
                          <TableCell>{p.numero_telefono}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{p.create_at}</Badge>
                            {p.create_at === new Date().toLocaleDateString() ?
                              <Badge className='mx-2' variant={p.create_at === new Date().toLocaleDateString() ? "green" : "outline"}>
                                {p.create_at === new Date().toLocaleDateString() ? "Nuevo" : ""}</Badge>
                              : <></>
                            }
                          </TableCell>
                          <TableCell>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Sin resultados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Columna 2: Contratos e inmuebles */}
        {selProp && (
          <Card
            className={cn(
              'shrink-0 transition-all duration-300 animate-in slide-in-from-right-4 fade-in',
              compactoContrato ? 'w-80' : 'min-w-0 flex-1'
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-4" /> Contratos e inmuebles
                  </CardTitle>
                  <CardDescription className="truncate">{selProp.nombre_completo}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={cerrarPropietario} aria-label="Cerrar">
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading === 'cont' ? (
                <ListSkeleton rows={3} />
              ) : contratos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin contratos ni inmuebles.</p>
              ) : compactoContrato ? (
                <div className="max-h-[65vh] space-y-1 overflow-y-auto">
                  {contratos.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => seleccionarContrato(idx, c.id_llamada)}
                      className={cn(
                        'flex w-full flex-col rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                        selContrato === idx && 'border-primary bg-accent'
                      )}
                    >
                      <span className="font-medium">{c.nro_contrato ?? 'S/N'}</span>
                      <span className="text-xs text-muted-foreground">
                        Remax {c.id_remax} · {c.create_at}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nro. contrato</TableHead>
                      <TableHead>ID Remax</TableHead>
                      <TableHead>N° partida</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratos.map((c, idx) => (
                      <TableRow
                        key={idx}
                        onClick={() => seleccionarContrato(idx, c.id_llamada)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">{c.nro_contrato}</TableCell>
                        <TableCell>{c.id_remax}</TableCell>
                        <TableCell>{c.n_partida}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.create_at}</Badge>
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Columna 3: Llamadas */}
        {selProp && contratoSel && (
          <Card className="min-w-[22rem] flex-1 animate-in slide-in-from-right-4 fade-in">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="size-4" /> Llamadas realizadas
                    <Badge variant="secondary">{llamadas.length}</Badge>
                  </CardTitle>
                  <CardDescription className='mt-2'>
                    Contrato {contratoSel.nro_contrato} · partida {contratoSel.n_partida ?? '—'}
                    {contratoSel.id_remax != null && <Badge className='mx-2' variant="outline">ID Remax {contratoSel.id_remax}</Badge>}
                  </CardDescription>
                </div>
                {loading !== 'lla' &&
                  (llamadas.length === 0 ? (
                    <Button size="sm" onClick={() => abrirDialogo(null)}>
                      <Plus className="size-4" /> Agregar llamada
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => abrirDialogo(llamadas[0])}>
                      <Pencil className="size-4" /> Editar llamada
                    </Button>
                  ))}
              </div>
            </CardHeader>
            <CardContent>
              {loading === 'lla' ? (
                <ListSkeleton rows={3} />
              ) : llamadas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin llamadas realizadas.</p>
              ) : (
                <div className="max-h-[65vh] space-y-3 overflow-y-auto">
                  {llamadas.map((l, index) => {
                    return (
                      <div key={l.id} className="space-y-2 rounded-md border p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {l.id != null && <small className='text-gray-500'># {l.id}</small>}

                        </div>
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                          {l.estado_llamada?.estado_llamada && (
                            <div className="contents">
                              <dt className="text-muted-foreground">Estado</dt>
                              <dd className="whitespace-pre-line break-words">
                                <Badge variant={l.estado_llamada?.color as BadgeVariant}>{l.estado_llamada?.estado_llamada}</Badge>
                              </dd>
                            </div>
                          )}
                          {l.fecha_bienvenida && (
                            <div className="contents">
                              <dt className="text-muted-foreground">Fecha Bienvenida</dt>
                              <dd className="whitespace-pre-line break-words">
                                {new Date(l.fecha_bienvenida).toLocaleDateString()}
                              </dd>
                            </div>
                          )}
                          {l.curso_llamada?.trim() && (
                            <div className="contents">
                              <dt className="text-muted-foreground">Curso Llamada</dt>
                              <dd className="whitespace-pre-line break-words">{l.curso_llamada}</dd>
                            </div>
                          )}
                          {l.observacion?.trim() && (
                            <div className="contents">
                              <dt className="text-muted-foreground">Observación</dt>
                              <dd className="whitespace-pre-line break-words">{l.observacion}</dd>
                            </div>
                          )}
                          {l.fecha_seguimiento_llamada && (
                            <div className="contents">
                              <dt className="text-muted-foreground">Fecha Seguimiento Llamada</dt>
                              <dd className="whitespace-pre-line break-words">
                                {new Date(l.fecha_seguimiento_llamada).toLocaleDateString()}
                              </dd>
                            </div>
                          )}
                          {l.observacion_seguimiento?.trim() && (
                            <div className="contents">
                              <dt className="text-muted-foreground">Observacion Seguimiento</dt>
                              <dd className="whitespace-pre-line break-words">
                                {l.observacion_seguimiento}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {contratoSel && (
        <DialogLlamada
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          idPropiedadPropietario={contratoSel.id_propiedad_propietario}
          llamada={llamadaEdit}
          descripcion={`Contrato ${contratoSel.nro_contrato} · ${selProp?.nombre_completo ?? ''}`}
          onSaved={onLlamadaGuardada}
        />
      )}
    </div>
  );
}
