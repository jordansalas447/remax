/**
 * Servicio de lógica de negocio para el módulo de Contratos.
 *
 * CONVENCIONES:
 * - Nunca lanza excepciones: siempre retorna Result<T, BusinessError>.
 * - Recibe el cliente Supabase como parámetro (inyección de dependencia).
 * - No importa `createClient` de servidor: esa responsabilidad queda
 *   en los Server Actions que invocan estas funciones.
 *
 * EJEMPLO DE USO EN UN SERVER ACTION:
 *
 * ```ts
 * "use server";
 * import { createClient } from "@/lib/supabase/server";
 * import { cambiarEstadoContrato } from "@/lib/business/contratos/service";
 *
 * export async function accionCambiarEstado(id: number, estado: number) {
 *   const supabase = await createClient();
 *   const result = await cambiarEstadoContrato({ idContrato: id, nuevoEstado: estado }, supabase);
 *
 *   if (!result.ok) {
 *     return { success: false, error: result.error.message };
 *   }
 *
 *   revalidatePath("/contratos");
 *   return { success: true };
 * }
 * ```
 */

import { ok, fail } from "@/lib/business/result";
import type { Result } from "@/lib/business/result";
import { BusinessErrors } from "@/lib/business/types";
import type { DbClient, BusinessError } from "@/lib/business/types";

import type {
  CambiarEstadoInput,
  CerrarContratoInput,
  ContratoDetalle,
  EstadoContratoId,
} from "./types";
import { TRANSICIONES_PERMITIDAS } from "./types";

// ---------------------------------------------------------------------------
// getContratoConDetalle
// ---------------------------------------------------------------------------

/**
 * Obtiene un contrato con sus relaciones principales expandidas.
 *
 * Relaciones incluidas:
 * - `inmuebles`  (propiedad asociada al contrato)
 * - `asociados`  (agente/asociado responsable)
 */
export async function getContratoConDetalle(
  idContrato: number,
  db: DbClient,
): Promise<Result<ContratoDetalle, BusinessError>> {
  const { data, error } = await db
    .from("contratos")
    .select(
      `
      *,
      inmuebles (*),
      asociados (*)
    `,
    )
    .eq("id_contrato", idContrato)
    .is("eliminado", false)
    .single();

  if (error || !data) {
    return fail(BusinessErrors.notFound("contrato", idContrato));
  }

  const { inmuebles, asociados, ...contrato } = data as typeof data & {
    inmuebles: NonNullable<typeof data>["inmuebles"];
    asociados: NonNullable<typeof data>["asociados"];
  };

  return ok({
    contrato: contrato as ContratoDetalle["contrato"],
    propiedad: (inmuebles as ContratoDetalle["propiedad"]) ?? null,
    asociado: (asociados as ContratoDetalle["asociado"]) ?? null,
  });
}

// ---------------------------------------------------------------------------
// cambiarEstadoContrato
// ---------------------------------------------------------------------------

/**
 * Cambia el estado de un contrato validando que la transición sea permitida.
 *
 * La tabla de transiciones válidas está definida en `TRANSICIONES_PERMITIDAS`
 * (ver `./types.ts`).
 */
export async function cambiarEstadoContrato(
  input: CambiarEstadoInput,
  db: DbClient,
): Promise<Result<void, BusinessError>> {
  // 1. Obtener el estado actual del contrato
  const { data: contratoActual, error: fetchError } = await db
    .from("contratos")
    .select("id_estado")
    .eq("id_contrato", input.idContrato)
    .is("eliminado", false)
    .single();

  if (fetchError || !contratoActual) {
    return fail(BusinessErrors.notFound("contrato", input.idContrato));
  }

  const estadoActual = contratoActual.id_estado as EstadoContratoId | null;

  // 2. Verificar que la transición es válida
  if (estadoActual !== null) {
    const permitidos = TRANSICIONES_PERMITIDAS[estadoActual] ?? [];

    if (!permitidos.includes(input.nuevoEstado)) {
      return fail(
        BusinessErrors.transitionNotAllowed(
          String(estadoActual),
          String(input.nuevoEstado),
        ),
      );
    }
  }

  // 3. Actualizar
  const { error: updateError } = await db
    .from("contratos")
    .update({ id_estado: input.nuevoEstado })
    .eq("id_contrato", input.idContrato);

  if (updateError) {
    return fail(BusinessErrors.dbError(updateError.message));
  }

  return ok(undefined);
}

// ---------------------------------------------------------------------------
// cerrarContrato
// ---------------------------------------------------------------------------

/**
 * Cierra un contrato registrando el precio de venta, la comisión
 * y la fecha de entrega del contrato.
 *
 * También actualiza `estado` a CERRADO y desactiva `estado` (campo boolean).
 *
 * TODO: ajustar el id de estado CERRADO al valor real de tu tabla.
 */
export async function cerrarContrato(
  input: CerrarContratoInput,
  db: DbClient,
): Promise<Result<void, BusinessError>> {
  // 1. Validaciones de negocio
  if (input.precioVenta <= 0) {
    return fail(BusinessErrors.validation("El precio de venta debe ser mayor a 0."));
  }

  if (input.comision < 0) {
    return fail(BusinessErrors.validation("La comisión no puede ser negativa."));
  }

  // 2. Verificar que el contrato existe y no está ya cerrado
  const { data: contratoActual, error: fetchError } = await db
    .from("contratos")
    .select("id_contrato, id_estado, estado")
    .eq("id_contrato", input.idContrato)
    .is("eliminado", false)
    .single();

  if (fetchError || !contratoActual) {
    return fail(BusinessErrors.notFound("contrato", input.idContrato));
  }

  // TODO: reemplaza 3 con la constante ESTADO_CONTRATO.CERRADO real
  if (contratoActual.id_estado === 3) {
    return fail(BusinessErrors.validation("El contrato ya está cerrado."));
  }

  // 3. Actualizar todos los campos en una sola operación
  const { error: updateError } = await db
    .from("contratos")
    .update({
      precio_venta: input.precioVenta,
      comision: input.comision,
      fecha_contrato_entregado: input.fechaContratoEntregado,
      id_estado: 3, // TODO: usar ESTADO_CONTRATO.CERRADO
      estado: false,
    })
    .eq("id_contrato", input.idContrato);

  if (updateError) {
    return fail(BusinessErrors.dbError(updateError.message));
  }

  return ok(undefined);
}
