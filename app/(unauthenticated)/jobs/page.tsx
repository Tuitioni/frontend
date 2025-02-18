"use client";
import React, { useEffect, useState } from "react";
import JobCard from "@/app/(unauthenticated)/jobs/components/JobCard";
import FilterJobs from "@/app/(unauthenticated)/jobs/components/FilterJobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonJobCard from "@/app/(unauthenticated)/jobs/components/SkeletonJobCard";
import ApplyJobModal from "@/app/(unauthenticated)/jobs/components/ApplyJobModal";

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
  const [isApplyJobModalOpen, setApplyJobModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");

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

  const openApplyJobModal = (postId: string, jobTitle: string) => {
    setSelectedPostId(postId);
    setSelectedJobTitle(jobTitle);
    setApplyJobModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-2 sm:mt-3 lg:mt-4 min-h-[calc(100vh-6rem)]">
        <div className="lg:w-1/4 p-2 sm:p-3 lg:p-4">
          <FilterJobs
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>
        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between px-2 sm:px-3 lg:px-4 mb-2 gap-2">
            <div className="text-sm sm:text-base lg:text-lg">
              Showing Results: {jobs.length}
            </div>
            <div className="flex gap-1 items-center">
              <div className="text-sm sm:text-base lg:text-lg">Sort By:</div>
              <Select>
                <SelectTrigger className="w-[140px] sm:w-[160px] lg:w-[180px] h-8 sm:h-9 lg:h-10 text-xs sm:text-sm lg:text-base">
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
            <div className="overflow-y-auto flex-1 px-2 sm:px-3 lg:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {[...Array(6)].map((_, index) => (
                  <SkeletonJobCard key={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 px-2 sm:px-3 lg:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      firstName={job.firstName}
                      lastName={job.lastName}
                      district={job.district}
                      area={job.area}
                      age={job.age}
                      medium={job.medium as Medium}
                      levelOfStudy={job.levelOfStudy}
                      school={job.school}
                      college={job.college}
                      university={job.university}
                      subjects={job.subjects}
                      gender={job.gender}
                      salary={job.salary}
                      numberOfDays={job.numberOfDays}
                      duration={job.duration}
                      tuitionType={job.tuitionType}
                      class={job.class}
                      note={job.note}
                      createdAt={job.createdAt}
                      updatedAt={job.updatedAt}
                      jobTitle={`${job.firstName} ${job.lastName}`}
                      onApply={openApplyJobModal}
                    />
                  ))
                ) : (
                  <p className="text-sm sm:text-base lg:text-lg">
                    No jobs available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ApplyJobModal
        isOpen={isApplyJobModalOpen}
        onClose={() => setApplyJobModalOpen(false)}
        jobTitle={selectedJobTitle}
        id={selectedPostId!}
      />
    </>
  );
}
