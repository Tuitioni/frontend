"use client";
import React, { useEffect, useState } from "react";
import TutorCard from "@/app/(unauthenticated)/tutors/components/tutors/TutorCard"; // Adjust the import path as needed
import FilterTutors from "@/app/(unauthenticated)/tutors/components/tutors/FilterTutors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

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
        const response = await fetch("/api/teachers");
        const data = await response.json();
        setTutors(data);
        return;
      }

      // Fetch filtered teachers
      const response = await fetch("/api/teachers/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch filtered teachers");
      }

      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial filters from URL parameters
    const district = searchParams.get("district") || "";
    const area = searchParams.get("area") || "";
    const level = searchParams.get("level") || "";

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

  const handleFilterChange = (filters: {
    district: string;
    area: string;
    level: string;
  }) => {
    fetchFilteredTutors(filters);
  };

  const handleReset = () => {
    fetchFilteredTutors();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-4 min-h-[calc(100vh-6rem)]">
        {/* Filter section - hidden by default on mobile, shown in modal or sidebar */}
        <div className="lg:w-1/4 p-4">
          <FilterTutors
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Main content section */}
        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between px-4 mb-2 gap-2">
            <div>Showing Results: {tutors.length}</div>
            <div className="flex gap-1 items-center">
              <div>Sort By:</div>
              <Select>
                <SelectTrigger className="w-[180px]">
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
            <div className="text-center">Loading...</div>
          ) : (
            <div className="overflow-y-auto flex-1 px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
