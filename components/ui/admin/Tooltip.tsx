import { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {children}
      </div>

      {isVisible && (
        <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 transform rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-soft-lg">
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  );
}
