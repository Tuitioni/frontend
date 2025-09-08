"use client";

import { useState } from "react";

import { Button } from "./button";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start"
      >
        {value.toLocaleDateString()}
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={value.toISOString().split("T")[0]}
            onChange={(e) => {
              onChange(new Date(e.target.value));
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
