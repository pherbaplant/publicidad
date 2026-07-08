"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Store,
  MapPin,
  Package,
  Users,
  ClipboardCheck,
  ListChecks,
  FileDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navPrincipal = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campanas", label: "Campañas", icon: Megaphone },
  { href: "/ejecuciones", label: "Ejecución en tienda", icon: ClipboardCheck },
];

const navCatalogos = [
  { href: "/tiendas", label: "Tiendas", icon: Store },
  { href: "/ciudades", label: "Ciudades", icon: MapPin },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/responsables", label: "Responsables", icon: Users },
  { href: "/categorias-calidad", label: "Categorías de calidad", icon: ListChecks },
];

const navReportes = [{ href: "/reportes", label: "Reportes", icon: FileDown }];

function NavSection({
  items,
  pathname,
}: {
  items: typeof navPrincipal;
  pathname: string;
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              render={
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
            F
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Farmatodo</span>
            <span className="text-xs text-muted-foreground">
              Desempeño de campañas
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NavSection items={navPrincipal} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Catálogos</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavSection items={navCatalogos} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Análisis</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavSection items={navReportes} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1.5 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Equipo de mercadeo y publicidad
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
