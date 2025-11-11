"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onAuthFail?: () => void;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = "/login", requireAuth = true, onAuthFail } = options;
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        if (onAuthFail) {
          onAuthFail();
        }
        router.push(redirectTo);
      }
      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, onAuthFail]);

  return {
    isAuthenticated,
    isLoading: isLoading || isChecking,
    user,
  };
};
