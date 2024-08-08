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
    <div className="w-[250px] h-[280px] rounded-md p-4 flex flex-col gap-1 shadow-md">
      <div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div>ID: {id}</div>
      <div>University: {university}</div>
      <div>Subject: {subject}</div>
    </div>
  );
}
