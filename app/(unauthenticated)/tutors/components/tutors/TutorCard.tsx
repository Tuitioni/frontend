import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the type for the TutorCard props
interface TutorCardProps {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  medium: string;
  education: string;
  subjects: string[]; // Ensure it's always an array
  yearsOfExperience: number;
}

export default function TutorCard({
  id,
  firstName,
  lastName,
  location,
  phone,
  medium,
  education,
  subjects = [], // provide default empty array
  yearsOfExperience,
}: TutorCardProps) {
  // Ensure subjects is always an array
  const subjectList = Array.isArray(subjects) ? subjects : [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">
              {firstName} {lastName}
            </h3>
            <span className="text-sm text-gray-500">
              {yearsOfExperience} yrs exp
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <div>{education}</div>
            <div>{location}</div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {subjectList.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-full text-xs"
              >
                {subject}
              </span>
            ))}
            {subjectList.length > 3 && (
              <span className="text-xs text-gray-500">
                +{subjectList.length - 3} more
              </span>
            )}
          </div>

          <Link href={`/tutors/${id}`}>
            <Button className="w-full mt-2" variant="outline">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
