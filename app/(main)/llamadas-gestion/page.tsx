import TablaLlamadasGestion from '@/components/llamadas-gestion/tabla-llamadas-gestion';
import { getEstadoLlamadas } from '@/lib/supabase/queries/estado_llamada';
import { getLlamadasPropietarios } from '@/lib/supabase/queries/llamadas';

export default async function LlamadasPage() {
  let llamadas: any[] = [];
  let estado_llamadas: any[] = [];
  let errorMsg: string | null = null;

  try {
    llamadas = await getLlamadasPropietarios();
    estado_llamadas = await getEstadoLlamadas();
  } catch (error: any) {
    errorMsg = error.message || 'Error al obtener las llamadas.';
  }

  

  return (
    <main className="p-4">
      <TablaLlamadasGestion Llamadas={llamadas} EstadoLlamadas={estado_llamadas} />
      {/* <h1 className="text-2xl font-bold mb-4">Llamadas a propietarios</h1>
      {errorMsg ? (
        <div className="bg-red-100 text-red-800 p-2 rounded">{errorMsg}</div>
      ) : llamadas.length === 0 ? (
        <div className="text-gray-600">No hay llamadas registradas.</div>
      ) : (
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr>
              {llamadas[0] &&
                Object.keys(llamadas[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 bg-gray-100 text-xs text-left">{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {llamadas.map((llamada, idx) => (
              <tr key={idx}>
                {Object.values(llamada).map((value, i) => (
                  <td key={i} className="border px-2 py-1 text-xs">{value?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
    </main>
  );
}