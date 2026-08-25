"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABLE_CONFIGS, TABLE_NAMES } from "@/lib/crud/config";
import "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTable, faUsersGear } from "@fortawesome/free-solid-svg-icons";
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
        <details open className="group overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <summary className="flex items-center justify-between gap-2 cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-zinc-50 dark:bg-zinc-900/60 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsersGear} className="text-red-600 dark:text-red-400" />
                Gestión
            </span>
            <FontAwesomeIcon
                icon={faChevronDown}
                className="text-zinc-400 transition-transform duration-200 group-open:rotate-180"
            />
        </summary>
    
        <ul className="flex flex-col gap-1 p-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const iconEntry = Icons?.find((icn: any) => icn.nombre === item.label);
    
                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                                isActive
                                    ? "bg-red-600 text-white font-medium shadow-sm"
                                    : "text-zinc-600 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                            }`}
                        >
                            {iconEntry && (
                                <FontAwesomeIcon
                                    icon={["fas", iconEntry.icon]}
                                    className={`w-4 ${isActive ? "text-white" : "text-zinc-400"}`}
                                />
                            )}
                            <span className="truncate">{item.label}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    </details>

    );
}