import React from "react";

interface JobCardProps {
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

export default function JobCard({
  type,
  postDate,
  title,
  description,
  medium,
  preferredTutor,
  tutoringDays,
  monthlySalary,
  subjects,
}: JobCardProps) {
  return (
    <div className="p-3 lg:p-2 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="mb-3 lg:mb-2">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-1">
        <div className="text-xs">Type: {type}</div>
        <div className="text-xs">Post Date: {postDate}</div>

        <div className="text-xs">Medium: {medium}</div>
        <div className="text-xs">Preferred Tutor: {preferredTutor}</div>

        <div className="text-xs">Tutoring Days: {tutoringDays}</div>
        <div className="text-xs">Monthly Salary: {monthlySalary}</div>

        <div className="text-xs col-span-2">
          Subjects: {subjects.join(", ")}
        </div>
      </div>
    </div>
  );
}
