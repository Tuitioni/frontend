'use client';
import React, { useState } from 'react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function AboutUs() {
  const [role, setRole] = useState('teacher');

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm">
        <div className="bg-mesh px-6 py-12 text-center sm:px-10">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-amber" />
            How it works
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Select your role</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
            Tell us who you are and we&apos;ll show you exactly how Tuitioni works for you.
          </p>

          <div className="mt-8 flex justify-center">
            <Select onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-56 rounded-pill border-border bg-card text-base shadow-soft-sm md:w-64">
                <SelectValue placeholder="I am a..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conditional Information Display */}
        <div className="px-6 py-10 sm:px-10">
          {role === 'teacher' && (
            <div className="mx-auto flex max-w-2xl items-start gap-4 rounded-xl border border-border bg-secondary/50 p-6">
              <span
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg text-white"
                aria-hidden="true"
              >
                👩‍🏫
              </span>
              <p className="text-base text-foreground md:text-lg">
                You choose tuition, confirm with us, and pay 30% of your first month or 15% of the
                first 3 months.
              </p>
            </div>
          )}
          {role === 'student' && (
            <div className="mx-auto flex max-w-2xl items-start gap-4 rounded-xl border border-border bg-secondary/50 p-6">
              <span
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-lg text-[#3A2A05]"
                aria-hidden="true"
              >
                🎓
              </span>
              <p className="text-base text-foreground md:text-lg">
                You find a teacher. After confirmation, you need to let us know.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
