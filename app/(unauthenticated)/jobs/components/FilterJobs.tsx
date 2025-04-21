import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DistrictAreaSelector from "@/app/(unauthenticated)/jobs/components/DistrictAreaSelector";

interface FilterJobsProps {
  onFilterChange: (filters: {
    district: string;
    area: string;
    levelOfStudy: string;
  }) => void;
  onReset: () => void;
}

export default function FilterJobs({
  onFilterChange,
  onReset,
}: FilterJobsProps) {
  const [district, setDistrict] = useState("all");
  const [area, setArea] = useState("all");
  const [level, setLevel] = useState("all");

  const handleApplyFilters = () => {
    onFilterChange({
      district: district === "all" ? "" : district,
      area: area === "all" ? "" : area,
      levelOfStudy: level === "all" ? "" : level,
    });
  };

  const handleReset = () => {
    setDistrict("all");
    setArea("all");
    setLevel("all");
    onReset();
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 bg-card p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 lg:mb-4">
          Filter Jobs
        </h3>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <DistrictAreaSelector
            selectedDistrict={district}
            selectedArea={area}
            onDistrictChange={setDistrict}
            onAreaChange={setArea}
          />

          <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
            <label className="text-xs sm:text-sm lg:text-base font-medium">
              Level of Study
            </label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="higher-secondary">
                  Higher Secondary
                </SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
        <Button
          className="w-full text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          className="w-full text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
