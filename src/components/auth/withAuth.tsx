"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * HOC (Higher-Order Component) para proteger rutas privadas
 * Redirige al login si el usuario no está autenticado
 *
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(MyComponent);
 * export default ProtectedPage;
 * ```
 */
export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, isLoading, router]);

    // Mostrar loading mientras se verifica autenticación
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#0386D9] border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-lg">Verificando autenticación...</p>
          </div>
        </div>
      );
    }

    // No renderizar nada si no está autenticado (se redirigirá)
    if (!isAuthenticated) {
      return null;
    }

    // Usuario autenticado, renderizar componente
    return <Component {...props} />;
  };
}





