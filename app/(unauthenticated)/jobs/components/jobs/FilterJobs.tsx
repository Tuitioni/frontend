import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistrictData {
  district: string;
  areas: string[];
}

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
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [district, setDistrict] = useState("all");
  const [area, setArea] = useState("all");
  const [level, setLevel] = useState("all");
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
    )
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  useEffect(() => {
    if (district && district !== "all") {
      const selectedDistrict = districts.find(
        (d) => d.district.toLowerCase() === district.toLowerCase()
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
    setArea("all");
  }, [district, districts]);

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
    <div className="flex flex-col gap-4 bg-card p-4 lg:p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="font-semibold mb-3 lg:mb-4">Filter Jobs</h3>

        <div className="space-y-3 lg:space-y-4">
          <div className="space-y-1 lg:space-y-2">
            <label className="text-sm font-medium">District</label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d.district} value={d.district.toLowerCase()}>
                    {d.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 lg:space-y-2">
            <label className="text-sm font-medium">Area</label>
            <Select
              value={area}
              onValueChange={setArea}
              disabled={district === "all"}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue
                  placeholder={
                    district !== "all" ? "Select Area" : "Select District First"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {availableAreas.map((area) => (
                  <SelectItem key={area} value={area.toLowerCase()}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 lg:space-y-2">
            <label className="text-sm font-medium">Level of Study</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full text-sm">
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
        <Button className="w-full" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
