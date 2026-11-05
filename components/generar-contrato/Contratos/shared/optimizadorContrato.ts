import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import zlib from "zlib";
import type React from "react";
import type { AjustesEstiloContrato, ContratoPDFProps } from "./types";
import { getContratoStyles } from "./styles";

const ALTO_A4 = 841.89;
const MARGEN_INFERIOR = 72;
/** Por encima de esto, el final de la hoja se considera demasiado vacío. */
const HUECO_MAXIMO = 100;
const TEXTO_MINIMO_CON_FIRMAS = 50;

type Matriz = [number, number, number, number, number, number];

type FragmentoTexto = {
  y: number;
  texto: string;
  fontSize: number;
};

export type PaginaLayout = {
  numero: number;
  yFinContenido: number;
  huecoInferior: number;
  lineasFirma: number[];
  textoConFirmas: string;
};

type EstadoGrafico = {
  ctm: Matriz;
  tm: Matriz;
  fontSize: number;
};

const IDENTIDAD: Matriz = [1, 0, 0, 1, 0, 0];

function multiplicar(m: Matriz, c: Matriz): Matriz {
  const [a, b, c0, d, e, f] = m;
  const [A, B, C, D, E, F] = c;
  return [
    a * A + c0 * B,
    b * A + d * B,
    a * C + c0 * D,
    b * C + d * D,
    a * E + c0 * F + e,
    b * E + d * F + f,
  ];
}

function transformar(ctm: Matriz, x: number, y: number) {
  const [a, b, c, d, e, f] = ctm;
  return { x: a * x + c * y + e, y: b * x + d * y + f };
}

function tokenizar(src: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\n" || c === "\r" || c === "\t" || c === "\f") {
      i++;
      continue;
    }
    if (c === "%") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "(") {
      i++;
      let depth = 1;
      while (i < src.length && depth > 0) {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "(") depth++;
        else if (src[i] === ")") depth--;
        i++;
      }
      out.push("()");
      continue;
    }
    if (c === "<") {
      if (src[i + 1] === "<") {
        out.push("<<");
        i += 2;
        continue;
      }
      const end = src.indexOf(">", i);
      if (end === -1) break;
      out.push(src.slice(i, end + 1));
      i = end + 1;
      continue;
    }
    if (c === ">") {
      if (src[i + 1] === ">") {
        out.push(">>");
        i += 2;
      } else {
        out.push(">");
        i++;
      }
      continue;
    }
    if (c === "[" || c === "]") {
      out.push(c);
      i++;
      continue;
    }
    let j = i + 1;
    while (j < src.length && !" \n\r\t\f()<>[]/%".includes(src[j])) j++;
    out.push(src.slice(i, j));
    i = j;
  }
  return out;
}

function decodificarHex(token: string): string {
  const hex = token.slice(1, -1).replace(/\s+/g, "");
  if (!hex || hex.length % 2 !== 0) return "";
  return Buffer.from(hex, "hex").toString("latin1");
}

function inflarStream(raw: Buffer): string {
  try {
    return zlib.inflateSync(raw).toString("latin1");
  } catch {
    return raw.toString("latin1");
  }
}

function yDesdeArriba(alto: number, yPdf: number) {
  return alto - yPdf;
}

function registrarLineaHorizontal(
  ctm: Matriz,
  alto: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  destino: number[]
) {
  const a = transformar(ctm, x1, y1);
  const b = transformar(ctm, x2, y2);
  const top1 = yDesdeArriba(alto, a.y);
  const top2 = yDesdeArriba(alto, b.y);
  if (Math.abs(top1 - top2) > 1.4) return;
  const largo = Math.hypot(b.x - a.x, b.y - a.y);
  // La raya de cada firma mide ~45% (o 30%) del ancho útil. El pie de página es más largo.
  if (largo < 115 || largo > 320) return;
  const top = (top1 + top2) / 2;
  if (top < 36 || top > alto - 68) return;
  destino.push(Math.round(top * 10) / 10);
}

