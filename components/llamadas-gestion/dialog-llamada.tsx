'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/native-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { guardarLlamada, type LlamadasRow } from '@/lib/supabase/queries/llamadas';
import { getEstadoLlamadas } from '@/lib/supabase/queries/estado_llamada';

type Estado = Awaited<ReturnType<typeof getEstadoLlamadas>>[number];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idPropiedadPropietario: number;
  /** Llamada a editar; si es null se crea una nueva */
  llamada: LlamadasRow | null;
  descripcion?: string;
  onSaved: (llamada: LlamadasRow) => void;
};

const vacio = {
  fecha_bienvenida: '',
  id_estado_llamada: '',
  curso_llamada: '',
  observacion: '',
  fecha_seguimiento_llamada: '',
  observacion_seguimiento: '',
};

export default function DialogLlamada({
  open,
  onOpenChange,
  idPropiedadPropietario,
  llamada,
  descripcion,
  onSaved,
}: Props) {
  const [form, setForm] = useState(vacio);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEstadoLlamadas().then(setEstados).catch(() => setEstados([]));
  }, []);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      llamada
        ? {
          fecha_bienvenida: llamada.fecha_bienvenida?.slice(0, 10) ?? '',
          id_estado_llamada: llamada.id_estado_llamada?.toString() ?? '',
          curso_llamada: llamada.curso_llamada ?? '',
          observacion: llamada.observacion ?? '',
          fecha_seguimiento_llamada: llamada.fecha_seguimiento_llamada?.slice(0, 10) ?? '',
          observacion_seguimiento: llamada.observacion_seguimiento ?? '',
        }
        : vacio
    );
  }, [open, llamada]);

  const set = (k: keyof typeof vacio) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const guardar = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data } = await guardarLlamada(
        {
          fecha_bienvenida: form.fecha_bienvenida || null,
          id_estado_llamada: form.id_estado_llamada ? Number(form.id_estado_llamada) : null,
          curso_llamada: form.curso_llamada || null,
          observacion: form.observacion || null,
          fecha_seguimiento_llamada: form.fecha_seguimiento_llamada || null,
          observacion_seguimiento: form.observacion_seguimiento || null,
        },
        idPropiedadPropietario,
        llamada?.id ?? null
      );
      onSaved(data as LlamadasRow);
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar la llamada.');
    } finally {
      setSaving(false);
    }
  };

  const label = 'text-sm font-medium';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{llamada ? `Editar llamada #${llamada.id}` : 'Agregar llamada'}</DialogTitle>
          {descripcion && <DialogDescription>{descripcion}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* <div className="space-y-1">
              <label className={label}>Fecha bienvenida</label>
              <Input type="date" value={form.fecha_bienvenida} onChange={set('fecha_bienvenida')} />
            </div> */}
            <div className="space-y-1">
              <label className={label}>Estado</label>
              <NativeSelect value={form.id_estado_llamada} onChange={set('id_estado_llamada')}>
                <option value="">Sin estado</option>
                {estados
                  .filter((e) => !e.eliminado)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.estado_llamada}
                    </option>
                  ))}
              </NativeSelect>
            </div>
          </div>
          <div className="space-y-1">
            <label className={label}>Curso de llamada</label>
            <Input value={form.curso_llamada} onChange={set('curso_llamada')} />
          </div>
          <div className="space-y-1">
            <label className={label}>Observación</label>
            <Textarea rows={3} value={form.observacion} onChange={set('observacion')} />
          </div>
          {/* <div className="space-y-1">
            <label className={label}>Fecha de seguimiento</label>
            <Input
              type="date"
              value={form.fecha_seguimiento_llamada}
              onChange={set('fecha_seguimiento_llamada')}
            />
          </div> */}
          <div className="space-y-1">
            <label className={label}>Observación de seguimiento</label>
            <Textarea
              rows={3}
              value={form.observacion_seguimiento}
              onChange={set('observacion_seguimiento')}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

