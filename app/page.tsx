import { Separator } from "@/components/ui/separator";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import SearchTutor from "@/app/components/SearchTutor";
import TopTutors from "@/app/components/TopTutors";
import YoutubePlayer from "@/app/components/YoutubePlayer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SearchTutor />
        <TopTutors />
        <YoutubePlayer />
      </main>
      <Footer />
    </div>
  );
}
