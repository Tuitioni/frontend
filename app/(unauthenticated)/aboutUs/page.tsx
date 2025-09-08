import AboutUs from "./components/AboutUs";
import React from "react";
import FAQ from "./components/FAQ";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-7xl mx-auto px-4 py-6">
      <AboutUs />
      <FAQ />
    </div>
  );
}
