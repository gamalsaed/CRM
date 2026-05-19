import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "./_components/header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <SidebarProvider>
        <TooltipProvider>
          <AppSidebar />
          <main className="w-full">
            <Header />
            <div className="p-4">{children}</div>
          </main>
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
}
