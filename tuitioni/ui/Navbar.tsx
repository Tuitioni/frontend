import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import NavbarButtons from "./NavbarButtons";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-8 py-2 border-b">
      <div>
        <Image src="/Logo.svg" width={100} height={80} alt="Logo" />
      </div>
      <NavbarButtons />
      <div className="flex gap-2">
        <Button
          variant="default"
          className=" border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink "
        >
          Login
        </Button>
        <Button
          className="border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink"
          variant="default"
        >
          Register
        </Button>
      </div>
    </div>
  );
}
