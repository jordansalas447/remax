
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { dni } = await request.json();

    // Validar DNI
    if (!dni || !/^\d{8}$/.test(String(dni))) {
      return NextResponse.json(
        { error: "El DNI debe contener exactamente 8 dígitos" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_DNI_API_URL;
    const apiKey = process.env.DNI_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "Configuración de API incompleta" },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ dni }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Error al consultar el DNI",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error consultando DNI:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
