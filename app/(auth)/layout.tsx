import Link from "next/link";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Panel de marca */}
      <aside className="relative hidden overflow-hidden bg-[#0a1f4d] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-linear-to-br from-[#003DA5] via-[#0a1f4d] to-[#060f26]" />
        <div className="absolute -left-32 -top-32 size-112 rounded-full bg-[#DC1C2E]/30 blur-3xl animate-pulse [animation-duration:6s]" />
        <div className="absolute -bottom-40 -right-20 size-128 rounded-full bg-[#1a56c4]/40 blur-3xl animate-pulse [animation-duration:8s]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Link href="/" className="relative z-10 w-fit">
          <img src="/LogoRemax2.png" alt="RE/MAX Adelante" className="h-12 w-auto object-contain brightness-0 invert" />
        </Link>

        <div className="relative z-10 max-w-md space-y-8">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Gestiona tus captaciones con{" "}
            <span className="bg-linear-to-r from-white to-[#ff8a95] bg-clip-text text-transparent">
              claridad y control
            </span>
          </h2>
          <ul className="space-y-4">
            {[
              { icon: Building2, text: "Propiedades, propietarios y contratos en un solo lugar" },
              { icon: TrendingUp, text: "Reportes y revisiones en tiempo real" },
              { icon: ShieldCheck, text: "Acceso seguro para todo tu equipo" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/80">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <Icon className="size-4 text-white" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-white/50">
          &copy; {new Date().getFullYear()} RE/MAX Adelante
        </p>
      </aside>

      {/* Formulario */}
      <main className="relative flex items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#003DA5] via-[#DC1C2E] to-[#003DA5] lg:hidden" />
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/LogoRemax.png" alt="RE/MAX Adelante" className="h-12 w-auto object-contain" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
