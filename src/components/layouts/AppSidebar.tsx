"use client";
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
  Badge as BadgeIcon,
  BadgeDollarSign,
  Lock,
  Users,
  Monitor,
  ClipboardList,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Settings,
  UserCog,
  User,
  LogOut,
  Shield,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Citas",
    url: "/appointment",
    icon: Calendar,
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
        url: "/cards",
        icon: CreditCard,
      },
      {
        title: "Proveedores",
        url: "/management/supplier",
        icon: Building2,
      },
    ],
  },
  {
    title: "Configuración",
    icon: UserCog,
    initiallyOpen: false,
    items: [
      {
        title: "Mi Perfil",
        url: "/management/supplier/supplierProfile",
        icon: User,
      },
      {
        title: "Permisos",
        url: "/management/supplier/permissionAdmin",
        icon: Shield,
      },
      {
        title: "Suscripción",
        url: "/management/supplier/subscription",
        icon: BadgeDollarSign,
      },
    ],
  },
];

const standaloneItems = [
  {
    title: "Formulario Visitantes",
    url: "/management/supplier/parentForm",
    icon: ClipboardList,
  },
];

export function AppSidebar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
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
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#07D9D9] to-[#0596A6] shadow-lg flex-shrink-0">
            <BadgeIcon className="size-5 text-[#010440]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Novack</div>
            <div className="text-xs text-[#07D9D9]">Security Platform</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 px-2 bg-transparent overflow-y-auto scrollbar-hide flex-1">
        <SidebarGroup>
          <SidebarGroupLabel
            className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-2 px-2"
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
                            ? "bg-[#07D9D9]/10 text-[#07D9D9] border border-[#07D9D9]/30 shadow-lg shadow-[#07D9D9]/5"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon
                          className={`size-4 ${active ? "text-[#07D9D9]" : ""}`}
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
            className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-2 px-2"
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
                      <SidebarMenuButton className="w-full px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <div className="flex items-center gap-3">
                          <item.icon className="size-4 flex-shrink-0" />
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
                                      ? "bg-[#07D9D9]/10 text-[#07D9D9] border border-[#07D9D9]/30"
                                      : "text-gray-400 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  <subItem.icon
                                    className={`size-4 ${
                                      active ? "text-[#07D9D9]" : ""
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

              {standaloneItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          active
                            ? "bg-[#07D9D9]/10 text-[#07D9D9] border border-[#07D9D9]/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon
                          className={`size-4 ${active ? "text-[#07D9D9]" : ""}`}
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
      </SidebarContent>

      <SidebarFooter className="bg-transparent px-2 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-3 h-auto hover:bg-white/5 rounded-lg"
            >
              <Avatar className="h-9 w-9 border-2 border-[#07D9D9]/30 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-[#07D9D9] to-[#0596A6] text-[#010440] font-bold text-sm">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1 text-left">
                <div className="text-sm font-semibold text-white truncate">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {user?.email}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#010440] border border-[#07D9D9]/20"
          >
            <DropdownMenuItem
              onClick={() =>
                router.push("/management/supplier/supplierProfile")
              }
              className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10"
            >
              <User className="mr-2 h-4 w-4 text-[#07D9D9]" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Settings className="mr-2 h-4 w-4 text-[#07D9D9]" />
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
