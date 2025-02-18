import React, { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scrollArea";

export interface DistrictData {
  district: string;
  areas: string[];
}

interface DistrictAreaSelectorProps {
  onDistrictChange: (district: string) => void;
  onAreaChange: (area: string) => void;
  selectedDistrict: string;
  selectedArea: string;
}

export default function DistrictAreaSelector({
  onDistrictChange,
  onAreaChange,
  selectedDistrict,
  selectedArea,
}: DistrictAreaSelectorProps) {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openArea, setOpenArea] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
    )
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all") {
      const selectedDistrictData = districts.find(
        (d) => d.district.toLowerCase() === selectedDistrict.toLowerCase()
      );
      setAvailableAreas(selectedDistrictData?.areas || []);
    } else {
      setAvailableAreas([]);
    }
  }, [selectedDistrict, districts]);

  const filteredDistricts = districts.filter((district) =>
    district.district.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredAreas = availableAreas.filter((area) =>
    area.toLowerCase().includes(areaSearch.toLowerCase())
  );

  return (
    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
      <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
        <label className="text-xs sm:text-sm lg:text-base font-medium">
          District
        </label>
        <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openDistrict}
              className="w-full justify-between text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
            >
              {selectedDistrict === "all"
                ? "Select District"
                : districts.find(
                    (d) =>
                      d.district.toLowerCase() ===
                      selectedDistrict.toLowerCase()
                  )?.district || "Select District"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 z-[9999] relative">
            <ScrollArea className="h-48">
              <Command className="z-[9999]">
                <CommandInput
                  placeholder="Search district..."
                  value={districtSearch}
                  onValueChange={setDistrictSearch}
                  className="z-[9999]"
                />
                <CommandEmpty>No district found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onDistrictChange("all");
                      setOpenDistrict(false);
                      setDistrictSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDistrict === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Districts
                  </CommandItem>
                  {filteredDistricts.map((d) => (
                    <CommandItem
                      key={d.district}
                      value={d.district}
                      onSelect={() => {
                        onDistrictChange(d.district.toLowerCase());
                        setOpenDistrict(false);
                        setDistrictSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedDistrict === d.district.toLowerCase()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {d.district}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
        <label className="text-xs sm:text-sm lg:text-base font-medium">
          Area
        </label>
        <Popover open={openArea} onOpenChange={setOpenArea}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openArea}
              className="w-full justify-between text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
              disabled={selectedDistrict === "all"}
            >
              {selectedArea === "all"
                ? selectedDistrict !== "all"
                  ? "Select Area"
                  : "Select District First"
                : selectedArea}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 z-[9999] relative">
            <ScrollArea className="h-48">
              <Command className="z-[9999]">
                <CommandInput
                  placeholder="Search area..."
                  value={areaSearch}
                  onValueChange={setAreaSearch}
                  className="z-[9999]"
                />
                <CommandEmpty>No area found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onAreaChange("all");
                      setOpenArea(false);
                      setAreaSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedArea === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Areas
                  </CommandItem>
                  {filteredAreas.map((areaItem) => (
                    <CommandItem
                      key={areaItem}
                      value={areaItem}
                      onSelect={() => {
                        onAreaChange(areaItem.toLowerCase());
                        setOpenArea(false);
                        setAreaSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedArea === areaItem.toLowerCase()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {areaItem}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
