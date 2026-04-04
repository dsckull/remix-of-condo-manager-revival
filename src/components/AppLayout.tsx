import { ReactNode } from "react";
import { NeoSidebar } from "./NeoSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex font-sans">
      <NeoSidebar />
      <main className="flex-1 ml-20 md:ml-24 p-6 md:p-8 lg:p-12 overflow-x-hidden min-h-[100dvh]">
        {children}
      </main>
    </div>
  );
}
