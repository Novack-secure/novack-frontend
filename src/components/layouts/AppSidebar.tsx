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
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  ChartArea, 
  Badge,
  BadgeDollarSign,
  Lock,
  Users,
  Monitor,
  ClipboardList,
  CreditCard,
  ChevronRight,
  Settings,
  UserCog,
  User
} from "lucide-react";

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
    title: "Configuración",
    icon: Settings,
    initiallyOpen: false,
    items: [
      {
        title: "Perfil",
        url: "/management/supplier/supplierProfile",
        icon: User,
      },
      {
        title: "Permisos",
        url: "/management/supplier/permissionAdmin",
        icon: Lock,
      }
    ]
  },
  {
    title: "Usuarios",
    icon: UserCog,
    initiallyOpen: false,
    items: [
      {
        title: "Admin Usuarios",
        url: "/management/supplier/adminUser",
        icon: Users,
      },
      {
        title: "Admin subscipciones",
        url: "/management/supplier/subscription",
        icon: Monitor,
      }
    ]
  }
];

const standaloneItems = [
  {
    title: "Formulario para padres",
    url: "/management/supplier/parentForm",
    icon: ClipboardList,
  },
  {
    title: "Administración de tarjetas",
    url: "/management/supplier/cardAdmin",
    icon: CreditCard,
  }
];

export function AppSidebar() {
  const [open, setOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState(
    collapsibleItems.reduce((acc, item) => {
      acc[item.title] = item.initiallyOpen || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  React.useEffect(() => {
    if (!open) {
      setOpenSections(prev => {
        const newState = {...prev};
        Object.keys(newState).forEach(key => {
          newState[key] = false;
        });
        return newState;
      });
    }
  }, [open]);
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar
        collapsible="icon"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="transition-all duration-300 ${open ? 'w-[250px]' : 'w-[60px]'}`"
      >

        <SidebarHeader>
          {open ? (
            <div className="flex items-center space-x-2 px-4 py-2">
              <Badge />
              <div>
                <div className="text-lg font-bold">Novack</div>
                <div className="text-sm text-gray-400">Enterprise</div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 text-lg font-semibold flex items-center justify-center">
              <div>
                <Badge />
              </div>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Seguridad
                  </motion.span>
                )}
              </AnimatePresence>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="list-none">
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <item.icon className="w-4 h-4 min-w-[1rem]" />
                        <AnimatePresence>
                          {open && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="truncate"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Administración
                  </motion.span>
                )}
              </AnimatePresence>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {collapsibleItems.map((item) => (
                  <Collapsible key={item.title} open={openSections[item.title]} onOpenChange={() => toggleSection(item.title)}>
                    <SidebarMenuItem className="list-none">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full px-4">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 min-w-[1rem]" />
                              <AnimatePresence>
                                {open && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    {item.title}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            {open && (
                              <motion.div
                                animate={{ 
                                  rotate: openSections[item.title] ? 90 : 0,
                                }}
                                transition={{ 
                                  duration: 0.2,
                                  ease: "easeInOut"
                                }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    
                    <AnimatePresence>
                      {openSections[item.title] && (
                        <motion.div
                          initial={{ 
                            height: 0,
                            opacity: 0,
                            y: -10
                          }}
                          animate={{
                            height: 'auto',
                            opacity: 1,
                            y: 0
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            y: -10
                          }}
                          transition={{ 
                            duration: 0.25,
                            ease: "easeInOut"
                          }}
                          className="overflow-hidden"
                        >
                          <SidebarMenu className="ml-4">
                            {item.items.map((subItem) => (
                              <SidebarMenuItem key={subItem.title} className="list-none">
                                <SidebarMenuButton asChild>
                                  <a href={subItem.url} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                    <subItem.icon className="w-4 h-4 min-w-[1rem]" />
                                    <AnimatePresence>
                                      {open && (
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="truncate"
                                        >
                                          {subItem.title}
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                ))}

                {standaloneItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="list-none">
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <item.icon className="w-4 h-4 min-w-[1rem]" />
                        <AnimatePresence>
                          {open && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="truncate"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          {open ? (
            <div className="flex items-center space-x-2 px-4 py-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2"/>
                <path d="M16 16.5C16 14.0147 14.2091 12 12 12C9.79086 12 8 14.0147 8 16.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="8" r="3" stroke="#9CA3AF" strokeWidth="2"/>
              </svg>
              <div>
                <div className="text-lg font-bold">Nombre de Usuario</div>
                <div className="text-sm text-gray-400">usuario@ejemplo.com</div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 text-lg font-semibold flex items-center justify-center">
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2"/>
                  <path d="M16 16.5C16 14.0147 14.2091 12 12 12C9.79086 12 8 14.0147 8 16.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="8" r="3" stroke="#9CA3AF" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          )}
        </SidebarFooter>

      </Sidebar>
    </SidebarProvider>
  );
}
