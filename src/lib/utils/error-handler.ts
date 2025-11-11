import { AxiosError } from 'axios';
import { toast } from 'sonner';

/**
 * Interfaz para errores de API
 */
interface ApiError {
  message: string | string[];
  statusCode?: number;
  error?: string;
}

/**
 * Maneja errores de API y muestra notificaciones apropiadas
 */
export function handleApiError(error: unknown, customMessage?: string): void {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    const statusCode = error.response?.status;

    // Mensaje de error
    let errorMessage: string;

    if (apiError?.message) {
      // Si el mensaje es un array, unir los mensajes
      errorMessage = Array.isArray(apiError.message)
        ? apiError.message.join(', ')
        : apiError.message;
    } else if (customMessage) {
      errorMessage = customMessage;
    } else {
      errorMessage = getDefaultErrorMessage(statusCode);
    }

    // Mostrar toast según el tipo de error
    if (statusCode === 401) {
      toast.error('Sesión expirada', {
        description: 'Por favor, inicia sesión nuevamente',
      });
    } else if (statusCode === 403) {
      toast.error('Acceso denegado', {
        description: 'No tienes permisos para realizar esta acción',
      });
    } else if (statusCode === 404) {
      toast.error('No encontrado', {
        description: errorMessage,
      });
    } else if (statusCode === 422) {
      toast.error('Datos inválidos', {
        description: errorMessage,
      });
    } else if (statusCode && statusCode >= 500) {
      toast.error('Error del servidor', {
        description: 'Ocurrió un error en el servidor. Intenta nuevamente más tarde.',
      });
    } else {
      toast.error('Error', {
        description: errorMessage,
      });
    }
  } else if (error instanceof Error) {
    toast.error('Error', {
      description: error.message || customMessage || 'Ocurrió un error inesperado',
    });
  } else {
    toast.error('Error', {
      description: customMessage || 'Ocurrió un error inesperado',
    });
  }
}

/**
 * Obtiene un mensaje de error predeterminado según el código de estado
 */
function getDefaultErrorMessage(statusCode?: number): string {
  switch (statusCode) {
    case 400:
      return 'Los datos enviados son inválidos';
    case 401:
      return 'No estás autorizado para realizar esta acción';
    case 403:
      return 'No tienes permisos suficientes';
    case 404:
      return 'El recurso solicitado no existe';
    case 409:
      return 'Ya existe un recurso con esos datos';
    case 422:
      return 'Los datos de entrada no son válidos';
    case 500:
      return 'Error interno del servidor';
    case 503:
      return 'El servicio no está disponible temporalmente';
    default:
      return 'Ocurrió un error al procesar tu solicitud';
  }
}

/**
 * Muestra un toast de éxito
 */
export function showSuccess(message: string, description?: string): void {
  toast.success(message, { description });
}

/**
 * Muestra un toast de información
 */
export function showInfo(message: string, description?: string): void {
  toast.info(message, { description });
}

/**
 * Muestra un toast de advertencia
 */
export function showWarning(message: string, description?: string): void {
  toast.warning(message, { description });
}






