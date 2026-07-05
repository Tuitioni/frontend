interface SectionTitleProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
}

export function SectionTitle({ title, subtitle, eyebrow }: SectionTitleProps) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <span className="h-2 w-2 rounded-full bg-amber" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
}
