import { cn } from "@/lib/utils";
import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  noMargin?: boolean;
}

export function SectionWrapper({
  children,
  className,
  containerClassName,
  noMargin = false,
}: SectionWrapperProps) {
  return (
    <section className={cn("py-16", !noMargin && "mt-4", className)}>
      <div
        className={cn(
          "container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
} 