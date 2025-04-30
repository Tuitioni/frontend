import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option: SelectOption) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const selected = options.find(
      (option: SelectOption) => option.value === value
    );
    setDisplayValue(selected ? selected.label : "");
    setSearchTerm("");
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        const selected = options.find(
          (option: SelectOption) => option.value === value
        );
        setDisplayValue(selected ? selected.label : "");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value, options]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    onChange(optionValue);
    setDisplayValue(optionLabel);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center relative ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        ref={inputRef}
      >
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
          onFocus={() => !disabled && setIsOpen(true)}
          required={required}
          autoComplete="off"
        />
        <ChevronDown className="absolute right-3 h-4 w-4 opacity-50" />
      </div>
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-popover-foreground shadow-md"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No options found
            </div>
          ) : (
            filteredOptions.map((option: SelectOption) => (
              <div
                key={option.value}
                className={`px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  option.value === value
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => handleOptionClick(option.value, option.label)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
      <input type="hidden" value={value || ""} />
    </div>
  );
}
