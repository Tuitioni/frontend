import { Separator } from "@/components/ui/separator";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import SearchTutor from "@/app/components/SearchTutor";
import TopTutors from "@/app/components/TopTutors";
import YoutubePlayer from "@/app/components/YoutubePlayer";

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
