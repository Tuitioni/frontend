"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface DistrictData {
  district: string;
  areas: string[];
}

export default function SearchTutor() {
  const router = useRouter();
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [district, setDistrict] = useState("all");
  const [area, setArea] = useState("all");
  const [level, setLevel] = useState("all");
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json')
      .then(response => response.json())
      .then(data => setDistricts(data))
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  useEffect(() => {
    if (district && district !== 'all') {
      const selectedDistrict = districts.find(d => d.district.toLowerCase() === district.toLowerCase());
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
    setArea("all");
  }, [district, districts]);

  const handleFindTutor = () => {
    // Create query parameters from the selected filters
    const params = new URLSearchParams();
    if (district !== 'all') params.set('district', district);
    if (area !== 'all') params.set('area', area);
    if (level !== 'all') params.set('level', level);

    // Redirect to tutors page with filters
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <div className="bg-bluishGrey mt-10 mx-20 md:p-5 p-1 rounded-lg flex gap-2">
      <div className="flex-1 flex flex-col gap-3">
        <div className="md:text-2xl text-base font-bold flex flex-col gap-2">
          Looking for interesting tuition jobs to excel your teaching experience?
        </div>
        <div className="md:text-base text-xs">
          If teaching jobs interests you, then you are on the right place.
          tutorsheba.com, we often have 500+ open home tuition jobs that are
          genuine and 100% verified. Whether you are starting your career as a
          tuition teacher or an expert in your field,{" "}
        </div>
      </div>
      <div className="bg-white flex-1 md:p-5 p-2 rounded-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <div className="flex-1">
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
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

            <div className="flex-1">
              <Select 
                value={area} 
                onValueChange={setArea}
                disabled={district === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder={district !== 'all' ? "Select Area" : "Select District First"} />
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
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <div className="flex-1">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="higher-secondary">Higher Secondary</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="default" onClick={handleFindTutor}>Find Tutor</Button>
        </div>
      </div>
    </div>
  );
}
