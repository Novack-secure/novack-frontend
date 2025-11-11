"use client";

import { useEffect, useMemo, useState } from "react";

type Country = {
  code: string; // ISO
  dial: string; // "+34"
  label: string;
};

const COUNTRIES: Country[] = [
  { code: "ES", dial: "+34", label: "España" },
  { code: "MX", dial: "+52", label: "México" },
  { code: "AR", dial: "+54", label: "Argentina" },
  { code: "CL", dial: "+56", label: "Chile" },
  { code: "CO", dial: "+57", label: "Colombia" },
  { code: "PE", dial: "+51", label: "Perú" },
  { code: "CR", dial: "+506", label: "Costa Rica" },
  { code: "US", dial: "+1", label: "Estados Unidos" },
];

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PhoneInput({
  id,
  value,
  onChange,
  placeholder,
}: PhoneInputProps) {
  function groupForDisplay(countryCode: string, digits: string): string {
    if (countryCode === "CR") {
      // Costa Rica: 8 dígitos nacionales -> XXXX XXXX
      const a = digits.slice(0, 4);
      const b = digits.slice(4, 8);
      const rest = digits.slice(8);
      return [a, b, rest].filter(Boolean).join(" ").trim();
    }
    if (countryCode === "US") {
      // US ejemplo: XXX XXX XXXX
      const a = digits.slice(0, 3);
      const b = digits.slice(3, 6);
      const c = digits.slice(6, 10);
      const rest = digits.slice(10);
      return [a, b, c, rest].filter(Boolean).join(" ").trim();
    }
    // Por defecto: agrupar en bloques de 3
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  }
  const initial = useMemo(() => {
    const found = COUNTRIES.find((c) => value?.startsWith(c.dial));
    if (found) {
      const rest = value.replace(found.dial, "").trim();
      return { country: found.code, national: rest };
    }
    return { country: "ES", national: value || "" };
  }, [value]);

  const [country, setCountry] = useState<string>(initial.country);
  const [national, setNational] = useState<string>(initial.national);

  useEffect(() => {
    const c = COUNTRIES.find((x) => x.code === country) ?? COUNTRIES[0];
    const digits = national.replace(/[^0-9]/g, "");
    // Enviar E.164 sin espacios
    const e164 = `${c.dial}${digits}`;
    onChange(e164);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, national]);

  return (
    <div className="w-full flex gap-2 items-stretch">
      <select
        aria-label="País"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-[96px] sm:w-[110px] h-11 rounded-xl bg-white/10 border border-white/20 text-white px-3 text-sm focus:outline-none focus:ring-0 focus:border-white/40"
      >
        {COUNTRIES.map((c) => (
          <option
            key={c.code}
            value={c.code}
            className="bg-[#0A0B14] text-white"
          >
            {c.label} {c.dial}
          </option>
        ))}
      </select>

      <input
        id={id}
        inputMode="numeric"
        pattern="[0-9\s]*"
        placeholder={placeholder || "Número"}
        value={groupForDisplay(country, national.replace(/[^0-9]/g, ""))}
        onChange={(e) => setNational(e.target.value)}
        className="flex-1 h-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 px-3 focus:outline-none focus:ring-0 focus:border-white/40"
      />
    </div>
  );
}
