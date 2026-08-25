"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABLE_CONFIGS, TABLE_NAMES } from "@/lib/crud/config";
import "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const navItems = TABLE_NAMES.map((name) => ({
    href: `/${name}`,
    label: TABLE_CONFIGS[name].label,
}));

export function Options({ Icons }: { Icons?: any }) {
    const pathname = usePathname();

    return (
        <details open className="group overflow-hidden border-t border-zinc-300 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80">
   
            <summary className="flex items-center gap-2 cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 group-open:text-blue-600 transition bg-zinc-50 dark:bg-zinc-900">
                <FontAwesomeIcon icon={faUsersGear}  className="text-red-600 dark:text-red-400" />
                Gestión
            </summary>
            <ul className="py-2 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 shadow rounded px-3 py-2 text-base transition duration-150 ${isActive
                                    ? "bg-red-600/90 text-white shadow font-semibold"
                                    : "text-zinc-700 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-red-900/30"
                                    }`}
                            >
                                 {Icons && Array.isArray(Icons) && Icons.length > 0
                                    ? Icons.filter((icn: any) => icn.nombre === item.label)
                                        .map((icn: any, idx: number) => {
                                            try {
                                                return <FontAwesomeIcon key={idx} icon={["fas", icn.icon]} />;
                                            } catch (e) {
                                                // Si ocurre error, omite el ícono
                                                return <></>;
                                            }
                                        })
                                    : null}                                                      
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </details>

    );
}