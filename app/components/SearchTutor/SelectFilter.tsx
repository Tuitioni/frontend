import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

interface SelectFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  defaultOption: string;
  disabled?: boolean;
}

export function SelectFilter({
  value,
  onValueChange,
  options,
  placeholder,
  defaultOption,
  disabled = false,
}: SelectFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{defaultOption}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
