import React from "react";

interface JobCardProps {
  title: string;
  description: string;
  medium: string; // Represents `medium` from the API response.
  subjects: string[]; // List of subjects from the API.
  tutoringDays: string; // Represents `numberOfDays` as formatted text.
  monthlySalary: string; // Represents `salary` as formatted text with a dollar sign.
}

export default function JobCard({
  title,
  description,
  medium,
  subjects,
  tutoringDays,
  monthlySalary,
}: JobCardProps) {
  return (
    <div className="p-3 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="mb-2">
        <div className="font-bold text-sm sm:text-base">{title}</div>
        <div className="text-xs sm:text-sm text-gray-600">{description}</div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        <div className="text-xs sm:text-sm">Medium: {medium}</div>
        <div className="text-xs sm:text-sm">Tutoring Days: {tutoringDays}</div>
        <div className="text-xs sm:text-sm">
          Monthly Salary: {monthlySalary}
        </div>
        <div className="text-xs sm:text-sm">
          Subjects: {subjects.length > 0 ? subjects.join(", ") : "N/A"}
        </div>
      </div>
    </div>
  );
}
