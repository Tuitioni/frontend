import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

import { HeroIllustration } from './HeroIllustration';

const stats = [
  { value: '12,400+', label: 'Verified tutors' },
  { value: '68', label: 'Districts covered' },
  { value: '4.9★', label: 'Average rating' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10">
          {/* Content */}
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground shadow-soft-sm">
              <span className="h-2 w-2 rounded-full bg-success" />
              Trusted by thousands of students in Bangladesh
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Find your perfect tutor.
              <br />
              <span className="text-gradient">Learning, connected.</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground">
              Connect with experienced, verified tutors for personalised home and online tuition —
              compare by subject, area, and rating, then book in minutes.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/tutors">
                <Button size="lg" className="rounded-pill px-7 font-semibold shadow-glow">
                  Find a tutor
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="rounded-pill px-7 font-semibold">
                  Become a tutor
                </Button>
              </Link>
            </div>

            <dl className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="tabular font-display text-2xl font-extrabold">{s.value}</dt>
                  <dd className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-brand-50/70 to-card shadow-float dark:from-brand-500/10">
              <HeroIllustration className="h-full w-full p-2" />
            </div>

            {/* Floating live card */}
            <div className="absolute -right-2 bottom-8 flex items-center gap-2.5 rounded-xl border border-border bg-card/95 p-3 shadow-soft-lg backdrop-blur sm:-right-5">
              <span className="h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_0_4px] shadow-success/20" />
              <div className="leading-tight">
                <p className="text-[11px] font-semibold text-muted-foreground">Live now</p>
                <p className="font-display text-sm font-bold">Class starts in 5 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
