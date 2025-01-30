import AboutUs from "./components/AboutUs";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col gap-2 items-center text-4xl w-full">
      <AboutUs />
      <div>User Flow</div>
      <div>FAQ</div>
    </div>
  );
}
