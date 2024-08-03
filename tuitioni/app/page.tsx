import { Separator } from "@/components/ui/separator";
import Hero from "@/ui/Hero";
import VideoPlayer from "@/ui/VideoPlayer";

export default function Home() {
  return (
    <>
      <Hero />
      <Separator className="my-8" />
      <div className="w-full flex justify-center mb-4 ">
        <VideoPlayer url="https://www.youtube.com/watch?v=silITbHntzA" />
      </div>
    </>
  );
}
