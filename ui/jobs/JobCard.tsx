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
    <div className="p-4 border rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="mb-4">
        <div className="font-bold text-lg md:text-xl xl:text-2xl">{title}</div>
        <div className="text-xs md:text-sm xl:text-base text-gray-600">
          {description}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-sm md:text-base xl:text-lg">Type: {type}</div>
        <div className="text-sm md:text-base xl:text-lg">
          Post Date: {postDate}
        </div>

        <div className="text-sm md:text-base xl:text-lg">Medium: {medium}</div>
        <div className="text-sm md:text-base xl:text-lg">
          Preferred Tutor: {preferredTutor}
        </div>

        <div className="text-sm md:text-base xl:text-lg">
          Tutoring Days: {tutoringDays}
        </div>
        <div className="text-sm md:text-base xl:text-lg">
          Monthly Salary: {monthlySalary}
        </div>

        <div className="text-sm md:text-base xl:text-lg col-span-2">
          Subjects: {subjects.join(", ")}
        </div>
      </div>
    </div>
  );
}
