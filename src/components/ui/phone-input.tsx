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
    const formatted = national.replace(/[^0-9]/g, "");
    // Formateo simple en grupos de 3-3-...
    const grouped = formatted.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    onChange(`${c.dial}${grouped ? " " + grouped : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, national]);

  return (
    <div className="flex gap-2">
      <select
        aria-label="País"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="min-w-[110px] rounded-xl bg-white/10 border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-white/40"
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
        value={national}
        onChange={(e) => setNational(e.target.value)}
        className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 px-3 py-2 focus:outline-none focus:ring-0 focus:border-white/40"
      />
    </div>
  );
}
