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
    <div className="flex flex-col gap-1 w-[700px] p-4 border rounded-md shadow-sm">
      <div className="flex justify-between">
        <div>Type: {type}</div>
        <div>Post Date: {postDate}</div>
      </div>
      <div>
        <div className="font-bold text-lg">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div className="flex justify-between">
        <div>Medium: {medium}</div>
        <div>Preferred Tutor: {preferredTutor}</div>
      </div>
      <div className="flex justify-between">
        <div>Tutoring Days: {tutoringDays}</div>
        <div>Monthly Salary: {monthlySalary}</div>
      </div>
      <div>Subjects: {subjects.join(", ")}</div>
    </div>
  );
}
