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
      <div className="mx-auto">
        <div className="md:text-xl font-semibold text-base mt-8 ">
          Select Your Role
        </div>

        {/* Select Component for Role */}
        <Select onValueChange={(value) => setRole(value)}>
          <SelectTrigger className="w-48 mt-2 text-lg border border-gray-300 rounded-lg shadow-md">
            <SelectValue placeholder="I am a..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Information Display */}
      {role === "teacher" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md text-center text-lg">
          You choose tuition, confirm with us, and pay 30% of your first month
          or 15% of the first 3 months.
        </div>
      )}
      {role === "student" && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center text-lg">
          You find a teacher. After confirmation, you need to let us know.
        </div>
      )}
    </>
  );
}
