import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";

interface HistorialObservacionesProps {
  historial_observacioness?: any[] | null; // could type more strictly if known
  loading?: boolean;
}

export const HistorialObservaciones: React.FC<HistorialObservacionesProps> = ({
  historial_observacioness = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="border border-blue-200 p-4 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-100">
        <p className="mb-1 font-medium">Historial de observaciones</p>
        <Timeline defaultValue={1} className="w-full max-w-md mt-4">
          <TimelineItem step={1}>
            <TimelineHeader>
              <TimelineDate>
                <Skeleton className="w-16 h-4" />
              </TimelineDate>
              <TimelineTitle>
                <Skeleton className="w-32 h-5" />
              </TimelineTitle>
            </TimelineHeader>
            <TimelineIndicator />
            <TimelineSeparator />
            <TimelineContent>
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-3 w-1/6" />
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>
    );
  }

  if (!Array.isArray(historial_observacioness) || historial_observacioness.length === 0) {
    return null;
  }

  // Flatten historial_observacioness if it's a nested structure (like: [[obs,obs],[obs]])
  const flattened =
    Array.isArray(historial_observacioness[0])
      ? historial_observacioness.flat().filter(Boolean)
      : historial_observacioness.filter(Boolean);

  // Invertir el orden del timeline
  const flattenedReversed = [...flattened].reverse();

  return (
    <section className="border border-blue-200 p-4 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-100">
      <p className="mb-1 font-medium">Historial de observaciones</p>
      <Timeline defaultValue={1} className="w-full max-w-md mt-4">
        {flattenedReversed.map((obs: any, idx: number) => {
          if (!obs?.observacion && !obs?.fecha_creacion) return null;

          // Try to parse and localize date
          let fechaLocal = "";
          if (obs.fecha_creacion) {
            try {
              const fecha = new Date(obs.fecha_creacion);
              // Ajuste horario, si necesario
              fecha.setHours(fecha.getHours() - 5);
              fechaLocal = fecha.toLocaleString("es-PE", { timeZone: "America/Lima" });
            } catch {
              fechaLocal = obs.fecha_creacion;
            }
          }
  

          return (
            <TimelineItem step={idx + 1} key={idx} >
              <TimelineHeader>
                 <TimelineTitle>
                 {obs.alcance.alcance}
                </TimelineTitle> 
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                {obs.observacion} 
              </TimelineContent>
              <TimelineDate>
                  {fechaLocal}
                </TimelineDate>
            </TimelineItem>
          );
        })}
      </Timeline>
    </section>
  );
};

export default HistorialObservaciones;