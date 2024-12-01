import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SearchTutor() {
  return (
    <div className="bg-bluishGrey mt-10 mx-20 md:p-5 p-1 rounded-lg flex gap-2 ">
      <div className="flex-1 flex flex-col gap-3">
        <div className="md:text-2xl text-base  font-bold flex flex-col gap-2">
          Looking for interesting tuition jobs to excel your teaching
          experience?
        </div>
        <div className="md:text-base text-xs">
          If teaching jobs interests you, then you are on the right place.
          tutorsheba.com, we often have 500+ open home tuition jobs that are
          genuine and 100% verified. Whether you are starting your career as a
          tuition teacher or an expert in your field,{" "}
        </div>
      </div>
      <div className="bg-white flex-1 md:p-5 p-2 rounded-lg">
        <div className="flex flex-col gap-2 items-center">
          {/* Single row of Select components that changes layout based on screen size */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <Select>
              <SelectTrigger className="md:w-[180px] w-[100px]">
                <SelectValue placeholder="Curriculum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Bangla Medium</SelectItem>
                <SelectItem value="dark">English Version</SelectItem>
                <SelectItem value="system">English Medium</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="md:w-[180px] w-[100px]">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Second row of Select components */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <Select>
              <SelectTrigger className="md:w-[180px] w-[100px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Primary</SelectItem>
                <SelectItem value="dark">Middle School</SelectItem>
                <SelectItem value="dark">SSC or HSC</SelectItem>
                <SelectItem value="light">O/A-levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Button variant="default">Find Tutor</Button>
        </div>
      </div>
    </div>
  );
}
