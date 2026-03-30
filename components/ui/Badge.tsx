export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-seal/30 bg-seal/5 px-2.5 py-0.5 text-xs font-bold text-seal">
      {children}
    </span>
  );
}
