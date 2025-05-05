"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EDUCATION_LEVELS } from "@/app/constants/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionWrapper } from "./SectionWrapper";
import DistrictAreaSelector from "@/app/(unauthenticated)/jobs/components/DistrictAreaSelector";

export default function SearchTutor() {
  const router = useRouter();
  const [district, setDistrict] = useState("all");
  const [area, setArea] = useState("all");
  const [level, setLevel] = useState("all");

  const handleFindTutor = () => {
    const params = new URLSearchParams();
    if (district !== "all") params.set("district", district);
    if (area !== "all") params.set("area", area);
    if (level !== "all") params.set("level", level);
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <SectionWrapper className="bg-white">
      <div className="bg-bluishGrey rounded-2xl shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Content Section */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Looking for interesting tuition jobs?
            </h2>
            <p className="text-gray-600">
              Join our community of 500+ verified tutoring opportunities.
              Whether youre starting your teaching journey or you&apos;re an
              experienced educator, find the perfect match for your expertise.
            </p>
          </div>

          {/* Search Filters Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <DistrictAreaSelector
              selectedDistrict={district}
              selectedArea={area}
              onDistrictChange={setDistrict}
              onAreaChange={setArea}
            />

            {/* Education Level Selector */}
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {EDUCATION_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="default"
              onClick={handleFindTutor}
              className="w-full"
            >
              Find Tutor
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