function analizarContenido(contenido: string, alto: number): Omit<PaginaLayout, "numero" | "huecoInferior" | "textoConFirmas"> & {
  fragmentos: FragmentoTexto[];
} {
  const tokens = tokenizar(contenido);
  const pila: EstadoGrafico[] = [];
  let estado: EstadoGrafico = { ctm: IDENTIDAD, tm: IDENTIDAD, fontSize: 10 };
  const fragmentos: FragmentoTexto[] = [];
  const lineas: number[] = [];
  const nums: number[] = [];

  const tomarNumeros = (cantidad: number) => {
    if (nums.length < cantidad) return null;
    return nums.splice(nums.length - cantidad, cantidad);
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "[" || token === "]" || token === "<<" || token === ">>" || token === "()") {
      continue;
    }
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(token)) {
      nums.push(parseFloat(token));
      continue;
    }
    if (token.startsWith("<") && token.endsWith(">")) {
      nums.length = 0;
      continue;
    }
    if (token.startsWith("/")) {
      continue;
    }

    switch (token) {
      case "q":
        pila.push({ ctm: estado.ctm, tm: estado.tm, fontSize: estado.fontSize });
        nums.length = 0;
        break;
      case "Q": {
        const previo = pila.pop();
        if (previo) estado = previo;
        nums.length = 0;
        break;
      }
      case "cm": {
        const v = tomarNumeros(6);
        if (v) {
          estado = {
            ...estado,
            ctm: multiplicar(v as Matriz, estado.ctm),
          };
        }
        break;
      }
      case "Tm": {
        const v = tomarNumeros(6);
        if (v) estado = { ...estado, tm: v as Matriz };
        break;
      }
      case "Td":
      case "TD": {
        const v = tomarNumeros(2);
        if (v) {
          const [tx, ty] = v;
          const [a, b, c, d, e, f] = estado.tm;
          estado = {
            ...estado,
            tm: [a, b, c, d, e + a * tx + c * ty, f + b * tx + d * ty],
          };
        }
        break;
      }
      case "Tf": {
        const v = tomarNumeros(1);
        if (v) estado = { ...estado, fontSize: v[0] };
        break;
      }
      case "m":
      case "l":
        tomarNumeros(2);
        break;
      case "TJ":
      case "Tj": {
        const punto = transformar(estado.ctm, estado.tm[4], estado.tm[5]);
        const y = yDesdeArriba(alto, punto.y);
        const previo = tokens[i - 1];
        let texto = "";
        if (token === "Tj" && previo?.startsWith("<")) {
          texto = decodificarHex(previo);
        } else if (token === "TJ") {
          let k = i - 1;
          const partes: string[] = [];
          while (k >= 0 && tokens[k] !== "[") {
            if (tokens[k].startsWith("<")) partes.push(decodificarHex(tokens[k]));
            k--;
          }
          texto = partes.reverse().join("");
        }
        if (texto) fragmentos.push({ y, texto, fontSize: estado.fontSize });
        nums.length = 0;
        break;
      }
      default:
        nums.length = 0;
    }
  }

  // Segundo recorrido para las rayas: el primero consume los números de m/l.
  // Se hace aparte para no mezclar la pila con la lectura de texto.
  analizarTrazos(tokens, alto, lineas);

  const cuerpo = fragmentos.filter(
    (f) => f.fontSize < 18 && f.y >= 36 && f.y <= alto - 68
  );
  const yFinContenido = cuerpo.reduce((max, f) => Math.max(max, f.y), 0);

  return { yFinContenido, lineasFirma: deduplicarCercanas(lineas), fragmentos: cuerpo };
}

function analizarTrazos(tokens: string[], alto: number, lineas: number[]) {
  const pila: Matriz[] = [];
  let ctm: Matriz = IDENTIDAD;
  const nums: number[] = [];
  let pluma: { x: number; y: number } | null = null;

  const tomar = (cantidad: number) => {
    if (nums.length < cantidad) return null;
    return nums.splice(nums.length - cantidad, cantidad);
  };

  for (const token of tokens) {
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(token)) {
      nums.push(parseFloat(token));
      continue;
    }
    if (token === "q") {
      pila.push(ctm);
      nums.length = 0;
      continue;
    }
    if (token === "Q") {
      ctm = pila.pop() ?? IDENTIDAD;
      pluma = null;
      nums.length = 0;
      continue;
    }
    if (token === "cm") {
      const v = tomar(6);
      if (v) ctm = multiplicar(v as Matriz, ctm);
      continue;
    }
    if (token === "m") {
      const v = tomar(2);
      if (v) pluma = { x: v[0], y: v[1] };
      continue;
    }
    if (token === "l") {
      const v = tomar(2);
      if (v && pluma) {
        registrarLineaHorizontal(ctm, alto, pluma.x, pluma.y, v[0], v[1], lineas);
        pluma = { x: v[0], y: v[1] };
      }
      continue;
    }
    if (token === "re") {
      const v = tomar(4);
      if (v) {
        const [x, y, w, h] = v;
        registrarLineaHorizontal(ctm, alto, x, y, x + w, y, lineas);
        registrarLineaHorizontal(ctm, alto, x, y + h, x + w, y + h, lineas);
      }
      continue;
    }
    if (token === "h" || token === "S" || token === "s" || token === "n" || token === "f") {
      pluma = null;
    }
    if (!token.startsWith("<") && !token.startsWith("/")) {
      // Los operandos que no usamos no deben contaminar el siguiente operador.
      if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(token)) nums.length = 0;
    }
  }
}

