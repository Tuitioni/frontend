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
    <div className="bg-bluishGrey mt-10 mx-20 p-5 rounded-lg flex gap-2 ">
      <div className="flex-1 flex flex-col gap-3">
        <div className="text-2xl font-bold flex flex-col gap-2">
          Looking for interesting tuition jobs to excel your teaching
          experience?
        </div>
        <div className="text-base">
          If teaching jobs interests you, then you are on the right place.
          tutorsheba.com, we often have 500+ open home tuition jobs that are
          genuine and 100% verified. Whether you are starting your career as a
          tuition teacher or an expert in your field,{" "}
        </div>
      </div>
      <div className="bg-white flex-1 p-5 rounded-lg">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Button
            variant="default"
            className=" border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink "
          >
            Find Tutor
          </Button>
        </div>
      </div>
    </div>
  );
}
