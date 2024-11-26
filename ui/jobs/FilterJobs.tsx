import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterJobs() {
  return (
    <div className="flex flex-col w-1/4 px-2 py-2 gap-3 bg-bluishGrey ml-2 rounded-lg">
      <div>
        <div className="text-sm md:text-base mb-2">Gender</div>
        <div className="flex flex-col lg:flex-row gap-2">
          <Button
            variant="yellowBorder"
            className="md:h-10 md:px-4 md:py-2 h-7 "
          >
            Male
          </Button>
          <Button
            variant="yellowBorder"
            className="md:h-10 md:px-4 md:py-2 h-7 "
          >
            Female
          </Button>
        </div>
      </div>

      <div className="">
        <div className="text-sm md:text-base mb-2">Tuition Type</div>
        <div className="flex flex-col lg:flex-row gap-2">
          <Button
            variant="yellowBorder"
            className="md:h-10 md:px-4 md:py-2 h-7"
          >
            Online
          </Button>
          <Button
            variant="yellowBorder"
            className="md:h-10 md:px-4 md:py-2 h-7"
          >
            Offline
          </Button>
          <Button
            variant="yellowBorder"
            className="md:h-10 md:px-4 md:py-2 h-7"
          >
            Hybrid
          </Button>
        </div>
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Medium" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <Button>Search</Button>
      </div>
    </div>
  );
}
