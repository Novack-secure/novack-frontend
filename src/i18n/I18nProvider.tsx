"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

type Locale = "es" | "en";

type Messages = Record<string, any>;

interface I18nContextValue {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getByPath(obj: Messages, path: string): any {
  return path
    .split(".")
    .reduce((acc: any, part: string) => (acc ? acc[part] : undefined), obj);
}

function interpolate(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text;
  return Object.keys(vars).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, "g"), String(vars[key])),
    text
  );
}

// Nota: evitamos carga dinámica en cliente para prevenir cualquier flash
// Los mensajes se hidratan desde el servidor vía initialMessages

export function I18nProvider({
  initialLocale,
  initialMessages,
  children,
}: {
  initialLocale: Locale;
  initialMessages?: Messages;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages ?? {});
  // No cargamos nada en cliente; confiamos en mensajes del servidor

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      document.cookie = `lang=${newLocale}; path=/; max-age=31536000`;
    } catch {}
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getByPath(messages, key);
      if (typeof value === "string") return interpolate(value, vars);
      return key;
    },
    [messages]
  );

  const value = useMemo(
    () => ({ locale, t, setLocale }),
    [locale, t, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
