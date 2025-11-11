"use client";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Calendar,
  MessageCircle,
  ChartArea,
  Users,
  CreditCard,
  ChevronRight,
  Settings,
  User,
  LogOut,
  Shield,
  Building2,
  FileText,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainItems = [
  {
    title: "Panel Principal",
    url: "/home",
    icon: Home,
  },
  {
    title: "Citas",
    url: "/appointment",
    icon: Calendar,
  },
  {
    title: "Visitantes",
    url: "/visitor",
    icon: Users,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Gráficas",
    url: "/graphs",
    icon: ChartArea,
  },
];

const collapsibleItems = [
  {
    title: "Gestión",
    icon: Settings,
    initiallyOpen: false,
    items: [
      {
        title: "Empleados",
        url: "/management/employee",
        icon: Users,
      },
      {
        title: "Tarjetas",
        url: "/card",
        icon: CreditCard,
      },
      {
        title: "Permisos",
        url: "/management/supplier/permissionAdmin",
        icon: Shield,
      },
      {
        title: "Perfil Proveedor",
        url: "/management/supplier/supplierProfile",
        icon: Building2,
      },
    ],
  },
  {
    title: "Formularios",
    icon: FileText,
    initiallyOpen: false,
    items: [
      {
        title: "Mis Formularios",
        url: "/forms",
        icon: FileText,
      },
      {
        title: "Respuestas",
        url: "/submissions",
        icon: Inbox,
      },
    ],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [openSections, setOpenSections] = React.useState(
    collapsibleItems.reduce((acc, item) => {
      acc[item.title] = item.initiallyOpen || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <Sidebar className="bg-transparent border-none">
      <SidebarHeader className="bg-transparent px-3 py-2" data-sidebar="header">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg shadow-lg shrink">
            <Image
              src="/logo.svg"
              alt="Novack"
              width={40}
              height={40}
              className="size-10"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Novack</div>
            <div className="text-xs text-[#0386D9]">
              Plataforma de Seguridad
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 px-2 bg-transparent overflow-y-auto scrollbar-hide flex-1">
        <SidebarGroup>
          <SidebarGroupLabel
            className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-2 px-2"
            data-sidebar="group-label"
          >
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          active
                            ? "bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30 shadow-lg shadow-[#0386D9]/5"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon
                          className={`size-4 ${active ? "text-[#0386D9]" : ""}`}
                        />
                        <span className="truncate font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel
            className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-2 px-2"
            data-sidebar="group-label"
          >
            Administración
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {collapsibleItems.map((item) => (
                <Collapsible
                  key={item.title}
                  open={openSections[item.title]}
                  onOpenChange={() => toggleSection(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <div className="flex items-center gap-3">
                          <item.icon className="size-4 shrink" />
                          <span className="truncate font-medium">
                            {item.title}
                          </span>
                        </div>
                        <ChevronRight className="ml-auto size-4 transition-all duration-300 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenu className="mt-1 space-y-1">
                        {item.items.map((subItem) => {
                          const active = isActive(subItem.url);
                          return (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild>
                                <Link
                                  href={subItem.url}
                                  className={`flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg transition-all duration-200 ${
                                    active
                                      ? "bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30"
                                      : "text-slate-400 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  <subItem.icon
                                    className={`size-4 ${
                                      active ? "text-[#0386D9]" : ""
                                    }`}
                                  />
                                  <span className="truncate text-sm">
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-transparent px-2 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-3 h-auto hover:bg-white/5 rounded-lg"
            >
              <Avatar className="h-9 w-9 border-2 border-[#0386D9]/30 shrink">
                <AvatarImage
                  src={user?.profile_image_url || ""}
                  alt={`${user?.first_name} ${user?.last_name}`}
                />
                <AvatarFallback className="bg-[#0386D9] text-black font-bold text-sm">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1 text-left">
                <div className="text-sm font-semibold text-white truncate">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-900 border border-white/10"
          >
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer text-white hover:bg-white/10"
            >
              <User className="mr-2 h-4 w-4 text-[#0386D9]" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer text-white hover:bg-white/10"
            >
              <Settings className="mr-2 h-4 w-4 text-[#0386D9]" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
