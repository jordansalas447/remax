import { renderToBuffer } from "@react-pdf/renderer";
import {
  AnticrisisPDF,
  type ContratoPDFProps,
} from "@/components/generar-contrato/Contratos/Anticrisis";
import path from "path";
import fs from "fs";
import { AnticrisisPDFNoExclusiva } from "@/components/generar-contrato/Contratos/Anticrisis No Exclusiva";
import { getTiposContrato } from "@/lib/supabase/queries/tipos_contratos";
import { getOperaciones } from "@/lib/supabase/queries/operaciones";
import QRCode from "qrcode";
import { VentaPDF } from "@/components/generar-contrato/Contratos/Venta";
import { VentaPDFNoExclusiva } from "@/components/generar-contrato/Contratos/Venta No Exclusiva";
import { ArrendamientoPDFNoExclusiva } from "@/components/generar-contrato/Contratos/Arrendamiento No Exclusiva";
import { ArrendamientoPDF } from "@/components/generar-contrato/Contratos/Arrendamiento";
import { TraspasoPDF } from "@/components/generar-contrato/Contratos/Traspaso";
import { TraspasoExlusivaPDF } from "@/components/generar-contrato/Contratos/Traspaso No Exclusiva";

export const runtime = "nodejs";

function sanitizeFileName(value: string) {
  return value.replace(/[^\w.-]+/g, "_");
}

// Obtiene la ruta absoluta de las imágenes y las almacena en variables tipo Buffer
const LOGO_ADELANTE_PATH = path.resolve(process.cwd(), "public/image1.png");
const LOGO_GLOBO_PATH = path.resolve(process.cwd(), "public/image2.png");
const LOGO_REMAX_ADELANTE_PATH = path.resolve(process.cwd(), "public/LogoRemax.png");

const LOGO_ADELANTE = fs.readFileSync(LOGO_ADELANTE_PATH);
const LOGO_GLOBO = fs.readFileSync(LOGO_GLOBO_PATH);
const LOGO_REMAX_ADELANTE = fs.readFileSync(LOGO_REMAX_ADELANTE_PATH);

function asText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

async function generarQR(url: string) {
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    errorCorrectionLevel: "H",
  });
}

export async function POST(request: Request) {
  let body: Partial<ContratoPDFProps> & { preview?: boolean };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  // Modo vista previa: no requiere nro de contrato ni genera QR,
  // y el PDF se devuelve "inline" para mostrarse dentro del modal.
  const esPreview = body.preview === true;

  const nroContrato = esPreview
    ? "VISTA PREVIA"
    : asText(body.nroContrato);
  if (!nroContrato) {
    return Response.json(
      { error: "Falta el número de contrato." },
      { status: 400 }
    );
  }

  // Generar el QR si se incluye un id_publico, si no se quiere agregar ningún qr puede ajustarse
  let qrValue: string | undefined = undefined;
  if (body.id_publico && !esPreview) {
    try {
      // Aquí asumimos que quieres que el QR apunte a una URL pública con el id
      // Modifica la URL base si es necesario
      const publicUrl = `https://remax-adelante.netlify.app/validar-contrato?codigo=${body.id_publico}`;
      qrValue = await generarQR(publicUrl);
    } catch (e) {
      // Continúa sin QR si falla
      qrValue = undefined;
    }
  }


  const datos: ContratoPDFProps = {
    nroContrato,
    nroPropietarios: body.nroPropietarios,
    logoIzquierdo: LOGO_ADELANTE,
    logoDerecho: LOGO_GLOBO,
    logoMarcadeAgua: LOGO_REMAX_ADELANTE,
    fecha_generacion:body.fecha_generacion,
    id_publico: body.id_publico,
    qr: qrValue
  };

  const tipocontrato = body.tipoContrato;
  const tipoOperacion = body.tipoOperacion;

 // console.log(tipocontrato,tipoOperacion)

  let TipoContratoLabel;

  

  if  (tipoOperacion == 3) {
    if (tipocontrato == 1) {
      TipoContratoLabel = <AnticrisisPDF {...datos} />;
    } else if (tipocontrato == 2) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      TipoContratoLabel = <AnticrisisPDFNoExclusiva {...datos} />;
    } else if (tipocontrato == 3) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    } else {
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    }
  } else if(tipoOperacion == 1) {
    if (tipocontrato == 1) {
      TipoContratoLabel = <VentaPDF {...datos} />;
    } else if (tipocontrato == 2) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      TipoContratoLabel = <VentaPDFNoExclusiva {...datos} />;
    } else if (tipocontrato == 3) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    } else {
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    }
  } else if(tipoOperacion == 2) {
    if (tipocontrato == 1) {
      TipoContratoLabel = <ArrendamientoPDF {...datos} />;
    } else if (tipocontrato == 2) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      TipoContratoLabel = <ArrendamientoPDFNoExclusiva {...datos} />;
    } else if (tipocontrato == 3) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    } else {
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    }
  } else if(tipoOperacion == 4) {
    if (tipocontrato == 1) {
      TipoContratoLabel = <TraspasoPDF {...datos} />;
    } else if (tipocontrato == 2) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      TipoContratoLabel = <TraspasoExlusivaPDF {...datos} />;
    } else if (tipocontrato == 3) {
      // Asegúrate de importar el componente correspondiente y ajustar props si es necesario
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    } else {
      return Response.json(
        { error: "Tipo de contrato no soportado." },
        { status: 400 }
      );
    }
  }

  // Asegúrate de que TipoContratoLabel no sea undefined
  if (!TipoContratoLabel) {
    return Response.json(
      { error: "No se pudo generar el contrato PDF." },
      { status: 500 }
    );
  }

  const pdfBuffer = await renderToBuffer(TipoContratoLabel);
  const fileName = `contrato-${sanitizeFileName(nroContrato)}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": esPreview
        ? `inline; filename="vista-previa.pdf"`
        : `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
