interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-full px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
}
