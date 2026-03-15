"use client";

import { useEffect, useRef, useState } from "react";

interface CustomSelectOption {
  value: number;
  label: string;
}

interface CustomSelectProps {
  value: number;
  onChange: (v: number) => void;
  options: CustomSelectOption[];
}

export default function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink cursor-pointer hover:border-ink/30 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
      >
        <span>{selected?.label}</span>
        <span className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-ink/10 bg-paper shadow-lg">
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm cursor-pointer transition-colors ${
                  o.value === value
                    ? "bg-ink/5 font-bold text-ink"
                    : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
