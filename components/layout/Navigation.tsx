"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "홈",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 10L10 3l7 7M5 8.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8.5" />
      </svg>
    ),
  },
  {
    href: "/calculator",
    label: "실수령액 계산기",
    number: "01",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="2" width="14" height="16" rx="2" />
        <path d="M6 6h8M6 10h3M6 13h3M11 10h3M11 13h3" />
      </svg>
    ),
  },
  {
    href: "/refund",
    label: "환급액 예상",
    number: "02",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <path d="M8 8.5a2 2 0 012-2h.5a1.5 1.5 0 010 3H9.5a1.5 1.5 0 000 3h.5a2 2 0 002-2M10 6v1M10 13v1" />
      </svg>
    ),
  },
  {
    href: "/tips",
    label: "절세 팁",
    number: "03",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 3a5 5 0 013 9v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2a5 5 0 013-9zM8 17h4" />
      </svg>
    ),
  },
  {
    href: "/deductions",
    label: "공제 항목",
    number: "04",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h12M4 8h12M4 12h8M4 16h6" />
        <path d="M14 12l2 2 3-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-[240px] border-r border-ink/10 bg-surface/50">
        <div className="px-6 py-8">
          <Link href="/" className="block">
            <h1 className="font-serif text-lg font-bold text-ink leading-tight">
              연말정산
              <br />
              <span className="text-seal">미리계산</span>
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-ink text-paper font-bold"
                        : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.number && (
                      <span
                        className={`font-mono text-xs ${
                          isActive ? "text-paper/50" : "text-muted"
                        }`}
                      >
                        {item.number}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-6 py-4 border-t border-ink/10">
          <p className="text-xs text-muted">2025년 귀속 연말정산</p>
        </div>
      </aside>

      {/* 모바일 하단 탭바 */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-ink/10 bg-paper/95 backdrop-blur-sm safe-bottom md:hidden">
        <ul className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] transition-colors ${
                    isActive
                      ? "text-seal font-bold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="truncate max-w-[56px]">
                    {item.href === "/" ? "홈" : item.label.split(" ")[0]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
