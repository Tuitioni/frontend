import React from "react";
import Image from "next/image";

const dummyTutors = [
  {
    id: "1",
    subject: "Math",
    institute: "ABC Institute",
    imageUrl: "https://picsum.photos/400/300",
  },
  {
    id: "2",
    subject: "Science",
    institute: "XYZ Academy",
    imageUrl: "https://picsum.photos/400/300",
  },
  {
    id: "3",
    subject: "English",
    institute: "LMN School",
    imageUrl: "https://picsum.photos/400/300",
  },
  // Add more tutor objects as needed
];

export default function TopTutors() {
  return (
    <div className="mt-10 mx-20">
      <div className="text-yellow md:text-xl font-semibold text-lg ">
        Top Tutors
      </div>
      <div className="text-xl mb-6">
        We help to make communication between teachers and students
      </div>
      <div className="flex flex-wrap gap-6">
        {dummyTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="flex flex-col w-[250px] bg-white shadow-lg rounded-md overflow-hidden"
          >
            <div className="relative h-[220px] w-full">
              <Image
                fill
                style={{ objectFit: 'cover' }}
                src={tutor.imageUrl}
                alt={`Tutor ${tutor.id}`}
              />
            </div>
            <div className="p-4">
              <div className="text-sm font-medium text-gray-700">
                ID: {tutor.id}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Subject: {tutor.subject}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Institute: {tutor.institute}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
