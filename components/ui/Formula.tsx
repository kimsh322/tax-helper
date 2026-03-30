export default function Formula({
  label,
  formula,
}: {
  label: string;
  formula: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-ink/10 bg-paper px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono text-sm text-ink">{formula}</span>
    </div>
  );
}
