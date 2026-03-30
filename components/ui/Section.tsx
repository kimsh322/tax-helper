"use client";

import type { ReactNode } from "react";

export default function Section({
  number,
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  number: string;
  title: string;
  summary?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-surface/40">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-surface/60 transition-colors"
      >
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-muted">{number}</span>
          <span className="text-sm font-bold text-ink">{title}</span>
          {!open && summary && (
            <span className="text-xs text-muted ml-2">{summary}</span>
          )}
        </div>
        <span
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  );
}
