"use client"

import type { LegacyColumnDef } from "@tanstack/react-table/legacy"
import { DataTableColumnHeader } from "@/components/data-table"
import { LlamadasRowDetalle } from "@/lib/supabase/queries/llamadas"
import { Badge, BadgeVariant } from "../ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhone } from "@fortawesome/free-solid-svg-icons"


function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "--"
  return String(value)
}


function formatFechaRegistro(value: any) {
  if (!value) return "";
  const date: any = typeof value === "string" || typeof value === "number"
    ? new Date(value)
    : value; // fallback if already Date
  return date.toLocaleDateString("es-PE", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}


export const columns: LegacyColumnDef<LlamadasRowDetalle, unknown>[] = [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="id" />
  //   ),
  //   cell: ({ row }) => (
  //     <span className="font-mono">{formatCell(row.getValue("id"))}</span>
  //   ),
  // },
  {
    accessorKey: "id_remax",
    // id_remax es numérico: el filtro automático usaría "inNumberRange".
    // Forzamos una búsqueda por texto (contiene).
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (value === null || value === undefined) return false
      return String(value)
        .toLowerCase()
        .includes(String(filterValue ?? "").trim().toLowerCase())
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID REMAX / REF" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("id_remax"))}</span>
    ),
  },
  {
    accessorKey: "propietario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propietario" />
    ),
    cell: ({ row }) => formatCell(row.getValue("propietario")),
  },
  {
    accessorKey: "documento_identidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documento Identidad" />
    ),
    cell: ({ row }) => formatCell(row.getValue("documento_identidad")),
  },
  {
    accessorKey: "renovacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Renovacion" />
    ),
    cell: ({ row }) => formatCell(row.getValue("renovacion")),
  },
   {
     accessorKey: "fecha_contrato_recibido",
     header: ({ column }) => (
       <DataTableColumnHeader column={column} title="Fecha Contrato Recibido" />
     ),
     cell: ({ row }) => {return formatFechaRegistro(row.getValue("fecha_contrato_recibido"))},
   },
  {
    accessorKey: "numero_telefono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Numero de Telefono" />
    ),
    cell: ({ row }) => {
      const numero = row.getValue("numero_telefono");
      const numeroSanitizado = typeof numero === "string"
        ? numero.replace(/[^\d]/g, "")
        : "";
      return (
        <div className="flex items-center space-x-2">
          <span>{formatCell(numero)}</span>
          {numeroSanitizado && (
            <a
              href={`https://wa.me/${numeroSanitizado}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors"
            >
              <FontAwesomeIcon icon={faPhone} />
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "nro_contrato",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nro Contrato" />
    ),
    cell: ({ row }) => formatCell(row.getValue("nro_contrato")),
  },
  {
    accessorKey: "Dias_Transcurridos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Días Transcurridos" />
    ),
    cell: ({ row }) => {
      const fechaRegistroValue = row.getValue("fecha_registro");
      const value = row.getValue("fecha_bienvenida");
      if (!value) return "";
      const date = new Date(value as Date);
      // Formatear la fecha como yyyy-mm-dd sin horas, minutos ni segundos
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getUTCDate()).padStart(2, '0');
      const fechaBienvenidaST = `${yyyy}-${mm}-${dd}`;

      const parseDate = (v: any) => {
        if (!v) return undefined;
        if (typeof v === "string" || typeof v === "number") return new Date(v);
        if (v instanceof Date) return v;
        return undefined;
      };

      const fechaRegistroParsed = parseDate(fechaRegistroValue);
      const fechaBienvenidaParsed = parseDate(fechaBienvenidaST);

      if (!fechaRegistroParsed || !fechaBienvenidaParsed) {
        return "";
      }

      // Nueva lógica: comparar fecha de registro con 20-10-2026
      const fechaLimite = new Date(Date.UTC(2026, 9, 19)); // Mes es base 0, así que octubre es 9
      const fechaRegistroTimestamp = Date.UTC(
        fechaRegistroParsed.getFullYear(),
        fechaRegistroParsed.getMonth(),
        fechaRegistroParsed.getDate()
      );

      // Convertir ambas fechas a Unix timestamp (al iniciar el día)
      const unixRegistro = Date.UTC(
        fechaRegistroParsed.getFullYear(),
        fechaRegistroParsed.getMonth(),
        fechaRegistroParsed.getDate()
      ) / 1000; // en segundos
      const unixBienvenida = Date.UTC(
        fechaBienvenidaParsed.getFullYear(),
        fechaBienvenidaParsed.getMonth(),
        fechaBienvenidaParsed.getDate()
      ) / 1000; // en segundos

      // Calcular días transcurridos restando los unix timestamps y dividiendo por número de segundos por día
      const segundosPorDia = 60 * 60 * 24;
      const diasTranscurridos = Math.floor((unixBienvenida - unixRegistro) / segundosPorDia);

      // Mostrar el Badge sólo si la fecha de registro es mayor o igual al 20-10-2026
      const mostrarBadge = fechaRegistroTimestamp >= fechaLimite.getTime();

      return (
        <span>
          {mostrarBadge && (
            <Badge className="ms-2" variant={diasTranscurridos < 1 ? "green" : "red"}>
              {diasTranscurridos} días
            </Badge>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "is_expired",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contrato" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("is_expired");
      return (
        <Badge variant={value ? "red" : "green"}>
          {value ? "Expirado" : "Vigente"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "conformidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conformidad" />
    ),
    cell: ({ row }) => formatCell(row.getValue("conformidad")),
  },
  {
    accessorKey: "estado_llamada",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado Llamada" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("estado_llamada");
    //  const color:BadgeVariant = row.getValue("color") || "default";
      const color:BadgeVariant = row?.original?.color as BadgeVariant || "default"
      if (!value) return null;
      return (
        <>
        <Badge variant={color}>
            {formatCell(value)}
        </Badge>
        </>
      );
    },
  },
  {
    accessorKey: "asociado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asociado" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("asociado"))}</span>
    ),
  },
  {
    accessorKey: "tipo_propiedad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Propiedad" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("tipo_propiedad"))}</span>
    ),
  },
  {
    accessorKey: "direccion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Direccion" />
    ),
    cell: ({ row }) => formatCell(row.getValue("direccion")),
  },
  {
    accessorKey: "tipo_negocio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Negocio" />
    ),
    cell: ({ row }) => formatCell(row.getValue("tipo_negocio")),
  },
  {
    accessorKey: "modalidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Contrato / Modalidad" />
    ),
    cell: ({ row }) => formatCell(row.getValue("modalidad")),
  },
  {
    accessorKey: "fecha_bienvenida",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Bienvenida" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("fecha_bienvenida");
      if (!value) return "";
      // Cuando se trabaja con fechas en JavaScript, a veces surgen confusiones con los husos horarios (timezone).
      // Si se ve que al convertir la fecha y extraer el día da el anterior (es decir, dd - 1), probablemente 
      // es porque la hora original está en UTC y al convertirla a local puede "restar" un día si la zona horaria 
      // local está detrás de UTC. Sin embargo, en este formato, simplemente extraemos la fecha tal cual, sin ajustar:
      const date = new Date(value as Date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getUTCDate()).padStart(2, '0');
      // Si necesitas consistencia independientemente del huso horario, asegúrate de trabajar siempre en UTC (getUTCDate()).
      return `${yyyy}-${mm}-${dd}`;
    },
  },
  {
    accessorKey: "fecha_registro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Registro" />
    ),
    cell: ({ row }) => formatCell(row.getValue("fecha_registro")),
  },
]




/*
       const value:Date = row.getValue("fecha_contrato_recibido");
       if (!value) return "";
       const date: any =
         typeof value === "string" || typeof value === "number"
           ? new Date(value)
           : value;
       // Cálculo de días pasados
       const now = new Date();
       // Limpiar HH:MM:SS para ambos para obtener solo días completos
       const msPerDay = 1000 * 60 * 60 * 24;
       const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
       const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       const diff = Math.floor((end.getTime() - start.getTime() - 1) / msPerDay);
       return (
         <span className="flex items-center gap-2">
           {date.toLocaleDateString("es-PE", {
             timeZone: "UTC",
             year: "numeric",
             month: "2-digit",
             day: "2-digit"
           })}
      
           <Badge variant={diff < 1 ? 'green' : 'red' } className="ml-1">
             {diff} días
           </Badge>
         </span>
       );

*/