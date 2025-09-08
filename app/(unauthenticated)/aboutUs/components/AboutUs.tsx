"use client";
import React, { useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AboutUs() {
  const [role, setRole] = useState("teacher");

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-xl md:text-2xl font-semibold text-center mt-8">
          Select Your Role
        </div>

        {/* Select Component for Role */}
        <div className="flex justify-center">
          <Select onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-48 md:w-64 mt-4 text-base md:text-lg border border-gray-300 rounded-lg shadow-md">
              <SelectValue placeholder="I am a..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conditional Information Display */}
      {role === "teacher" && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md text-center max-w-2xl mx-auto">
          <p className="text-base md:text-lg">
            You choose tuition, confirm with us, and pay 30% of your first month
            or 15% of the first 3 months.
          </p>
        </div>
      )}
      {role === "student" && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md text-center max-w-2xl mx-auto">
          <p className="text-base md:text-lg">
            You find a teacher. After confirmation, you need to let us know.
          </p>
        </div>
      )}
    </>
  );
}
