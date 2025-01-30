"use client";
import React, { useEffect, useState } from "react";
import JobCard from "@/app/(unauthenticated)/jobs/components/jobs/JobCard";
import FilterJobs from "@/app/(unauthenticated)/jobs/components/jobs/FilterJobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        const response = await fetch("/api/jobs");
        const data = await response.json();
        setJobs(data);
        return;
      }

      // Fetch filtered jobs
      const response = await fetch("/api/jobs/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch filtered jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
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
    <>
      <div className="flex flex-col lg:flex-row mt-4 min-h-[calc(100vh-6rem)]">
        <div className="w-full lg:w-1/4 p-4">
          <FilterJobs
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>
        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between px-4 mb-2 gap-2">
            <div>Showing Results: {jobs.length}</div>
            <div className="flex gap-1 items-center">
              <div>Sort By:</div>
              <Select>
                <SelectTrigger className="w-[180px]">
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
            <div className="text-center">Loading...</div>
          ) : (
            <div className="overflow-y-auto flex-1 px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      title={`${job.firstName} ${job.lastName}`}
                      description={job.note}
                      medium={job.medium}
                      subjects={job.subjects}
                      tutoringDays={`${job.numberOfDays} days per week`}
                      monthlySalary={`$${job.salary}`}
                    />
                  ))
                ) : (
                  <p>No jobs available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
