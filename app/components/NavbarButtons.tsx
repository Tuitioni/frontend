"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function NavbarButtons() {
  const pathname = usePathname();

  const buttons = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Tutors", path: "/tutors" },
    { name: "How we work", path: "/aboutUs" },
  ];

  return (
    <div className="flex gap-0.5 sm:gap-1 md:gap-2">
      {buttons.map((button) => (
        <Link key={button.path} href={button.path}>
          <Button
            variant={pathname === button.path ? "activeOutline" : "outline"}
            size="sm"
            className="text-xs bg-transparent sm:text-sm md:text-base px-2 sm:px-3 md:px-4 h-7 sm:h-8 md:h-9"
          >
            {button.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
