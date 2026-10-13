import { renderToBuffer } from "@react-pdf/renderer";
import {
  AnticrisisPDF,
  type ContratoPDFProps,
} from "@/components/generar-contrato/Contratos/Anticrisis";
import path from "path";
import fs from "fs";
import { AnticrisisPDFNoExclusiva } from "@/components/generar-contrato/Contratos/Anticrisis No Exclusiva";

export const runtime = "nodejs";

function sanitizeFileName(value: string) {
  return value.replace(/[^\w.-]+/g, "_");
}



// Obtiene la ruta absoluta de las imágenes y las almacena en variables tipo Buffer
const LOGO_ADELANTE_PATH =  path.resolve(process.cwd(), "public/image1.png");
const LOGO_GLOBO_PATH =  path.resolve(process.cwd(), "public/image2.png");
const LOGO_REMAX_ADELANTE_PATH =  path.resolve(process.cwd(), "public/LogoRemax.png");

const LOGO_ADELANTE = fs.readFileSync(LOGO_ADELANTE_PATH);
const LOGO_GLOBO = fs.readFileSync(LOGO_GLOBO_PATH);
const LOGO_REMAX_ADELANTE = fs.readFileSync(LOGO_REMAX_ADELANTE_PATH);

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
    nroPropietarios: body.nroPropietarios,
    logoIzquierdo: LOGO_ADELANTE,
    logoDerecho: LOGO_GLOBO,
    logoMarcadeAgua: LOGO_REMAX_ADELANTE
  };


  const tipocontrato = body.tipoContrato
  const tipoOperacion = body.tipoOperacion

  let TipoContratoLabel

  // if  (tipoOperacion === 3) {
  //   if (tipocontrato == 1) {
  //     TipoContratoLabel = <AnticrisisPDF {...datos} />;
  //   } else if (tipocontrato == 2) {
  //     // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
  //     TipoContratoLabel = <AnticrisisPDFNoExclusiva {...datos} />;
  //   } else if (tipocontrato == 3) {
  //     // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
  //     return Response.json(
  //       { error: "Tipo de contrato no soportado." },
  //       { status: 400 }
  //     );
  //   } else {
  //     return Response.json(
  //       { error: "Tipo de contrato no soportado." },
  //       { status: 400 }
  //     );
  //   }
  // }


  // Asegúrate de que TipoContratoLabel no sea undefined
  // if (!TipoContratoLabel) {
  //   return Response.json(
  //     { error: "No se pudo generar el contrato PDF." },
  //     { status: 500 }
  //   );
  // }

  const pdfBuffer = await renderToBuffer(<AnticrisisPDF {...datos} />);
  const fileName = `contrato-${sanitizeFileName(nroContrato)}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
