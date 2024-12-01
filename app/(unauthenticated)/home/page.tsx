import { Separator } from "@/components/ui/separator";
import Hero from "@/ui/Hero";
import SearchTutor from "@/ui/SearchTutor";
import TopTutors from "@/ui/TopTutors";
import YoutubePlayer from "@/ui/YoutubePlayer";

export default function Home() {
  return (
    <>
      <Hero />
      <Separator className="my-8" />
      <SearchTutor />
      <TopTutors />
      <YoutubePlayer />
    </>
  );
}
