import { cookies, headers } from "next/headers";

export type Locale = "es" | "en";

export async function getServerLocale(): Promise<Locale> {
  const c = await cookies();
  const cookieLang = c.get("lang")?.value;
  if (cookieLang === "es" || cookieLang === "en") return cookieLang;
  const h = await headers();
  const accept = h.get("accept-language") || "es";
  return accept.toLowerCase().startsWith("es") ? "es" : "en";
}

export async function getServerMessages(locale: Locale) {
  const mod = await import(`@/i18n/messages/${locale}.json`);
  return mod.default as Record<string, any>;
}

export function tServer(messages: Record<string, any>, key: string): string {
  const value = key.split(".").reduce((acc: any, part) => (acc ? acc[part] : undefined), messages);
  return typeof value === "string" ? value : key;
}