function deduplicarCercanas(valores: number[]): number[] {
  const ordenados = [...valores].sort((a, b) => a - b);
  const unicos: number[] = [];
  for (const valor of ordenados) {
    if (unicos.length === 0 || Math.abs(valor - unicos[unicos.length - 1]) > 2.5) {
      unicos.push(valor);
    }
  }
  return unicos;
}

function streamsPorId(binary: string) {
  const streams = new Map<number, string>();
  const regex = /(\d+)\s+0\s+obj[\s\S]*?stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(binary)) !== null) {
    streams.set(parseInt(match[1], 10), inflarStream(Buffer.from(match[2], "binary")));
  }
  return streams;
}

function idsDeContenido(pageBody: string): number[] {
  const ids: number[] = [];
  const unico = pageBody.match(/\/Contents\s+(\d+)\s+0\s+R/);
  if (unico) return [parseInt(unico[1], 10)];
  const lista = pageBody.match(/\/Contents\s*\[([^\]]+)\]/);
  if (!lista) return ids;
  for (const ref of lista[1].matchAll(/(\d+)\s+0\s+R/g)) {
    ids.push(parseInt(ref[1], 10));
  }
  return ids;
}

/**
 * Mide, en cada hoja, dónde termina el texto y si las rayas de firma
 * comparten esa hoja con una cláusula.
 */
export function analizarLayoutContrato(pdfBuffer: Buffer): PaginaLayout[] {
  const binary = pdfBuffer.toString("binary");
  const streams = streamsPorId(binary);
  const pageRegex = /(\d+)\s+0\s+obj\s*<<[\s\S]*?\/Type\s*\/Page\b([\s\S]*?)>>\s*endobj/g;
  const paginas: PaginaLayout[] = [];
  let match: RegExpExecArray | null;

  while ((match = pageRegex.exec(binary)) !== null) {
    const cuerpo = match[2];
    const altoMatch = cuerpo.match(
      /\/MediaBox\s*\[\s*[0-9.]+\s+[0-9.]+\s+[0-9.]+\s+([0-9.]+)\s*\]/
    );
    const alto = altoMatch ? parseFloat(altoMatch[1]) : ALTO_A4;
    const contenido = idsDeContenido(cuerpo)
      .map((id) => streams.get(id) ?? "")
      .join("\n");
    const analizado = analizarContenido(contenido, alto);
    const yFirma = analizado.lineasFirma[0];
    const textoConFirmas =
      yFirma == null
        ? ""
        : analizado.fragmentos
            .filter((f) => f.y > 40 && f.y < yFirma - 6)
            .map((f) => f.texto)
            .join("");
    const limite = alto - MARGEN_INFERIOR;
    const huecoInferior = Math.max(0, limite - analizado.yFinContenido);

    paginas.push({
      numero: paginas.length + 1,
      yFinContenido: analizado.yFinContenido,
      huecoInferior,
      lineasFirma: analizado.lineasFirma,
      textoConFirmas,
    });
  }

  return paginas;
}

export type EvaluacionLayout = {
  aceptable: boolean;
  puntaje: number;
  firmasPartidas: boolean;
  firmasSolas: boolean;
  huecoMaximo: number;
};

