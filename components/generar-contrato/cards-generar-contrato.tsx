"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  CalendarDays,
  Clock,
  FileText,
  FileX2,
  Search,
  UserCheck,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { DocumentosRowDetalle, LimiteDiarioDocumentosxAsesorRow } from "@/lib/supabase/queries/documentos"

const BADGE_VARIANTS = new Set<string>([
  "link",
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "blue",
  "green",
  "red",
  "yellow",
  "amber",
  "pink",
  "violet",
  "indigo",
  "orange",
  "teal",
  "gray",
])

interface TablaGenerarContratoProps {
  documentos: DocumentosRowDetalle[],
  contador: LimiteDiarioDocumentosxAsesorRow | null
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—"
  const date = typeof value === "string" || typeof value === "number"
    ? new Date(value)
    : value
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function getFechaExpiracion(
  emitido: string | null | undefined,
  plazo: number | null | undefined,
) {
  if (!emitido) return null
  const fecha = new Date(emitido)
  if (Number.isNaN(fecha.getTime())) return null
  fecha.setDate(fecha.getDate() + (plazo ?? 0))
  return fecha
}

function toBadgeVariant(color?: string | null): BadgeVariant {
  const value = color?.trim().toLowerCase() ?? ""
  if (BADGE_VARIANTS.has(value)) return value as BadgeVariant
  return "gray"
}

function isHexColor(color?: string | null) {
  return Boolean(color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color.trim()))
}

function expirationVariant(fecha: Date | null): BadgeVariant {
  if (!fecha) return "gray"
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const limite = new Date(fecha)
  limite.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil(
    (limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays < 0) return "red"
  if (diffDays <= 7) return "amber"
  return "green"
}

export default function CardsGenerarContrato({
  documentos,
  contador
}: TablaGenerarContratoProps) {
  const [filtro, setFiltro] = useState("")

  const documentosFiltrados = useMemo(() => {
    const query = filtro.trim().toLowerCase()
    if (!query) return documentos
    return documentos.filter((documento) =>
      documento.nro_contrato.toLowerCase().includes(query),
    )
  }, [documentos, filtro])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-0 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="h-9 max-w-sm bg-white">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            placeholder="Filtrar n° contrato..."
          />
        </InputGroup>
        <div className="my-2">
          <Badge variant="outline" className="m-1">
            {documentosFiltrados.length} documento
            {documentosFiltrados.length === 1 ? "" : "s"}
          </Badge>
          <Badge variant="outline" className="m-1">
            Límite Diario: {contador?.limite_diario}
          </Badge>
          <Badge variant="outline" className="m-1">
            Total Diario: {contador?.total_generados}
          </Badge>
          <Badge variant="outline" className="m-1">
            Disponibles: {contador?.disponibles}
          </Badge>
        </div>
      </div>

      {documentosFiltrados.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <FileX2 className="size-8 text-zinc-400" />
            <p className="text-sm text-zinc-500">
              {documentos.length === 0
                ? "Aún no hay contratos generados."
                : "No hay contratos que coincidan con el filtro."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-3">
          {documentosFiltrados.map((documento) => (
            <DocumentoCard key={documento.id} documento={documento} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DocumentoCard({ documento }: { documento: DocumentosRowDetalle }) {
  const fechaExpiracion = getFechaExpiracion(
    documento.created_at,
    documento.plazo,
  )
  const estadoColor = documento.estado_documento?.color
  const operacionColor = documento.operacion?.color

  //console.log(documento)

  return (
    <Card className="rounded-none shadow-none">
      <CardHeader className="gap-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 shrink-0 text-black-600" />
            <span className="font-mono">{documento.nro_contrato}</span>
          </CardTitle>
          <Badge
            variant={
              isHexColor(estadoColor) ? "default" : toBadgeVariant(estadoColor)
            }
            style={
              isHexColor(estadoColor)
                ? { backgroundColor: estadoColor ?? undefined, color: "#fff" }
                : undefined
            }
          >
            {documento.estado_documento?.estado ?? "Sin estado"}
          </Badge>
        </div>
        <CardDescription className="flex flex-wrap gap-1.5">
          <Badge variant="outline">
            {documento.tipo_contrato?.tipo_contrato ?? "Sin tipo"}
          </Badge>
          <Badge
            variant={
              isHexColor(operacionColor)
                ? "secondary"
                : toBadgeVariant(operacionColor)
            }
            style={
              isHexColor(operacionColor)
                ? {
                  backgroundColor: operacionColor ?? undefined,
                  color: "#fff",
                }
                : undefined
            }
          >
            {documento.operacion?.operacion ?? "Sin operación"}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <span>Emisión: {formatDate(documento.created_at)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Clock className="size-4 shrink-0" />
          <span>Expira: {formatDate(fechaExpiracion)}</span>
          {/* <Badge variant="outline">{documento.plazo ?? 0} días</Badge> */}
          {/* <Badge variant={expirationVariant(fechaExpiracion)}>
            {expirationVariant(fechaExpiracion) === "red"
              ? "Vencido"
              : expirationVariant(fechaExpiracion) === "amber"
                ? "Por vencer"
                : "Vigente"}
          </Badge> */}
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-4 shrink-0" />
          <span>
            {documento.nro_propietarios ?? 0} propietario
            {(documento.nro_propietarios ?? 0) === 1 ? "" : "s"}
          </span>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-1.5">
          <Badge variant={documento.empresa ? "blue" : "gray"}>
            <Building2 data-icon="inline-start" />
            Empresa: {documento.empresa ? "Sí" : "No"}
          </Badge>
          <Badge variant={documento.apoderado ? "violet" : "gray"}>
            <UserCheck data-icon="inline-start" />
            Apoderado: {documento.apoderado ? "Sí" : "No"}
          </Badge>
        </div>

        {documento.motivo_anulacion ? (
          <p className="bg-red-50 px-2.5 py-2 text-xs text-red-800">
            Motivo anulación: {documento.motivo_anulacion}
          </p>
        ) : null}
        {documento.descripcion ? (
          <p className="bg-gray-50 px-2.5 py-2 text-xs text-gray-800">
            Descripción: {documento.descripcion}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function DocumentoCardSkeleton() {
  return (
    <Card className="rounded">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56 max-w-full" />
        <Skeleton className="h-4 w-32" />
        <Separator />
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CardsGenerarContratoSkeleton({
  count = 6,
}: {
  count?: number
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full max-w-sm rounded-lg" />
        <Skeleton className="h-5 w-24 rounded" />
      </div>
      <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <DocumentoCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
