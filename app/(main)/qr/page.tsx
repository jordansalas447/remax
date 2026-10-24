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

// El nombre será page para capturar el parámetro de la URL tipo: /qr/[codigo]  

export default async function QrContratoPage({ searchParams }: { searchParams: Record<string, string> }) {
  // Se espera que el QR direccione a una url tipo /qr?codigo=ALGO
  const codigo = searchParams.codigo;
  const detalle = await getContratoDetallePorCodigo(codigo);

  console.log(codigo,detalle)

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
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
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