import { Separator } from "@/components/ui/separator";
import Hero from "./ui/Hero";
import Navbar from "./ui/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Separator className="my-8" />
    </>
  );
}
