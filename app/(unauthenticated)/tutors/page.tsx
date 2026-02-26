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
        setTutors(data);
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
      setTutors(data);
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

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-2 sm:mt-3 lg:mt-4 min-h-[calc(100vh-6rem)]">
        <div className="lg:w-1/4 p-2 sm:p-3 lg:p-4">
          <FilterTutors onFilterChange={handleFilterChange} onReset={handleReset} />
        </div>
        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between px-2 sm:px-3 lg:px-4 mb-2 gap-2">
            <div className="text-sm sm:text-base lg:text-lg">
              Showing Results: {tutors.length || 0}
            </div>
            <div className="flex gap-1 items-center">
              <div className="text-sm sm:text-base lg:text-lg">Sort By:</div>
              <Select>
                <SelectTrigger className="w-[140px] sm:w-[160px] lg:w-[180px] h-8 sm:h-9 lg:h-10 text-xs sm:text-sm lg:text-base">
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
            <div className="overflow-y-auto flex-1 px-2 sm:px-3 lg:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {[...Array(6)].map((_, index) => (
                  <SkeletonTutorCard key={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 px-2 sm:px-3 lg:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {Array.isArray(tutors)
                  ? tutors.map((tutor) => (
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
                    ))
                  : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TutorsContent />
    </Suspense>
  );
}
