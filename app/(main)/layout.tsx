import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <Sidebar />
      <main
        className="flex-1 bg-zinc-50 p-6 dark:bg-zinc-900/40 lg:p-8"
        style={{ maxWidth: "calc(100% - 252px)" }}
      >
        <div className="w-full max-w-full">{children}</div>
      </main>
 
    </div>
  );
}
