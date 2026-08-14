import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";

export default function MiniappsPage() {
  return (
<div className="relative flex-1 min-h-[calc(100vh)] bg-white dark:bg-zinc-900">
  <div className="absolute top-8 left-8 flex flex-col items-center">
    <Link
      href="/miniapps/calculadora"
      className="flex flex-col items-center group w-28"
    >
      <div className="flex items-center justify-center w-24 h-24 rounded-xl bg-blue-100 dark:bg-blue-900 shadow-lg transition hover:ring-2 hover:ring-blue-500/40">
        <FontAwesomeIcon
          icon={faCalculator}
          className="text-blue-700 dark:text-blue-300 text-4xl"
        />
      </div>
      <span className="mt-3 text-base font-medium text-blue-700 dark:text-blue-300 group-hover:underline">
        Calculadora
      </span>
    </Link>
  </div>
</div>
  );
}