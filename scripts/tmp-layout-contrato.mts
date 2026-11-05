import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { VentaPDF } from "../components/generar-contrato/Contratos/Venta";
import { ArrendamientoPDF } from "../components/generar-contrato/Contratos/Arrendamiento";
import { AnticrisisPDF } from "../components/generar-contrato/Contratos/Anticrisis";
import { TraspasoPDF } from "../components/generar-contrato/Contratos/Traspaso";
import { VentaPDFNoExclusiva } from "../components/generar-contrato/Contratos/Venta No Exclusiva";
import {
  analizarLayoutContrato,
  evaluarLayoutContrato,
  renderContratoOptimizado,
} from "../components/generar-contrato/Contratos/shared/optimizadorContrato";

const casos = [
  { nombre: "venta-1", Comp: VentaPDF, nro: 1 },
  { nombre: "venta-4", Comp: VentaPDF, nro: 4 },
  { nombre: "venta-8", Comp: VentaPDF, nro: 8 },
  { nombre: "arrendamiento-1", Comp: ArrendamientoPDF, nro: 1 },
  { nombre: "arrendamiento-3", Comp: ArrendamientoPDF, nro: 3 },
  { nombre: "anticrisis-1", Comp: AnticrisisPDF, nro: 1 },
  { nombre: "traspaso-1", Comp: TraspasoPDF, nro: 1 },
  { nombre: "venta-ne-1", Comp: VentaPDFNoExclusiva, nro: 1 },
  { nombre: "venta-ne-6", Comp: VentaPDFNoExclusiva, nro: 6 },
];

function resumen(paginas: ReturnType<typeof analizarLayoutContrato>) {
  return paginas.map((p) => ({
    n: p.numero,
    hueco: Math.round(p.huecoInferior),
    yFin: Math.round(p.yFinContenido),
    firmas: p.lineasFirma.map((y) => Math.round(y)),
    texto: p.textoConFirmas.replace(/\s+/g, " ").slice(0, 80),
  }));
}

for (const caso of casos) {
  const datos = {
    nroContrato: "PRUEBA-1",
    nroPropietarios: caso.nro,
    nombreAsesor: "Ana Pérez",
    inmuebleDireccion: "Calle Ejemplo 123",
    inmuebleDistrito: "Cayma",
    inmueblePartida: "12345678",
    comision: "3%",
    duracionMeses: "6",
    diaFirma: "5",
    mesFirma: "noviembre",
    anoFirma: "2026",
  };
  const crudo = Buffer.from(
    await renderToBuffer(React.createElement(caso.Comp, datos))
  );
  const layout = analizarLayoutContrato(crudo);
  const evaluacion = evaluarLayoutContrato(layout);
  const t0 = Date.now();
  const optimizado = await renderContratoOptimizado(
    (props) => React.createElement(caso.Comp, props),
    datos
  );
  const layoutOpt = analizarLayoutContrato(optimizado);
  const evaluacionOpt = evaluarLayoutContrato(layoutOpt, layout.length);
  console.log(
    JSON.stringify(
      {
        caso: caso.nombre,
        ms: Date.now() - t0,
        base: { evaluacion, paginas: resumen(layout) },
        opt: { evaluacion: evaluacionOpt, paginas: resumen(layoutOpt), bytes: optimizado.length },
      },
      null,
      2
    )
  );
}
