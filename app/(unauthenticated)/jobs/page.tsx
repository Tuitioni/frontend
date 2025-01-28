"use client";
import React, { useEffect, useState } from "react";
import JobCard from "@/ui/jobs/JobCard";
import FilterJobs from "@/ui/jobs/FilterJobs";

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
  const [jobs, setJobs] = useState<Job[]>([]); // All jobs
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]); // Filtered jobs

  // Fetch all jobs initially
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs"); // Replace with your actual API endpoint
        const data = await response.json();
        setJobs(data); // Set the fetched jobs to state
        setFilteredJobs(data); // Set the initial filtered jobs to state
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // This function is called from the FilterJobs component when filters are applied
  const handleFilter = (filteredJobs: Job[]) => {
    setFilteredJobs(filteredJobs); // Update the filtered jobs state
  };

  return (
    <div className="flex mt-4">
      {/* Pass the handleFilter function to FilterJobs */}
      <FilterJobs onFilter={handleFilter} />
      <div className="flex-1 w-3/4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
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
    </div>
  );
}
