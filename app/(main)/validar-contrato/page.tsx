import { getSession } from "@/lib/auth/session";
import { getAsociadoByProfileId } from "@/lib/supabase/queries/asociados";
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

  const detalle = await getContratoDetallePorCodigo(codigo);
  const session = await getSession();
  const Asociado = await getAsociadoByProfileId(session?.profile?.id || "");

    console.log(Asociado?.personas?.asociados?.[0]?.id_asociado)

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
    <main className="flex justify-center bg-gray-50">
      <div className="w-full max-w-xs bg-white border rounded p-6 flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-700 mb-1">Detalle del Contrato</h1>
          <span className="text-xs font-medium text-gray-400">
            Contrato: <span className="text-black">{detalle.numero_contrato}</span>
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-y-3 gap-x-1 text-sm">
          <dt className="font-medium text-gray-500">Cliente</dt>
          <dd className="text-gray-900">{detalle.cliente}</dd>
          <dt className="font-medium text-gray-500">Propiedad</dt>
          <dd className="text-gray-900">{detalle.propiedad}</dd>
          <dt className="font-medium text-gray-500">Estado</dt>
          <dd>
            <span className={`px-2 py-0.5 rounded text-white text-xs ${detalle.estado === "Vigente" ? "bg-green-600" : "bg-red-500"}`}>
              {detalle.estado}
            </span>
          </dd>
          <dt className="font-medium text-gray-500">Monto</dt>
          <dd className="text-gray-900">{detalle.monto}</dd>
          <dt className="font-medium text-gray-500">Inicio</dt>
          <dd className="text-gray-900">{detalle.fecha_inicio}</dd>
          <dt className="font-medium text-gray-500">Término</dt>
          <dd className="text-gray-900">{detalle.fecha_fin}</dd>
        </dl>
        <div className="mt-3">
          <span className="block text-xs text-gray-500 font-semibold">Descripción:</span>
          <p className="text-sm text-gray-700">{detalle.descripcion}</p>
        </div>
      </div>
    </main>
  );
}