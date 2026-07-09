import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desempeño de Campañas — Farmatodo",
  description:
    "Evaluación ejecutiva del desempeño de campañas publicitarias en tienda.",
};

// Todas las páginas leen directamente de SQLite en cada request (vía Server
// Components). Sin esto, `next build` intentaría prerenderizar los catálogos
// como HTML estático usando la base de datos disponible en build time —lo
// cual falla si el disco persistente/DATABASE_URL de producción todavía no
// existe en ese momento— y luego serviría esa foto congelada hasta la
// siguiente revalidación.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Sistema de Evaluación de Desempeño de Campañas Publicitarias
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
