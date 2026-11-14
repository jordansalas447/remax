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
} from '@/lib/supabase/queries/gestion_llamadas_jerarquia';
import type { LlamadasRow } from '@/lib/supabase/queries/llamadas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  const [llamadas, setLlamadas] = useState<LlamadasRow[]>([]);
  const [selProp, setSelProp] = useState<PropietarioResumen | null>(null);
  const [selContrato, setSelContrato] = useState<number | null>(null);
  const [loading, setLoading] = useState<'prop' | 'cont' | 'lla' | null>('prop');
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [llamadaEdit, setLlamadaEdit] = useState<LlamadasRow | null>(null);

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
  };

  useEffect(() => {
    getPropietariosConPropiedades()
      .then(setPropietarios)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(null));
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return propietarios;
    return propietarios.filter((p) =>
      [p.nombre_completo, p.documento_identidad, p.numero_telefono].some((v) =>
        v?.toLowerCase().includes(q)
      )
    );
  }, [propietarios, busqueda]);

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
          </CardHeader>
          <CardContent>
            {loading === 'prop' ? (
              <ListSkeleton />
            ) : compactoProp ? (
              <div className="max-h-[65vh] space-y-1 overflow-y-auto">
                {filtrados.map((p) => {
                  const activo = selProp?.id_propietario === p.id_propietario;
                  return (
                    <button
                      key={`${p.id_propietario}-${p.create_at}`}
                      onClick={() => seleccionarPropietario(p)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                        activo && 'border-primary bg-accent'
                      )}
                    >
                      <span className="truncate">{p.nombre_completo}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtrados.map((p) => (
                      <TableRow
                        key={`${p.id_propietario}-${p.create_at}`}
                        onClick={() => seleccionarPropietario(p)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">{p.nombre_completo}</TableCell>
                        <TableCell>{p.documento_identidad}</TableCell>
                        <TableCell>{p.numero_telefono}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.create_at}</Badge>
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
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
                  <CardDescription>
                    Contrato {contratoSel.nro_contrato} · partida {contratoSel.n_partida ?? '—'}
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
                          {/* {l.id != null && <small className='text-gray-500'># {l.id}</small>} */}
                          {l.id_remax != null && <Badge variant="outline">ID Remax {l.id_remax}</Badge>}
                        </div>
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
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
