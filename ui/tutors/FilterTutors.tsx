import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the type for the onFilter prop
interface FilterTutorsProps {
  onFilter: (filteredTutors: any[]) => void; // Callback to send filtered tutors
}

export default function FilterTutors({ onFilter }: FilterTutorsProps) {
  const [areas, setAreas] = useState<string[]>([]);
  const [district, setDistrict] = useState<string>("Dhaka");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedMedium, setSelectedMedium] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [allData, setAllData] = useState<any[]>([]);

  // Fetch the JSON data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
        );
        const data = await response.json();
        setAllData(data);

        // Find and set areas for the default district
        const defaultDistrict = data.find((d: any) => d.district === district);
        if (defaultDistrict) {
          setAreas(defaultDistrict.areas);
        }
      } catch (error) {
        console.error("Error fetching areas data:", error);
      }
    };

    fetchData();
  }, [district]); // Re-run if `district` changes

  // Handle the "Search" button click
  const handleSearch = async () => {
    const filters = {
      district,
      area: selectedArea,
      teachingLevel: selectedLevel,
    };

    try {
      const response = await fetch("/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      console.log("Filtered Tutors:", data);

      // Pass the filtered data to the parent
      onFilter(data);
    } catch (error) {
      console.error("Error fetching filtered tutors:", error);
    }
  };

  return (
    <div className="flex flex-col w-1/4 px-2 py-2 gap-3 bg-bluishGrey ml-2 rounded-lg">
      {/* District Dropdown */}
      <Select
        onValueChange={(value) => {
          setDistrict(value);
          const selectedDistrict = allData.find(
            (d: any) => d.district === value
          );
          setAreas(selectedDistrict ? selectedDistrict.areas : []);
        }}
      >
        <SelectTrigger className="lg:w-[180px] w-[60px] sm:w-[150px]">
          <SelectValue placeholder="District" />
        </SelectTrigger>
        <SelectContent>
          {allData.map((d: any) => (
            <SelectItem key={d.district} value={d.district}>
              {d.district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Area Dropdown */}
      <Select
        onValueChange={(value) => {
          setSelectedArea(value);
        }}
      >
        <SelectTrigger className="lg:w-[180px] w-[60px] sm:w-[150px]">
          <SelectValue placeholder="Area" />
        </SelectTrigger>
        <SelectContent>
          {areas.map((area, index) => (
            <SelectItem key={index} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Level Dropdown */}
      <Select onValueChange={(value) => setSelectedLevel(value)}>
        <SelectTrigger className="lg:w-[180px] w-[60px] sm:w-[150px]">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="secondary">Secondary</SelectItem>
          <SelectItem value="primary">Primary</SelectItem>
        </SelectContent>
      </Select>

      <div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
}
