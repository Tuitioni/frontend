import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';

import { Button } from '@/components/ui/button';

import HireModal from './HireModal';

// Define the type for the TutorCard props
interface TutorCardProps {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  medium: string;
  education: string;
  subjects: string[]; // Ensure it's always an array
  yearsOfExperience: number;
}

export default function TutorCard({
  id,
  firstName,
  lastName,
  location,
  phone,
  medium,
  education,
  subjects = [], // provide default empty array
  yearsOfExperience,
}: TutorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Ensure subjects is always an array
  const subjectList = Array.isArray(subjects) ? subjects : [];
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <>
      <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 font-display text-sm font-bold text-white">
              {initials}
            </span>
            <div className="leading-tight">
              <h3 className="font-display text-lg font-bold">
                {firstName} {lastName}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-amber/15 px-2.5 py-1 text-xs font-semibold tabular text-amber-600">
            <AiFillStar className="h-3.5 w-3.5" />
            {yearsOfExperience} yrs
          </span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{education}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {subjectList.slice(0, 3).map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-pill bg-secondary px-3 py-1 text-xs font-semibold text-primary"
            >
              {subject}
            </span>
          ))}
          {subjectList.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-muted-foreground">
              +{subjectList.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-medium text-muted-foreground">Verified tutor</span>
          <Button size="sm" className="rounded-pill" onClick={() => setIsModalOpen(true)}>
            Hire
          </Button>
        </div>
      </div>

      <HireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tutorName={`${firstName} ${lastName}`}
        tutorId={id}
      />
    </>
  );
}
