"use client";
import React, { useEffect, useState } from "react";
import JobCard from "@/ui/jobs/JobCard";

import FilterJobs from "@/ui/jobs/FilterJobs";

// Define the type for the job data
interface Job {
  type: string;
  postDate: string;
  title: string;
  description: string;
  medium: string;
  preferredTutor: string;
  tutoringDays: string;
  monthlySalary: string;
  subjects: string[];
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs"); // Update this path based on your API route
        const data = await response.json();
        console.log(data); // Log the API response
        setJobs(data); // Set the fetched jobs to state
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const mockJobs: Job[] = [
    {
      type: "Full-time",
      postDate: "2024-08-01",
      title: "Tutor needed for English version",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      medium: "Online",
      preferredTutor: "Native English Speaker",
      tutoringDays: "Mon, Wed, Fri",
      monthlySalary: "$3000",
      subjects: ["English", "Literature"],
    },
    {
      type: "Part-time",
      postDate: "2024-08-05",
      title: "Math Tutor for High School",
      description:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
      medium: "In-person",
      preferredTutor: "Certified Math Teacher",
      tutoringDays: "Tue, Thu",
      monthlySalary: "$1500",
      subjects: ["Mathematics", "Algebra"],
    },
  ];

  return (
    <div className="flex mt-4">
      <FilterJobs />
      <div className="flex gap-2 flex-col p-4 flex-1 w-3/4">
        {mockJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </div>
  );
}
