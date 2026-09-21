"use client";

import { useEffect, useState } from "react";

const anuncios = [
  {
    id: 1,
    src: "/comunicado_1.png",
    alt: "Anuncio 1",
  },
  {
    id: 2,
    src: "/comunicado_2.png",
    alt: "Anuncio 2",
  }
];

export default function AnunciosGallery() {
  const [imagenSeleccionada, setImagenSeleccionada] = useState<number | null>(
    null
  );

  const cerrarModal = () => {
    setImagenSeleccionada(null);
  };

  const imagenAnterior = () => {
    if (imagenSeleccionada === null) return;

    setImagenSeleccionada(
      imagenSeleccionada === 0
        ? anuncios.length - 1
        : imagenSeleccionada - 1
    );
  };

  const imagenSiguiente = () => {
    if (imagenSeleccionada === null) return;

    setImagenSeleccionada(
      imagenSeleccionada === anuncios.length - 1
        ? 0
        : imagenSeleccionada + 1
    );
  };

  // Teclado
  useEffect(() => {
    const manejarTeclado = (event: KeyboardEvent) => {
      if (imagenSeleccionada === null) return;

      if (event.key === "Escape") {
        cerrarModal();
      }

      if (event.key === "ArrowLeft") {
        imagenAnterior();
      }

      if (event.key === "ArrowRight") {
        imagenSiguiente();
      }
    };

    window.addEventListener("keydown", manejarTeclado);

    return () => {
      window.removeEventListener("keydown", manejarTeclado);
    };
  }, [imagenSeleccionada]);

  return (
    <>
      {/* Horizontal Gallery */}
      <div
        className="
          w-full
          flex
          flex-row
          gap-6
          overflow-x-auto
          py-2
        "
      >
        {anuncios.map((anuncio, index) => (
          <button
            key={anuncio.id}
            type="button"
            onClick={() => setImagenSeleccionada(index)}
            className="
              min-w-[280px]
              max-w-xs
              w-full
              text-left
              dark:bg-zinc-950             
              overflow-hidden            
              cursor-zoom-in
              transition
              hover:shadow-xl
              hover:scale-[1.01]
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              flex-shrink-0
            "
            style={{ marginBottom: 0 }}
          >
            <img
              src={anuncio.src}
              alt={anuncio.alt}
              className="w-full h-auto block"
            />
          </button>
        ))}
      </div>

      {/* Modal */}
      {imagenSeleccionada !== null && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            backdrop-blur-sm
            p-4
          "
          onClick={cerrarModal}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={cerrarModal}
            className="
              absolute
              top-4
              right-4
              z-50
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-black/60
              text-2xl
              text-white
              transition
              hover:bg-black/80
            "
            aria-label="Cerrar imagen"
          >
            ×
          </button>

          {/* Imagen */}
          <div
            className="
              relative
              flex
              max-h-[95vh]
              max-w-[95vw]
              items-center
              justify-center
            "
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={anuncios[imagenSeleccionada].src}
              alt={anuncios[imagenSeleccionada].alt}
              className="
                max-h-[90vh]
                max-w-[90vw]
                object-contain
                rounded-lg
                shadow-2xl
              "
            />
          </div>

          {/* Imagen anterior */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              imagenAnterior();
            }}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-black/60
              text-3xl
              text-white
              transition
              hover:bg-black/80
            "
            aria-label="Imagen anterior"
          >
            ‹
          </button>

          {/* Imagen siguiente */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              imagenSiguiente();
            }}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-black/60
              text-3xl
              text-white
              transition
              hover:bg-black/80
            "
            aria-label="Imagen siguiente"
          >
            ›
          </button>

          {/* Contador */}
          <div
            className="
              absolute
              bottom-4
              left-1/2
              -translate-x-1/2
              rounded-full
              bg-black/60
              px-4
              py-2
              text-sm
              text-white
            "
          >
            {imagenSeleccionada + 1} / {anuncios.length}
          </div>
        </div>
      )}
    </>
  );
}
