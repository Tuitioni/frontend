"use client";

import * as React from "react";
import Select, { MultiValue } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: MultiSelectProps) {
  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={(newValue: MultiValue<Option>) =>
        onChange(newValue.map((option) => option.value))
      }
      placeholder={placeholder}
      className="w-full"
    />
  );
}
