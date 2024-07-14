import { Button } from "@/components/ui/button";
import Logo from "@/app/ui/Logo";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-between px-8 py-2 border-b">
      <div>
        <Logo />
      </div>
      <div className="flex gap-2">
        <Button className="" variant="outline">
          Home
        </Button>
        <Button className="ghost" variant="outline">
          Job
        </Button>
        <Button className="ghost" variant="outline">
          Tutors
        </Button>
        <Button className="ghost" variant="outline">
          How we work
        </Button>
      </div>
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
