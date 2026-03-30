export default function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-muted">{number}</span>
        <h2 className="font-serif text-lg font-bold text-ink">{title}</h2>
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
