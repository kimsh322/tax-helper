interface HeaderProps {
  title: string;
  number?: string;
  description?: string;
}

export default function Header({ title, number, description }: HeaderProps) {
  return (
    <header className="border-b-4 border-ink pb-4 mb-8">
      <div className="flex items-baseline gap-3">
        {number && (
          <span className="font-mono text-sm text-muted">{number}</span>
        )}
        <h1 className="font-serif text-2xl font-bold text-ink md:text-3xl">
          {title}
        </h1>
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted">{description}</p>
      )}
    </header>
  );
}
