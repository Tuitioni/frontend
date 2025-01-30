"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectFilter } from "./SearchTutor/SelectFilter";
import { useDistrictsData } from "@/app/hooks/useDistrictsData";
import { EDUCATION_LEVELS } from "@/app/constants/data";
import { Button } from "@/components/ui/button";

export default function SearchTutor() {
  const router = useRouter();
  const { districts, availableAreas, setDistrict, district } =
    useDistrictsData();

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
    <section className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg">
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
            <div className="grid md:grid-cols-2 gap-4">
              <SelectFilter
                value={district}
                onValueChange={setDistrict}
                options={districts.map((d) => ({
                  label: d.district,
                  value: d.district.toLowerCase(),
                }))}
                placeholder="Select District"
                defaultOption="All Districts"
              />

              <SelectFilter
                value={area}
                onValueChange={setArea}
                options={availableAreas.map((area) => ({
                  label: area,
                  value: area.toLowerCase(),
                }))}
                placeholder={
                  district !== "all" ? "Select Area" : "Select District First"
                }
                defaultOption="All Areas"
                disabled={district === "all"}
              />
            </div>

            <SelectFilter
              value={level}
              onValueChange={setLevel}
              options={EDUCATION_LEVELS}
              placeholder="Select Level"
              defaultOption="All Levels"
            />

            <Button variant="default" onClick={handleFindTutor}>
              Find Tutor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
