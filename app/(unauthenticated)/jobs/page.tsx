'use client';
import React, { useEffect, useState } from 'react';

import FilterJobs from '@/app/(unauthenticated)/jobs/components/FilterJobs';
import JobCard from '@/app/(unauthenticated)/jobs/components/JobCard';
import SkeletonJobCard from '@/app/(unauthenticated)/jobs/components/SkeletonJobCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the type for the job data
interface Job {
  id: string;
  firstName: string;
  lastName: string;
  district: string;
  area: string;
  age: number;
  medium: string;
  levelOfStudy: string;
  school: string | null;
  college: string | null;
  university: string | null;
  subjects: string[];
  gender: string;
  salary: number;
  numberOfDays: number;
  duration: string;
  tuitionType: string;
  class: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFilteredJobs = async (filters?: {
    district: string;
    area: string;
    levelOfStudy: string;
  }) => {
    try {
      setLoading(true);

      if (!filters) {
        // Initial load or reset - fetch all jobs
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
        return;
      }

      // Fetch filtered jobs
      const response = await fetch('/api/jobs/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filtered jobs');
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredJobs();
  }, []);

  const handleFilterChange = (filters: {
    district: string;
    area: string;
    levelOfStudy: string;
  }) => {
    fetchFilteredJobs(filters);
  };

  const handleReset = () => {
    fetchFilteredJobs();
  };

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-amber" />
            Teaching jobs
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Discover your next <span className="text-gradient">tuition job</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Browse open tutoring opportunities and filter by area, level, and subject.
          </p>
        </header>

        <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-6 lg:flex-row">
          <div className="lg:w-1/4">
            <FilterJobs onFilterChange={handleFilterChange} onReset={handleReset} />
          </div>
          <div className="flex w-full flex-col lg:w-3/4">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="text-sm font-medium text-muted-foreground">
                Showing <span className="tabular font-bold text-foreground">{jobs.length}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Sort by</span>
                <Select>
                  <SelectTrigger className="h-10 w-[160px] rounded-pill text-sm lg:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <SkeletonJobCard key={index} />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    postId={job.id}
                    title={`${job.firstName} ${job.lastName}`}
                    description={job.note}
                    medium={job.medium}
                    subjects={job.subjects}
                    tutoringDays={`${job.numberOfDays} days per week`}
                    monthlySalary={`৳${job.salary?.toLocaleString?.() ?? job.salary}`}
                    salaryValue={job.salary}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-soft-sm">
                <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary text-2xl text-primary">
                  💼
                </span>
                <h3 className="font-display text-lg font-bold">No jobs available</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting or resetting your filters to see more opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
