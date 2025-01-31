import React from "react";
import { TutorCard } from "./TutorCard";
import { SectionTitle } from "./SectionTitle";
import { SectionWrapper } from "./SectionWrapper";

// Move types to separate types.ts file or define here if small project
interface Tutor {
  id: string;
  subject: string;
  institute: string;
  imageUrl: string;
  name: string;
  rating: number;
}

const dummyTutors: Tutor[] = [
  {
    id: "1",
    name: "John Doe",
    subject: "Mathematics",
    institute: "ABC Institute",
    imageUrl: "https://picsum.photos/400/300",
    rating: 4.8,
  },
  // ... existing tutors with added properties ...
];

export default function TopTutors() {
  return (
    <SectionWrapper className="bg-bluishGrey">
      <SectionTitle
        title="Top Tutors"
        subtitle="We help to make communication between teachers and students"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </SectionWrapper>
  );
}
