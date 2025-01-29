import { Separator } from "@/components/ui/separator";
import Footer from "@/ui/Footer";
import Hero from "@/ui/Hero";
import Navbar from "@/ui/Navbar";
import SearchTutor from "@/ui/SearchTutor";
import TopTutors from "@/ui/TopTutors";
import YoutubePlayer from "@/ui/YoutubePlayer";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Separator className="my-8" />
      <SearchTutor />
      <TopTutors />
      <YoutubePlayer />
      <Footer />
    </div>
  );
}
