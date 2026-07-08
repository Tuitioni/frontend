'use client';

import React, { useState } from 'react';
import { AiOutlineCalendar, AiOutlineDollar } from 'react-icons/ai';
import { HiOutlineBookOpen } from 'react-icons/hi';

import { Button } from '@/components/ui/button';

import ApplyModal from './ApplyModal';

interface JobCardProps {
  postId: string;
  title: string;
  description: string;
  medium: string; // Represents `medium` from the API response.
  subjects: string[]; // List of subjects from the API.
  tutoringDays: string; // Represents `numberOfDays` as formatted text.
  monthlySalary: string; // Represents `salary` as formatted text.
  salaryValue?: number; // Raw salary, used to prefill the application.
}

export default function JobCard({
  postId,
  title,
  description,
  medium,
  subjects,
  tutoringDays,
  monthlySalary,
  salaryValue,
}: JobCardProps) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <span className="inline-flex shrink-0 items-center rounded-pill bg-amber/15 px-2.5 py-1 text-xs font-semibold text-amber-600">
          {medium}
        </span>
      </div>

      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AiOutlineCalendar className="h-4 w-4 text-primary" />
          <span>{tutoringDays}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AiOutlineDollar className="h-4 w-4 text-primary" />
          <span className="tabular font-semibold text-foreground">{monthlySalary}</span>
          <span>/ month</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <HiOutlineBookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{subjects.length > 0 ? subjects.join(', ') : 'N/A'}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-pill bg-secondary px-3 py-1 text-xs font-semibold text-primary"
            >
              {subject}
            </span>
          ))
        ) : (
          <span className="text-xs font-medium text-muted-foreground">No subjects listed</span>
        )}
      </div>

      <Button onClick={() => setApplyOpen(true)} className="mt-4 w-full rounded-pill font-semibold">
        Apply
      </Button>

      <ApplyModal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        postId={postId}
        postTitle={title}
        defaultSalary={salaryValue}
      />
    </div>
  );
}
