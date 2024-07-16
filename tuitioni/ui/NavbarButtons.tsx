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
    <div className="flex gap-2">
      {buttons.map((button) => (
        <Link key={button.path} href={button.path}>
          <Button
            variant={pathname === button.path ? "activeOutline" : "outline"}
          >
            {button.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
