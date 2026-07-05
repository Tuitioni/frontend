import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AdminCard({ title, children, footer, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-soft-sm ${className}`}>
      {title && (
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-lg font-bold">{title}</h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && <div className="border-t border-border px-6 py-4">{footer}</div>}
    </div>
  );
}
