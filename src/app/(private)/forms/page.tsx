'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Settings, Eye, Trash2, Power, PowerOff, Copy, ExternalLink, Home, FileText } from 'lucide-react';
import { formTemplateService } from '@/lib/services/form.service';
import type { FormTemplate } from '@/types/form.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await formTemplateService.findAll();
      setForms(data);
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error('Error al cargar formularios', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/public/form/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado', {
      description: 'El enlace del formulario ha sido copiado al portapapeles',
    });
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('¿Estás seguro de desactivar este formulario?')) return;

    try {
      await formTemplateService.deactivate(id);
      toast.success('Formulario desactivado', {
        description: 'El formulario ha sido desactivado exitosamente',
      });
      loadForms();
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error('Error al desactivar formulario', {
        description: errorMessage,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este formulario? Esta acción no se puede deshacer.')) return;

    try {
      await formTemplateService.remove(id);
      toast.success('Formulario eliminado', {
        description: 'El formulario ha sido eliminado exitosamente',
      });
      loadForms();
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error('Error al eliminar formulario', {
        description: errorMessage,
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Formularios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#0386D9]" />
              <div>
                <h2 className="text-xl font-bold text-white">Formularios</h2>
                <p className="text-sm text-slate-400">
                  Gestiona los formularios de visitantes
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/forms/new')}
              className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Formulario
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No hay formularios</h3>
              <p className="text-slate-400 mb-6">Crea tu primer formulario para comenzar</p>
              <Button
                onClick={() => router.push('/forms/new')}
                className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Formulario
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400">Nombre</TableHead>
                  <TableHead className="text-slate-400">Slug</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Campos</TableHead>
                  <TableHead className="text-slate-400">Creado</TableHead>
                  <TableHead className="text-slate-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">
                      {form.name}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm text-[#0386D9] bg-white/5 px-2 py-1 rounded">
                        {form.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge
                          variant={form.is_active ? 'default' : 'secondary'}
                          className={
                            form.is_active
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/50'
                          }
                        >
                          {form.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        {form.is_public && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/50"
                          >
                            Público
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {form.fields?.length || 0} campos
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {formatDate(form.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                          <DropdownMenuLabel className="text-slate-400">Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => router.push(`/forms/${form.id}/edit`)}
                            className="text-white hover:bg-white/10 cursor-pointer"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`/form/${form.slug}`, '_blank')}
                            className="text-white hover:bg-white/10 cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver formulario
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyLink(form.slug)}
                            className="text-white hover:bg-white/10 cursor-pointer"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar enlace
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/submissions?formTemplateId=${form.id}`)}
                            className="text-white hover:bg-white/10 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver submissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          {form.is_active ? (
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(form.id)}
                              className="text-yellow-400 hover:bg-white/10 cursor-pointer"
                            >
                              <PowerOff className="h-4 w-4 mr-2" />
                              Desactivar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(form.id)}
                              className="text-green-400 hover:bg-white/10 cursor-pointer"
                            >
                              <Power className="h-4 w-4 mr-2" />
                              Activar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(form.id)}
                            className="text-red-400 hover:bg-white/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
