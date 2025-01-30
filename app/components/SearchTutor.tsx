"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDistrictsData } from "@/app/hooks/useDistrictsData";
import { EDUCATION_LEVELS } from "@/app/constants/data";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchTutor() {
  const router = useRouter();
  const { districts, availableAreas, setDistrict, district } =
    useDistrictsData();

  const [area, setArea] = useState("all");
  const [level, setLevel] = useState("all");
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openArea, setOpenArea] = useState(false);

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
              {/* District Selector */}
              <div className="space-y-2">
                <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDistrict}
                      className="w-full justify-between"
                    >
                      {district === "all"
                        ? "Select District"
                        : districts.find(
                            (d) =>
                              d.district.toLowerCase() ===
                              district.toLowerCase()
                          )?.district || "Select District"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search district..." />
                      <CommandEmpty>No district found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setDistrict("all");
                            setOpenDistrict(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              district === "all" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Districts
                        </CommandItem>
                        {districts.map((d) => (
                          <CommandItem
                            key={d.district}
                            value={d.district}
                            onSelect={() => {
                              setDistrict(d.district.toLowerCase());
                              setOpenDistrict(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                district === d.district.toLowerCase()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {d.district}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Area Selector */}
              <div className="space-y-2">
                <Popover open={openArea} onOpenChange={setOpenArea}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openArea}
                      className="w-full justify-between"
                      disabled={district === "all"}
                    >
                      {area === "all"
                        ? district !== "all"
                          ? "Select Area"
                          : "Select District First"
                        : area}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search area..." />
                      <CommandEmpty>No area found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setArea("all");
                            setOpenArea(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              area === "all" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Areas
                        </CommandItem>
                        {availableAreas.map((areaItem) => (
                          <CommandItem
                            key={areaItem}
                            value={areaItem}
                            onSelect={() => {
                              setArea(areaItem.toLowerCase());
                              setOpenArea(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                area === areaItem.toLowerCase()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {areaItem}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

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
    </section>
  );
}
