"use client";
import React, { useEffect } from "react";
import TutorCard from "@/ui/tutors/TutorCard"; // Adjust the import path as needed
import FilterTutors from "@/ui/tutors/FilterTutors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the type for a tutor
interface Tutor {
  id: string;
  university: string;
  subject: string;
}

export default function Page() {
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/tutors"); // Update this path based on your API route
        const data = await response.json();
        console.log(data); // Log the API response
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const mockTutors: Tutor[] = [
    { id: "T001", university: "Harvard", subject: "Mathematics" },
    { id: "T002", university: "Stanford", subject: "Physics" },
    { id: "T003", university: "MIT", subject: "Computer Science" },
    { id: "T004", university: "Oxford", subject: "Literature" },
    { id: "T005", university: "Cambridge", subject: "History" },
    { id: "T006", university: "Yale", subject: "Biology" },
  ];

  return (
    <>
      <div className="flex mt-4 ">
        <FilterTutors />
        <div className="w-3/4">
          <div className="flex justify-between px-4 mb-2">
            <div>Showing Results: 40</div>
            <div className="flex gap-1 items-center">
              <div> Sort By: </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 flex-1 mx-auto p-2">
            {mockTutors.map((tutor, index) => (
              <TutorCard
                key={index}
                id={tutor.id}
                university={tutor.university}
                subject={tutor.subject}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
