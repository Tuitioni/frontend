interface SectionTitleProps {
  title: string;
  subtitle: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </div>
  );
}
