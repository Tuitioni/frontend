'use client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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
import { EDUCATION_LEVELS } from '@/constants/data';
import { useDistrictsData } from '@/hooks/useDistrictsData';
import { cn } from '@/lib/utils';

import { SectionWrapper } from './SectionWrapper';

export default function SearchTutor() {
  const router = useRouter();
  const { districts, availableAreas, setDistrict, district } = useDistrictsData();

  const [area, setArea] = useState('all');
  const [level, setLevel] = useState('all');
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openArea, setOpenArea] = useState(false);

  const handleFindTutor = () => {
    const params = new URLSearchParams();
    if (district !== 'all') params.set('district', district);
    if (area !== 'all') params.set('area', area);
    if (level !== 'all') params.set('level', level);
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <SectionWrapper>
      <div className="overflow-hidden rounded-2xl border border-border bg-mesh shadow-soft-lg">
        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
          {/* Content Section */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-2 w-2 rounded-full bg-amber" />
              For tutors
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Looking for interesting tuition jobs?
            </h2>
            <p className="text-muted-foreground">
              Join our community of 500+ verified tutoring opportunities. Whether you&apos;re
              starting your teaching journey or you&apos;re an experienced educator, find the
              perfect match for your expertise.
            </p>
          </div>

          {/* Search Filters Section */}
          <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft-sm">
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
                                  district === d.district.toLowerCase()
                                    ? 'opacity-100'
                                    : 'opacity-0'
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

              {/* Area Selector */}
              <div className="space-y-2">
                <Popover open={openArea} onOpenChange={setOpenArea}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openArea}
                      className="w-full justify-between"
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

            <Button variant="default" onClick={handleFindTutor} className="w-full">
              Find Tutor
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
