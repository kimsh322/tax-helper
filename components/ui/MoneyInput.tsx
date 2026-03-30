"use client";

import { formatNumber, parseInputNumber } from "@/lib/format";

export default function MoneyInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink mb-1.5">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const raw = parseInputNumber(e.target.value);
          onChange(raw > 0 ? formatNumber(raw) : "");
        }}
        placeholder={placeholder ?? "0"}
        className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
