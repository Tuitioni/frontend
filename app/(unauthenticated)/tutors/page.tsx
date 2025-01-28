"use client";
import React, { useEffect, useState } from "react";
import TutorCard from "@/ui/tutors/TutorCard"; // Adjust the import path as needed
import FilterTutors from "@/ui/tutors/FilterTutors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function Page() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all tutors initially
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch("/api/teachers"); // Update this path based on your API route
        const data = await response.json();
        setTutors(data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <>
      <div className="flex mt-4">
        {/* Pass the setTutors function to FilterTutors */}
        <FilterTutors
          onFilter={(filteredTutors: Tutor[]) => setTutors(filteredTutors)}
        />
        <div className="w-3/4">
          <div className="flex justify-between px-4 mb-2">
            <div>Showing Results: {tutors.length}</div>
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
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 flex-1 mx-auto p-2">
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
          )}
        </div>
      </div>
    </>
  );
}
