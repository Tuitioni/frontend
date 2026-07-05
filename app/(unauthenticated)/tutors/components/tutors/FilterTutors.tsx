import { Menu, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface DistrictData {
  district: string;
  areas: string[];
}

interface FilterTutorsProps {
  onFilterChange: (filters: { district: string; area: string; level: string }) => void;
  onReset: () => void;
}

export default function FilterTutors({ onFilterChange, onReset }: FilterTutorsProps) {
  const [district, setDistrict] = useState('all');
  const [area, setArea] = useState('all');
  const [level, setLevel] = useState('all');
  const [districtsData, setDistrictsData] = useState<DistrictData[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openArea, setOpenArea] = useState(false);

  useEffect(() => {
    const fetchDistrictsData = async () => {
      try {
        const response = await fetch(
          'https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json'
        );
        const data = await response.json();
        setDistrictsData(data);
      } catch (error) {}
    };

    fetchDistrictsData();
  }, []);

  useEffect(() => {
    if (district && district !== 'all') {
      const selectedDistrict = districtsData.find(
        (d) => d.district.toLowerCase() === district.toLowerCase()
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
    setArea('all'); // Reset area when district changes
  }, [district, districtsData]);

  const handleApplyFilters = () => {
    onFilterChange({
      district: district === 'all' ? '' : district,
      area: area === 'all' ? '' : area,
      level: level === 'all' ? '' : level,
    });
  };

  const handleReset = () => {
    setDistrict('all');
    setArea('all');
    setLevel('all');
    onReset();
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-soft-sm lg:p-6">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <span className="h-2 w-2 rounded-full bg-amber" />
          Refine
        </span>
        <h3 className="font-display text-xl font-bold tracking-tight">Filter Tutors</h3>

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
                    : districtsData.find((d) => d.district.toLowerCase() === district.toLowerCase())
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
                      {districtsData.map((d) => (
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
                <SelectItem value="primary">Primary (Class 1-5)</SelectItem>
                <SelectItem value="junior">Junior Secondary (Class 6-8)</SelectItem>
                <SelectItem value="secondary">Secondary (Class 9-10)</SelectItem>
                <SelectItem value="higher">Higher Secondary (Class 11-12)</SelectItem>
                <SelectItem value="admission">Admission Test</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
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

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-4 right-4 z-20 h-12 w-12 rounded-full shadow-glow"
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
