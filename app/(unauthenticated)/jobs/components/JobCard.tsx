import React from "react";
import { Button } from "@/components/ui/button";

// Define the interface for the job data
interface JobCardProps {
  id: string; // Job ID
  firstName: string; // First name of the job poster
  lastName: string; // Last name of the job poster
  district: string; // District of the job
  area: string; // Area of the job
  age: number; // Age of the student
  medium: string; // Medium of instruction
  levelOfStudy: string; // Level of study
  school: string | null; // School name
  college: string | null; // College name
  university: string | null; // University name
  subjects: string[]; // List of subjects
  gender: string; // Gender of the student
  salary: number; // Salary offered
  numberOfDays: number; // Number of tutoring days per week
  duration: string; // Duration of each session
  tuitionType: string; // Type of tuition (e.g., private)
  class: string; // Class of the student
  note: string; // Additional notes
  createdAt: string; // Creation date
  updatedAt: string; // Last updated date
  jobTitle: string; // Title of the job
  onApply: (id: string, jobTitle: string) => void; // Function to handle job application
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  firstName,
  lastName,
  district,
  area,
  age,
  medium,
  levelOfStudy,
  school,
  college,
  university,
  subjects,
  gender,
  salary,
  numberOfDays,
  duration,
  tuitionType,
  class: studentClass,
  note,
  createdAt,
  updatedAt,
  jobTitle,
  onApply,
}) => {
  return (
    <div className="p-3 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="mb-2">
        <div className="font-bold text-sm sm:text-base">
          {firstName} {lastName} - {jobTitle}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">{note}</div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        <div className="text-xs sm:text-sm">District: {district}</div>
        <div className="text-xs sm:text-sm">Area: {area}</div>
        <div className="text-xs sm:text-sm">Age: {age}</div>
        <div className="text-xs sm:text-sm">Medium: {medium}</div>
        <div className="text-xs sm:text-sm">Level of Study: {levelOfStudy}</div>
        <div className="text-xs sm:text-sm">School: {school || "N/A"}</div>
        <div className="text-xs sm:text-sm">
          Subjects: {subjects.join(", ")}
        </div>
        <div className="text-xs sm:text-sm">Salary: ${salary}</div>
        <div className="text-xs sm:text-sm">Days per Week: {numberOfDays}</div>
        <div className="text-xs sm:text-sm">Duration: {duration}</div>
        <div className="text-xs sm:text-sm">Tuition Type: {tuitionType}</div>
        <div className="text-xs sm:text-sm">Class: {studentClass}</div>
      </div>
      <Button onClick={() => onApply(id, jobTitle)}>Apply</Button>
    </div>
  );
};

export default JobCard;
