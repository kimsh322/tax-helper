export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-surface/40 p-6">
      {children}
    </div>
  );
}
