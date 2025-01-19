import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust the import path as needed

// Define the type for the TutorCard props
interface TutorCardProps {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  medium: string;
  education: string;
  subjects: string[]; // Ensure it's always an array
  yearsOfExperience: number;
}

export default function TutorCard({
  id,
  firstName,
  lastName,
  location,
  phone,
  medium,
  education,
  subjects,
  yearsOfExperience,
}: TutorCardProps) {
  return (
    <div className="w-full max-w-[250px] h-auto md:w-[250px] md:h-[280px] rounded-lg p-4 flex flex-col items-center gap-3 shadow-lg bg-white">
      <Avatar className="w-16 h-16 md:w-20 md:h-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="Tutor Avatar" />
        <AvatarFallback>
          {firstName.charAt(0)}
          {lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center text-gray-800 font-semibold text-lg">
        {firstName} {lastName}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        Location: {location}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        Medium: {medium}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        Education: {education}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        Subjects:{" "}
        {subjects && subjects.length > 0
          ? subjects.join(", ")
          : "No subjects listed"}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        Experience: {yearsOfExperience} years
      </div>
    </div>
  );
}
