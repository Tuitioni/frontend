import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface DistrictData {
  district: string;
  areas: string[];
}

interface FilterTutorsProps {
  onFilterChange: (filters: {
    district: string;
    area: string;
    level: string;
  }) => void;
  onReset: () => void;
}

export default function FilterTutors({
  onFilterChange,
  onReset,
}: FilterTutorsProps) {
  const [district, setDistrict] = React.useState("all");
  const [area, setArea] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  const [districtsData, setDistrictsData] = useState<DistrictData[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchDistrictsData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
        );
        const data = await response.json();
        setDistrictsData(data);
      } catch (error) {
        console.error("Error fetching districts data:", error);
      }
    };

    fetchDistrictsData();
  }, []);

  useEffect(() => {
    if (district && district !== "all") {
      const selectedDistrict = districtsData.find(
        (d) => d.district.toLowerCase() === district.toLowerCase()
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
    setArea("all"); // Reset area when district changes
  }, [district, districtsData]);

  const handleApplyFilters = () => {
    onFilterChange({
      district: district === "all" ? "" : district,
      area: area === "all" ? "" : area,
      level: level === "all" ? "" : level,
    });
  };

  const handleReset = () => {
    setDistrict("all");
    setArea("all");
    setLevel("all");
    onReset();
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-6 bg-card p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="font-semibold mb-4">Filter Tutors</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">District</label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districtsData.map((d) => (
                  <SelectItem key={d.district} value={d.district.toLowerCase()}>
                    {d.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Area</label>
            <Select
              value={area}
              onValueChange={setArea}
              disabled={district === "all"}
            >
              <SelectTrigger className="w-full">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Level of Study</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="primary">Primary (Class 1-5)</SelectItem>
                <SelectItem value="junior">
                  Junior Secondary (Class 6-8)
                </SelectItem>
                <SelectItem value="secondary">
                  Secondary (Class 9-10)
                </SelectItem>
                <SelectItem value="higher">
                  Higher Secondary (Class 11-12)
                </SelectItem>
                <SelectItem value="admission">Admission Test</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </>
  );
}
