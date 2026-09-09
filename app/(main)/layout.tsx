import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toast";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <Toaster>
      <SidebarProvider>
        <AppSidebar />
        <main
          className="flex-1 bg-zinc-50 p-2 dark:bg-zinc-900/40 lg:p-8 w-full"
          style={{
            width: "100vw",
            maxWidth: "100vw",
            overflowX: "auto",
            boxSizing: "border-box"
          }}
        >
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </Toaster>
  );
}
