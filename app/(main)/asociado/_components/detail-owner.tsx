// Mini-card de detalle del propietario
export function PropietarioDetalle({ data }: { data: any }) {
    // Utilidad para formatear fechas
    function formatDate(dateStr: string | null) {
        if (!dateStr) return "—";
        // Permite fechas tipo "YYYY-MM-DD" o con hora
        return new Date(dateStr).toLocaleDateString("es-PE");
    }

    if (!data) return null;

    const persona = data.personas || {};
    const nombre = data.nombre_completo || persona.nombre_completo || "Sin nombre";
    const telefono = data.contacto || persona.numero_telefono || "—";
    const documento = persona.documento_identidad || "—";
    const direccion = persona.direccion || "—";
    const fechaNacimiento = persona.fecha_nacimiento ? formatDate(persona.fecha_nacimiento) : "—";
    const fechaRegistro = persona.fecha_registro ? formatDate(persona.fecha_registro) : "—";
    const correo = persona.correo_electronico || "—";
    const apellidoPaterno = persona.apellido_paterno || "—";
    const apellidoMaterno = persona.apellido_materno || "—";
    const idPersona = persona.id || "—";
    const idPropietario = data.id_propietario || "—";

    // Url de foto de persona, si está disponible
    const urlFoto = persona.url_foto ?? null;
    // Url de documento DNI escaneado
    const urlDni = persona.id_resource?.url_resource ?? null;

    return (
        <div className="flex flex-col gap-2 text-sm w-[340px] border bg-zinc-50 p-4 dark:bg-zinc-900/50 dark:border-zinc-800 font-normal">
            <div className="flex items-start gap-3">
                {urlFoto ? (
                    <img
                        src={urlFoto}
                        alt="Foto del propietario"
                        className="size-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                ) : (
                    <div className="size-14 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <span className="text-xl">👤</span>
                    </div>
                )}
                <div>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Propietario</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">{nombre}</span>
                    <div className="text-xs text-zinc-400 mt-0.5">ID #{idPropietario} / Persona #{idPersona}</div>
                </div>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Apellido paterno:&nbsp;</span>
                <span>{apellidoPaterno}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Apellido materno:&nbsp;</span>
                <span>{apellidoMaterno}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Contacto:&nbsp;</span>
                <span>{telefono}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Documento Identidad:&nbsp;</span>
                <span>{documento}</span>
                {urlDni && (
                    <a
                        href={urlDni}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-indigo-600 underline text-xs"
                        title="Ver documento escaneado"
                    >
                        Ver escaneo
                    </a>
                )}
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Dirección:&nbsp;</span>
                <span>{direccion}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Fecha de nacimiento:&nbsp;</span>
                <span>{fechaNacimiento}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Fecha de registro:&nbsp;</span>
                <span>{fechaRegistro}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Correo electrónico:&nbsp;</span>
                <span>{correo}</span>
            </div>
        </div>
    );
}