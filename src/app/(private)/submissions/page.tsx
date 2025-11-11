'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Calendar, CheckCircle, XCircle, Clock, Filter, Home, FileCheck } from 'lucide-react';
import { formSubmissionService, formTemplateService } from '@/lib/services/form.service';
import { SubmissionStatus } from '@/types/form.types';
import type { FormSubmission, FormTemplate, SubmissionFilters } from '@/types/form.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const statusConfig = {
  [SubmissionStatus.PENDING]: {
    label: 'Pendiente',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    icon: Clock,
  },
  [SubmissionStatus.APPROVED]: {
    label: 'Aprobado',
    color: 'bg-green-500/20 text-green-400 border-green-500/50',
    icon: CheckCircle,
  },
  [SubmissionStatus.REJECTED]: {
    label: 'Rechazado',
    color: 'bg-red-500/20 text-red-400 border-red-500/50',
    icon: XCircle,
  },
  [SubmissionStatus.COMPLETED]: {
    label: 'Completado',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    icon: CheckCircle,
  },
  [SubmissionStatus.CANCELLED]: {
    label: 'Cancelado',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    icon: XCircle,
  },
};

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    scheduled_time: '',
    title: '',
    description: '',
    location: '',
  });

  const [filters, setFilters] = useState<SubmissionFilters>({
    status: (searchParams.get('status') as SubmissionStatus) || undefined,
    formTemplateId: searchParams.get('formTemplateId') || undefined,
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [submissionsData, formsData] = await Promise.all([
        formSubmissionService.findAll(filters),
        formTemplateService.findAll(),
      ]);
      setSubmissions(submissionsData);
      setForms(formsData);
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error('Error al cargar submissions', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDetailOpen(true);
  };

  const handleUpdateStatus = async (status: SubmissionStatus, notes?: string) => {
    if (!selectedSubmission) return;

    try {
      setActionLoading(true);
      await formSubmissionService.updateStatus(selectedSubmission.id, {
        status,
        admin_notes: notes,
      });

      toast.success('Estado actualizado', {
        description: 'El estado de la submission ha sido actualizado',
      });

      setDetailOpen(false);
      loadData();
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error('Error al actualizar estado', {
        description: errorMessage,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenAppointmentModal = (submission: FormSubmission) => {
    // Pre-llenar datos del formulario con información del submission
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    setAppointmentData({
      scheduled_time: tomorrow.toISOString().slice(0, 16), // formato: YYYY-MM-DDTHH:mm
      title: `Cita con ${submission.visitor_name}`,
      description: `Cita programada desde formulario: ${submission.form_template?.name || 'N/A'}`,
      location: '',
    });
    setAppointmentModalOpen(true);
  };

  const handleCreateAppointment = async () => {
    if (!selectedSubmission) return;

    // Validar que se haya seleccionado una fecha
    if (!appointmentData.scheduled_time) {
      toast.error('Fecha requerida', {
        description: 'Por favor selecciona una fecha y hora para la cita',
      });
      return;
    }

    try {
      setActionLoading(true);

      // Convertir a ISO 8601 completo
      const scheduledDate = new Date(appointmentData.scheduled_time);

      // Crear la cita desde el submission
      await formSubmissionService.createAppointment(selectedSubmission.id, {
        scheduled_time: scheduledDate.toISOString(),
        title: appointmentData.title || `Cita con ${selectedSubmission.visitor_name}`,
        description: appointmentData.description,
        location: appointmentData.location,
      });

      toast.success('Cita creada exitosamente', {
        description: 'La cita ha sido creada y programada',
      });

      setAppointmentModalOpen(false);
      setDetailOpen(false);
      loadData();

      // Redirigir a la página de citas
      setTimeout(() => {
        router.push('/appointment');
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error('Error al crear cita', {
        description: errorMessage,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
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
              <BreadcrumbPage>Submissions</BreadcrumbPage>
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
          <div className="flex items-center gap-3">
            <FileCheck className="h-6 w-6 text-[#0386D9]" />
            <div>
              <h2 className="text-xl font-bold text-white">Submissions</h2>
              <p className="text-sm text-slate-400">
                Gestiona las solicitudes recibidas de los formularios
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {/* Filters */}
            <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white mb-2">Estado</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value === 'all' ? undefined : (value as SubmissionStatus) })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value={SubmissionStatus.PENDING} className="text-white">Pendiente</SelectItem>
                  <SelectItem value={SubmissionStatus.APPROVED} className="text-white">Aprobado</SelectItem>
                  <SelectItem value={SubmissionStatus.REJECTED} className="text-white">Rechazado</SelectItem>
                  <SelectItem value={SubmissionStatus.COMPLETED} className="text-white">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2">Formulario</Label>
              <Select
                value={filters.formTemplateId || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, formTemplateId: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Todos los formularios" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  {forms.map((form) => (
                    <SelectItem key={form.id} value={form.id} className="text-white">
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="w-full border-white/10 text-white hover:bg-white/10"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Solicitudes Recibidas</CardTitle>
          <CardDescription className="text-slate-400">
            {submissions.length} solicitude{submissions.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No hay submissions</h3>
              <p className="text-slate-400">No hay solicitudes con los filtros seleccionados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400">Visitante</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Formulario</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Fecha</TableHead>
                  <TableHead className="text-slate-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">
                      {submission.visitor_name}
                      {submission.visitor_company && (
                        <span className="text-slate-400 text-sm block">
                          {submission.visitor_company}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {submission.visitor_email}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm text-[#0386D9] bg-white/5 px-2 py-1 rounded">
                        {submission.form_template?.name || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={submission.status} />
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {formatDate(submission.submitted_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(submission)}
                        className="text-[#0386D9] hover:text-[#0270BE] hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
          </div>
        </div>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalles de Submission</DialogTitle>
            <DialogDescription className="text-slate-400">
              Información completa de la solicitud
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">Estado actual</p>
                  <StatusBadge status={selectedSubmission.status} />
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Enviado</p>
                  <p className="text-white">{formatDate(selectedSubmission.submitted_at)}</p>
                </div>
              </div>

              {/* Visitor Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información del Visitante</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Nombre</Label>
                    <p className="text-white">{selectedSubmission.visitor_name}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Email</Label>
                    <p className="text-white">{selectedSubmission.visitor_email}</p>
                  </div>
                  {selectedSubmission.visitor_phone && (
                    <div>
                      <Label className="text-slate-400">Teléfono</Label>
                      <p className="text-white">{selectedSubmission.visitor_phone}</p>
                    </div>
                  )}
                  {selectedSubmission.visitor_company && (
                    <div>
                      <Label className="text-slate-400">Empresa</Label>
                      <p className="text-white">{selectedSubmission.visitor_company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Answers */}
              {selectedSubmission.answers && selectedSubmission.answers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Respuestas del Formulario</h3>
                  <div className="space-y-3">
                    {selectedSubmission.answers.map((answer) => (
                      <div key={answer.id} className="p-3 bg-white/5 rounded-lg">
                        <Label className="text-slate-400">{answer.form_field?.label}</Label>
                        <p className="text-white mt-1">
                          {answer.value || JSON.stringify(answer.value_json)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedSubmission.admin_notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notas del Administrador</h3>
                  <p className="text-slate-300 p-3 bg-white/5 rounded-lg">
                    {selectedSubmission.admin_notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedSubmission.status === SubmissionStatus.PENDING && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleUpdateStatus(SubmissionStatus.APPROVED)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(SubmissionStatus.REJECTED)}
                    disabled={actionLoading}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              )}

              {selectedSubmission.status === SubmissionStatus.APPROVED && !selectedSubmission.appointment && (
                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleOpenAppointmentModal(selectedSubmission)}
                    className="w-full bg-[#0386D9] hover:bg-[#0270BE] text-black"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Crear Cita
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Appointment Modal */}
      <Dialog open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Crear Cita desde Submission</DialogTitle>
            <DialogDescription className="text-slate-400">
              Programa una cita con {selectedSubmission?.visitor_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Scheduled Time */}
            <div>
              <Label htmlFor="scheduled_time" className="text-white">
                Fecha y Hora <span className="text-red-400">*</span>
              </Label>
              <Input
                id="scheduled_time"
                type="datetime-local"
                value={appointmentData.scheduled_time}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, scheduled_time: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white mt-2"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-slate-400 mt-1">
                Selecciona la fecha y hora para la cita
              </p>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-white">
                Título
              </Label>
              <Input
                id="title"
                type="text"
                value={appointmentData.title}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, title: e.target.value })
                }
                placeholder="Ej: Reunión de presentación"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-white">
                Ubicación
              </Label>
              <Input
                id="location"
                type="text"
                value={appointmentData.location}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, location: e.target.value })
                }
                placeholder="Ej: Oficina principal, Sala de juntas"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-white">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={appointmentData.description}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, description: e.target.value })
                }
                placeholder="Detalles adicionales sobre la cita..."
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 mt-2 min-h-[100px]"
              />
            </div>

            {/* Visitor Info Summary */}
            {selectedSubmission && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-2">Información del Visitante</h4>
                <div className="text-sm text-slate-400 space-y-1">
                  <p><strong className="text-white">Nombre:</strong> {selectedSubmission.visitor_name}</p>
                  <p><strong className="text-white">Email:</strong> {selectedSubmission.visitor_email}</p>
                  {selectedSubmission.visitor_phone && (
                    <p><strong className="text-white">Teléfono:</strong> {selectedSubmission.visitor_phone}</p>
                  )}
                  {selectedSubmission.visitor_company && (
                    <p><strong className="text-white">Empresa:</strong> {selectedSubmission.visitor_company}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAppointmentModalOpen(false)}
              disabled={actionLoading}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreateAppointment}
              disabled={actionLoading || !appointmentData.scheduled_time}
              className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
            >
              {actionLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Crear Cita
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
