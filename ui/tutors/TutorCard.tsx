import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust the import path as needed

// Define the type for the TutorCard props
interface TutorCardProps {
  id: string;
  university: string;
  subject: string;
}

export default function TutorCard({ id, university, subject }: TutorCardProps) {
  return (
    <div className="w-full max-w-[250px] h-auto md:w-[250px] md:h-[280px] rounded-lg p-4 flex flex-col items-center gap-3 shadow-lg bg-white">
      <Avatar className="w-16 h-16 md:w-20 md:h-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="Tutor Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-center text-gray-800 font-semibold text-lg">
        ID: {id}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        University: {university}
      </div>
      <div className="text-center text-gray-600 text-sm md:text-base">
        Subject: {subject}
      </div>
    </div>
  );
}
