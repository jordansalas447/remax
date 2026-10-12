import { renderToBuffer } from "@react-pdf/renderer";
import {
  ContratoPDF,
  type ContratoPDFProps,
} from "@/components/generar-contrato/contratoPDF";

export const runtime = "nodejs";

function sanitizeFileName(value: string) {
  return value.replace(/[^\w.-]+/g, "_");
}

function asText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
  let body: Partial<ContratoPDFProps>;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const nroContrato = asText(body.nroContrato);
  if (!nroContrato) {
    return Response.json(
      { error: "Falta el número de contrato." },
      { status: 400 }
    );
  }

  const datos: ContratoPDFProps = {
    nroContrato,
    propietarios: Array.from({ length: 5 }, () => ({})),
    nombreAsesor: asText(body.nombreAsesor),
    inmuebleDireccion: asText(body.inmuebleDireccion),
    inmuebleDistrito: asText(body.inmuebleDistrito),
    inmueblePartida: asText(body.inmueblePartida),
    comision: asText(body.comision),
    duracionMeses: asText(body.duracionMeses),
    diaFirma: asText(body.diaFirma),
    mesFirma: asText(body.mesFirma),
    anoFirma: asText(body.anoFirma),
  };

  const pdfBuffer = await renderToBuffer(<ContratoPDF {...datos} />);
  const fileName = `contrato-${sanitizeFileName(nroContrato)}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
