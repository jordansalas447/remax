'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, FileText, RefreshCcw, Search, X } from 'lucide-react';
import { getAsociados, type AsociadoListItem } from '@/lib/supabase/queries/asociados';
import {
  getMultas,
  getTiposMulta,
  type MultaDetalle,
  type TipoMultaRow,
} from '@/lib/supabase/queries/multas';
import { InputSearch } from '@/components/input-search/input-search';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import MultaPDF, { type MultaPDFProps } from '@/components/multas/MultaPDF';

const fecha = (v?: string | null) => (v ? v.slice(0, 10) : '—');
const moneda = (v?: number | null) =>
  v == null ? '—' : `$ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

export default function MultasAsociadoPage() {
  const [multas, setMultas] = useState<MultaDetalle[]>([]);
  const [asociados, setAsociados] = useState<AsociadoListItem[]>([]);
  const [tiposMulta, setTiposMulta] = useState<TipoMultaRow[]>([]);

  const [asociadoId, setAsociadoId] = useState<number | null>(null);
  const [searchAsociado, setSearchAsociado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<MultaPDFProps | null>(null);

  const montoMulta = (m: MultaDetalle) => Number(m.monto ?? m.tipo_multa?.monto) || 0;

  const descripcionMulta = (m: MultaDetalle) =>
    [m.tipo_multa?.resumen ?? m.tipo, m.descripcion].filter(Boolean).join(' — ') || 'Multa';

  const abrirPreviewMulta = (m: MultaDetalle) => {
    setPreviewData({
      codigo: `${String(m.codigo)}`,
      logo: '/LogoRemax.png',
      fecha: fecha(m.fecha_multa ?? m.fecha),
      responsable: m.asociado?.nombre_completo ?? 'Administración RE/MAX Adelante',
      cargo: m.asociado ? 'Asociado' : 'Administrador',
      detalles: [{ descripcion: descripcionMulta(m), monto: montoMulta(m) }],
    });
  };

  const abrirPreviewFiltradas = () => {
    const asoc = asociadoId ? asociados.find((a) => a.id_asociado === asociadoId) : null;
    setPreviewData({
      codigo: `MULT-${new Date().getFullYear()}-${String(asoc?.id_asociado ?? 0).padStart(4, '0')}`,
      logo: '/LogoRemax.png',
      fecha: new Date().toISOString().slice(0, 10),
      responsable: asoc?.nombre_completo ?? 'Administración RE/MAX Adelante',
      cargo: asoc ? 'Asociado' : 'Administrador',
      detalles:
        filtradas.length > 0
          ? filtradas.map((m) => ({
              descripcion: `#${m.id} (${fecha(m.fecha_multa ?? m.fecha)}) · ${descripcionMulta(m)}`,
              monto: montoMulta(m),
            }))
          : [{ descripcion: 'Sin multas registradas', monto: 0 }],
    });
  };

  const cargar = () => {
    setLoading(true);
    setError(null);
    return Promise.all([
      getMultas(),
      getAsociados().catch(() => [] as AsociadoListItem[]),
      getTiposMulta().catch(() => [] as TipoMultaRow[]),
    ])
      .then(([listaMultas, listaAsociados, listaTipos]) => {
        setMultas(listaMultas);
        setAsociados(listaAsociados);
        setTiposMulta(listaTipos);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'No se pudieron cargar las multas.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return multas.filter((m) => {
      if (asociadoId != null && m.id_asociado !== asociadoId) return false;
      if (!q) return true;
      return [
        m.asociado?.nombre_completo,
        m.descripcion,
        m.estado,
        m.tipo,
        m.tipo_multa?.resumen,
        m.tipo_multa?.descripcion,
        m.justificacion?.motivo,
      ].some((v) => v?.toLowerCase().includes(q));
    });
  }, [multas, asociadoId, busqueda]);

  const totalMonto = useMemo(
    () => filtradas.reduce((acc, m) => acc + (Number(m.monto ?? m.tipo_multa?.monto) || 0), 0),
    [filtradas]
  );

  return (
    <main className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Multas por asociado</h1>
          <p className="text-sm text-muted-foreground">
            Consulta y filtra las multas registradas ({tiposMulta.length} tipos configurados).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={abrirPreviewFiltradas}
            disabled={loading}
          >
            <FileText className="size-4" /> Vista previa PDF
          </Button>
          <Button variant="outline" size="sm" onClick={cargar} disabled={loading}>
            <RefreshCcw className="size-4" /> Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Filtros y resumen */}
      <Card>
        <CardContent className="grid gap-3 pt-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="flex items-center gap-2">
            <InputSearch
              className="min-w-0 flex-1"
              search={searchAsociado}
              setSearch={setSearchAsociado}
              selectedId={asociadoId}
              setSelectedId={setAsociadoId}
              filteredItems={asociados}
              loading={loading}
              getOptionLabel={(a) => a.nombre_completo ?? `Asociado #${a.id_asociado}`}
              getOptionValue={(a) => a.id_asociado}
              inputPlaceholder="Buscar asociado..."
              selectPlaceholder="Todos los asociados"
            />
            {asociadoId != null && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAsociadoId(null)}
                title="Quitar filtro de asociado"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por descripción, tipo, estado o justificación..."
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{filtradas.length} multas</Badge>
            <Badge variant="outline">Total {moneda(totalMonto)}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de multas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de multas</CardTitle>
          <CardDescription>
            {asociadoId
              ? `Mostrando multas del asociado seleccionado.`
              : 'Mostrando todas las multas activas.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Asociado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Justificación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      No hay multas registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtradas.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-muted-foreground tabular-nums">#{m.id}</TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">{m.codigo}</TableCell>
                      <TableCell className="tabular-nums">
                        {fecha(m.fecha_multa ?? m.fecha)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {m.asociado?.nombre_completo ?? (m.id_asociado ? `#${m.id_asociado}` : '—')}
                      </TableCell>
                      <TableCell>
                        {m.tipo_multa?.resumen ?? m.tipo ?? '—'}
                        {m.tipo_multa?.aviso && (
                          <Badge variant="outline" className="ml-1.5">
                            {m.tipo_multa.aviso}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {m.descripcion || '—'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {m.justificacion?.motivo ?? m.justificacion?.descripcion ?? '—'}
                      </TableCell>
                      <TableCell>
                        {m.estado ? <Badge variant="secondary">{m.estado}</Badge> : '—'}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {moneda(m.monto ?? m.tipo_multa?.monto)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirPreviewMulta(m)}
                          title="Vista previa del PDF de esta multa"
                        >
                          <Eye className="size-4" /> Ver PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={previewData !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewData(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista previa · {previewData?.codigo}</DialogTitle>
            <DialogDescription>
              Notificación de multa — {previewData?.responsable}
            </DialogDescription>
          </DialogHeader>
          {previewData && <MultaPDF {...previewData} />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
