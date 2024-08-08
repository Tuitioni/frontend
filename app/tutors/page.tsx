import React from "react";
import TutorCard from "@/ui/tutors/TutorCard"; // Adjust the import path as needed

// Define the type for a tutor
interface Tutor {
  id: string;
  university: string;
  subject: string;
}

export default function Page() {
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
      <div className="flex">
        <div>Search</div>
        <div className="grid grid-cols-3 gap-4 p-4 flex-1">
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
    </>
  );
}
