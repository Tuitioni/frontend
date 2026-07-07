'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';

import FilterTutors from '@/app/(unauthenticated)/tutors/components/tutors/FilterTutors';
import SkeletonTutorCard from '@/app/(unauthenticated)/tutors/components/tutors/SkeletonTutorCard';
import TutorCard from '@/app/(unauthenticated)/tutors/components/tutors/TutorCard'; // Adjust the import path as needed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  medium: string;
  education: string;
  subjects: string[];
  yearsOfExperience: number;
}

/** Backend teacher shape: contact fields top-level, teaching details nested under `profile`. */
interface TeacherApiResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  district?: string;
  area?: string;
  profile?: {
    district?: string;
    area?: string;
    medium?: string;
    education?: string;
    subjects?: string[];
    yearsOfExperience?: number;
  } | null;
}

function toTutor(teacher: TeacherApiResponse): Tutor {
  const area = teacher.profile?.area ?? teacher.area;
  const district = teacher.profile?.district ?? teacher.district;
  return {
    id: teacher.id,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    location: [area, district].filter(Boolean).join(', '),
    phone: teacher.phone,
    medium: teacher.profile?.medium?.replace(/_/g, ' ') ?? '',
    education: teacher.profile?.education ?? '',
    subjects: teacher.profile?.subjects ?? [],
    yearsOfExperience: teacher.profile?.yearsOfExperience ?? 0,
  };
}

function TutorsContent() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const fetchFilteredTutors = async (filters?: {
    district: string;
    area: string;
    level: string;
  }) => {
    try {
      setLoading(true);

      if (!filters) {
        // Initial load or reset - fetch all teachers
        const response = await fetch('/api/teachers');
        const data = await response.json();
        // Only show teachers who have completed a profile.
        setTutors(
          Array.isArray(data) ? data.filter((t: TeacherApiResponse) => t.profile).map(toTutor) : []
        );
        return;
      }

      // Fetch filtered teachers
      const response = await fetch('/api/teachers/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filtered teachers');
      }

      const data = await response.json();
      setTutors(Array.isArray(data) ? data.map(toTutor) : []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial filters from URL parameters
    const district = searchParams.get('district') || '';
    const area = searchParams.get('area') || '';
    const level = searchParams.get('level') || '';

    // If any filters are present in URL, apply them
    if (district || area || level) {
      fetchFilteredTutors({
        district,
        area,
        level,
      });
    } else {
      fetchFilteredTutors();
    }
  }, [searchParams]); // Add searchParams to dependency array

  const handleFilterChange = (filters: { district: string; area: string; level: string }) => {
    fetchFilteredTutors(filters);
  };

  const handleReset = () => {
    fetchFilteredTutors();
  };

  const hasTutors = Array.isArray(tutors) && tutors.length > 0;

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-amber" />
            Browse tutors
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Find your perfect <span className="text-gradient">tutor</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Compare verified tutors by subject, area, and experience, then hire in minutes.
          </p>
        </header>

        <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-6 lg:flex-row">
          <div className="lg:w-1/4">
            <FilterTutors onFilterChange={handleFilterChange} onReset={handleReset} />
          </div>
          <div className="flex w-full flex-col lg:w-3/4">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="text-sm font-medium text-muted-foreground">
                Showing{' '}
                <span className="tabular font-bold text-foreground">{tutors.length || 0}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Sort by</span>
                <Select>
                  <SelectTrigger className="h-10 w-[160px] rounded-pill text-sm lg:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <SkeletonTutorCard key={index} />
                ))}
              </div>
            ) : hasTutors ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    id={tutor.id}
                    firstName={tutor.firstName}
                    lastName={tutor.lastName}
                    location={tutor.location}
                    phone={tutor.phone}
                    medium={tutor.medium}
                    education={tutor.education}
                    subjects={tutor.subjects}
                    yearsOfExperience={tutor.yearsOfExperience}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-soft-sm">
                <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary text-2xl text-primary">
                  🔍
                </span>
                <h3 className="font-display text-lg font-bold">No tutors found</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting or resetting your filters to see more tutors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-mesh py-20 text-center text-sm text-muted-foreground">Loading...</div>
      }
    >
      <TutorsContent />
    </Suspense>
  );
}
