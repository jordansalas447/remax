import { getSession } from "@/lib/auth/session";
import { getAsociadoByProfileId } from "@/lib/supabase/queries/asociados";
import { getDocumentosxCodigo } from "@/lib/supabase/queries/documentos";
import { notFound } from "next/navigation";

// Simula una llamada a un endpoint para obtener detalles del contrato
async function getContratoDetallePorCodigo(codigo: string) {
  // Aquí normalmente harías una llamada a una API o base de datos usando el código del contrato.
  // Esto es un ejemplo simulado:
  if (!codigo || codigo === "no-existe") return null;
  return {
    numero_contrato: `C-${codigo.toUpperCase()}`,
    cliente: "Juan Pérez",
    fecha_inicio: "2024-03-10",
    fecha_fin: "2025-03-09",
    propiedad: "Av. Principal 123, Oficina 501",
    estado: "Vigente",
    monto: "S/ 2,500.00",
    descripcion: "Contrato de alquiler anual para oficina administrativa.",
  };
}

// Esta página espera recibir el parámetro en la query como ?codigo=X o ?id_publico=X o ?contrato=X según lo enviado por el QR/generador.
// Acepta varios posibles nombres para máxima compatibilidad.
export default async function ValidarContratoPage(props: { searchParams: Promise<Record<string, string>> }) {
  // Desempaqueta correctamente searchParams si es un Promise (Next.js App Router)
  const searchParams = await props.searchParams;
  // Buscar código en diferentes variantes posibles de query
  const codigo = searchParams?.codigo;

  const detalle = await getDocumentosxCodigo(codigo);
  const session = await getSession();
  const Asociado = await getAsociadoByProfileId(session?.profile?.id || "");

  // Revisar si el usuario está autorizado (pertenece a id_asociado 13 o 15 o undefined)
  if ([13, 15, undefined].includes(Asociado?.personas?.asociados?.[0]?.id_asociado)) {
    // No autorizado
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-xs">
          <h2 className="text-xl font-semibold text-red-600 mb-2">No autorizado</h2>
          <p className="text-gray-500">No tienes permiso para validar contratos.</p>
        </div>
      </main>
    );
  }

  if (!codigo || !detalle) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-xs">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Contrato no encontrado</h2>
          <p className="text-gray-500">El código escaneado no es válido o el contrato no existe.</p>
        </div>
      </main>
    );
  }

  return (

    <main className="flex justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6">
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-2xl font-bold text-blue-700">
            Detalle del Contrato
          </h1>

          <span className="text-xs font-medium text-9xl text-gray-500">
            Contrato:{" "}
            <span className="font-semibold text-black">
              {detalle.nro_contrato ?? "Sin asignar"}
            </span>
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
          <dt className="font-medium text-gray-500">Fecha de Emisión</dt>
          <dd className="text-gray-900">
            {detalle.fecha_generacion
              ? new Date(detalle.fecha_generacion).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "America/Lima",
              })
              : "No generada"}
          </dd>

          <dt className="font-medium text-gray-500">Asociado Asignado</dt>
          <dd className="text-gray-900">{detalle.asociados?.nombre_completo ?? "—"}</dd>

          <dt className="font-medium text-gray-500">Tipo de contrato</dt>
          <dd className="text-gray-900">{detalle.tipo_contrato?.tipo_contrato ?? "—"}</dd>

          <dt className="font-medium text-gray-500">Operación</dt>
          <dd className="text-gray-900">{detalle.operacion?.operacion ?? "—"}</dd>

          <dt className="font-medium text-gray-500">Estado</dt>
          <dd>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${detalle.id_estado === 3
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              {detalle.id_estado === 3
                ? "Vigente"
                : `Estado ${detalle.id_estado ?? "sin asignar"}`}
            </span>
          </dd>

          <dt className="font-medium text-gray-500">Plazo</dt>
          <dd className="text-gray-900">{detalle.plazo} Días</dd>

          <dt className="font-medium text-gray-500">N.º propietarios</dt>
          <dd className="text-gray-900">{detalle.nro_propietarios ?? 0}</dd>

          <dt className="font-medium text-gray-500">Empresa</dt>
          <dd className="text-gray-900">
            {detalle.empresa ? "Sí" : "No"}
          </dd>

          <dt className="font-medium text-gray-500">Apoderado</dt>
          <dd className="text-gray-900">
            {detalle.apoderado ? "Sí" : "No"}
          </dd>

          {/* <dt className="font-medium text-gray-500">Fecha de asignación</dt>
          <dd className="text-gray-900">
            {detalle.fecha_asignacion
              ? new Date(detalle.fecha_asignacion).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "America/Lima",
              })
              : "Sin asignar"}
          </dd> */}

          <dt className="font-medium text-gray-500">Fecha de uso</dt>
          <dd className="text-gray-900">
            {detalle.fecha_uso
              ? new Date(detalle.fecha_uso).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "America/Lima",
              })
              : "Sin usar"}
          </dd>

          {/* <dt className="font-medium text-gray-500">Fecha de cierre</dt>
          <dd className="text-gray-900">
            {detalle.fecha_cierre
              ? new Date(detalle.fecha_cierre).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "America/Lima",
              })
              : "Sin cerrar"}
          </dd> */}

          {/* <dt className="font-medium text-gray-500">Eliminado</dt>
          <dd className="text-gray-900">
            {detalle.eliminado ? "Sí" : "No"}
          </dd> */}

          <dt className="font-medium text-gray-500">ID</dt>
          <dd className="break-all text-xs text-gray-700">
            {detalle.id_publico ? (
              <>
                {detalle.id_publico.slice(0, -5)}
                <span className="font-bold text-black">
                  {detalle.id_publico.slice(-5)}
                </span>
              </>
            ) : (
              "—"
            )}
          </dd>
        </dl>

        <div className="mt-4 border-t pt-3">
          <span className="mb-1 block text-xs font-semibold text-gray-500">
            Motivo de anulación
          </span>
          <p className="break-words text-sm text-gray-700">
            {detalle.motivo_anulacion || "Sin motivo de anulación"}
          </p>
        </div>

        <p className="mt-3 text-right text-xs text-gray-400">
          Creado:{" "}
          {detalle.created_at
            ? new Date(detalle.created_at).toLocaleString("es-PE", {
              dateStyle: "short",
              timeStyle: "short",
              timeZone: "America/Lima",
            })
            : "—"}
        </p>
      </div>
    </main>
  );
}