export function evaluarLayoutContrato(
  paginas: PaginaLayout[],
  paginasBase = paginas.length
): EvaluacionLayout {
  const conFirmas = paginas.filter((p) => p.lineasFirma.length > 0);
  const firmasPartidas = conFirmas.length > 1;
  const firmasSolas =
    conFirmas.length === 0
      ? false
      : conFirmas.some(
          (p) => p.textoConFirmas.replace(/\s+/g, "").length < TEXTO_MINIMO_CON_FIRMAS
        );

  let huecoMaximo = 0;
  let puntaje = 0;

  paginas.forEach((pagina, indice) => {
    const esUltima = indice === paginas.length - 1;
    const cierraAhi = pagina.lineasFirma.length > 0 && esUltima && !firmasSolas;
    if (cierraAhi) return;
    huecoMaximo = Math.max(huecoMaximo, pagina.huecoInferior);
    const exceso = pagina.huecoInferior - HUECO_MAXIMO;
    if (exceso > 0) puntaje += exceso;
  });

  if (firmasPartidas) puntaje += 10000;
  if (firmasSolas) puntaje += 8000;
  if (conFirmas.length === 0 && paginas.length > 0) puntaje += 4000;
  if (paginas.length > paginasBase + 1) puntaje += 3000;
  puntaje += Math.max(0, paginas.length - paginasBase) * 40;

  const aceptable =
    paginas.length > 0 &&
    !firmasPartidas &&
    !firmasSolas &&
    conFirmas.length === 1 &&
    huecoMaximo <= HUECO_MAXIMO &&
    paginas.length <= paginasBase + 1;

  return { aceptable, puntaje, firmasPartidas, firmasSolas, huecoMaximo };
}

function nivelesDeAjuste(): AjustesEstiloContrato[] {
  const niveles: AjustesEstiloContrato[] = [];

  // Primero se abre un poco el texto para que una cláusula baje
  // y comparta hoja con las firmas, llenando el hueco de la hoja anterior.
  for (let paso = 1; paso <= 6; paso++) {
    niveles.push({
      fontSize: +(8.5 + paso * 0.12).toFixed(2),
      lineHeight: +(1.8 + paso * 0.04).toFixed(2),
      sectionMarginBottom: +(6 + paso * 0.55).toFixed(2),
      clauseTitleMarginTop: +(8 + paso * 0.45).toFixed(2),
      signatureMarginTop: 38,
      signatureBoxMarginBottom: 20,
      closingSectionMinPresenceAhead: 0,
    });
  }

  // Si faltaba poco para que el cierre cupiera arriba, se compacta.
  for (let paso = 1; paso <= 4; paso++) {
    niveles.push({
      fontSize: +(8.5 - paso * 0.1).toFixed(2),
      lineHeight: +(1.8 - paso * 0.045).toFixed(3),
      sectionMarginBottom: Math.max(3, +(6 - paso * 0.55).toFixed(2)),
      clauseTitleMarginTop: Math.max(4, +(8 - paso * 0.5).toFixed(2)),
      signatureMarginTop: Math.max(12, 38 - paso * 2),
      signatureBoxMarginBottom: Math.max(10, 20 - paso * 2),
      closingSectionMinPresenceAhead: 0,
    });
  }

  return niveles;
}

/**
 * Renderiza el contrato y, si las firmas quedan solas, partidas o la hoja
 * anterior termina con un blanco grande, prueba ajustes sutiles de cuerpo
 * e interlineado hasta encontrar un corte aceptable.
 */
export async function renderContratoOptimizado(
  crearElemento: (props: ContratoPDFProps) => React.ReactElement<DocumentProps>,
  datosBase: ContratoPDFProps
): Promise<Buffer> {
  const renderizar = async (ajustes?: AjustesEstiloContrato) => {
    const styles = getContratoStyles(ajustes ?? datosBase.ajustesEstilo);
    const buffer = Buffer.from(
      await renderToBuffer(
        crearElemento({
          ...datosBase,
          ajustesEstilo: ajustes ?? datosBase.ajustesEstilo,
          styles,
        })
      )
    );
    const paginas = analizarLayoutContrato(buffer);
    return { buffer, paginas };
  };

  const inicial = await renderizar();
  const paginasBase = Math.max(inicial.paginas.length, 1);
  const evaluacionInicial = evaluarLayoutContrato(inicial.paginas, paginasBase);
  if (evaluacionInicial.aceptable || inicial.paginas.length === 0) {
    return inicial.buffer;
  }

  let mejor = { ...inicial, puntaje: evaluacionInicial.puntaje };

  for (const ajuste of nivelesDeAjuste()) {
    const candidato = await renderizar(ajuste);
    const evaluacion = evaluarLayoutContrato(candidato.paginas, paginasBase);
    if (evaluacion.aceptable) return candidato.buffer;
    if (evaluacion.puntaje < mejor.puntaje) {
      mejor = { ...candidato, puntaje: evaluacion.puntaje };
    }
  }

  return mejor.buffer;
}
