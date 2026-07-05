import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DistrictData {
  district: string;
  areas: string[];
}

interface FilterJobsProps {
  onFilterChange: (filters: { district: string; area: string; levelOfStudy: string }) => void;
  onReset: () => void;
}

export default function FilterJobs({ onFilterChange, onReset }: FilterJobsProps) {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [district, setDistrict] = useState('all');
  const [area, setArea] = useState('all');
  const [level, setLevel] = useState('all');
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openArea, setOpenArea] = useState(false);

  useEffect(() => {
    fetch(
      'https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json'
    )
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (district && district !== 'all') {
      const selectedDistrict = districts.find(
        (d) => d.district.toLowerCase() === district.toLowerCase()
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
    setArea('all');
  }, [district, districts]);

  const handleApplyFilters = () => {
    onFilterChange({
      district: district === 'all' ? '' : district,
      area: area === 'all' ? '' : area,
      levelOfStudy: level === 'all' ? '' : level,
    });
  };

  const handleReset = () => {
    setDistrict('all');
    setArea('all');
    setLevel('all');
    onReset();
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-soft-sm lg:p-6">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <span className="h-2 w-2 rounded-full bg-amber" />
          Refine
        </span>
        <h3 className="font-display text-xl font-bold tracking-tight">Filter Jobs</h3>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">District</label>
            <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openDistrict}
                  className="h-10 w-full justify-between rounded-pill text-sm font-normal"
                >
                  {district === 'all'
                    ? 'Select District'
                    : districts.find((d) => d.district.toLowerCase() === district.toLowerCase())
                        ?.district || 'Select District'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search district..." />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setDistrict('all');
                          setOpenDistrict(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            district === 'all' ? 'opacity-100' : 'opacity-0'
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
                              'mr-2 h-4 w-4',
                              district === d.district.toLowerCase() ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {d.district}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Area</label>
            <Popover open={openArea} onOpenChange={setOpenArea}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openArea}
                  className="h-10 w-full justify-between rounded-pill text-sm font-normal"
                  disabled={district === 'all'}
                >
                  {area === 'all'
                    ? district !== 'all'
                      ? 'Select Area'
                      : 'Select District First'
                    : area}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search area..." />
                  <CommandList>
                    <CommandEmpty>No area found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setArea('all');
                          setOpenArea(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            area === 'all' ? 'opacity-100' : 'opacity-0'
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
                              'mr-2 h-4 w-4',
                              area === areaItem.toLowerCase() ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {areaItem}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Level of Study</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="h-10 w-full rounded-pill text-sm">
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

      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
        <Button
          size="lg"
          className="w-full rounded-pill font-semibold shadow-glow"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-pill font-semibold"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
