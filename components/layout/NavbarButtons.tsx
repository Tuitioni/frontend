'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavbarButtons() {
  const pathname = usePathname();

  const buttons = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Tutors', path: '/tutors' },
    { name: 'How we work', path: '/aboutUs' },
  ];

  return (
    <div className="hidden items-center gap-1 md:flex">
      {buttons.map((button) => {
        const active = pathname === button.path;
        return (
          <Link
            key={button.path}
            href={button.path}
            aria-current={active ? 'page' : undefined}
            className={`rounded-pill px-3.5 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {button.name}
          </Link>
        );
      })}
    </div>
  );
}
