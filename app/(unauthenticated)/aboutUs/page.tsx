import React from 'react';

import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Tuitioni and our mission to connect students with qualified tutors in Bangladesh.',
};

const stats = [
  { value: '12,400+', label: 'Verified tutors' },
  { value: '68', label: 'Districts covered' },
  { value: '4.9★', label: 'Average rating' },
];

const values = [
  {
    title: 'Trust first',
    body: 'Every tutor is identity-verified and reviewed, so students and parents can connect with confidence.',
    variant: 'brand' as const,
    icon: '🛡️',
  },
  {
    title: 'Perfect matches',
    body: 'Our matching system weighs subject expertise, teaching style, and location for the right fit.',
    variant: 'amber' as const,
    icon: '🎯',
  },
  {
    title: 'Learning, connected',
    body: 'Home or online, from HSC to university - we bring the right people together to grow.',
    variant: 'brand' as const,
    icon: '🔗',
  },
];

export default function Page() {
  return (
    <div className="w-full">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-2 w-2 rounded-full bg-amber" />
              About Tuitioni
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Connecting students with the right tutors.
              <br />
              <span className="text-gradient">Learning, connected.</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Tuitioni is on a mission to make quality tuition accessible across Bangladesh -
              matching students with experienced, verified tutors for personalised home and online
              learning.
            </p>

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
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-amber" />
            What we stand for
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built on trust and the right match
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            We handle the hard part of finding a great tutor, so learning can start sooner.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span
                className={
                  v.variant === 'amber'
                    ? 'grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-xl text-[#3A2A05]'
                    : 'grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-xl text-white'
                }
                aria-hidden="true"
              >
                {v.icon}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <AboutUs />
      <FAQ />
    </div>
  );
}
