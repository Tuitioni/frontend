import React from "react";
import Image from "next/image";
import { TutorCard } from "./TutorCard";
import { SectionTitle } from "./SectionTitle";

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
    <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <SectionTitle
        title="Top Tutors"
        subtitle="We help to make communication between teachers and students"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </section>
  );
}
