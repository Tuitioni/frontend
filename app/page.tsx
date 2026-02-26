import Hero from '@/components/landing/Hero';
import SearchTutor from '@/components/landing/SearchTutor';
import TopTutors from '@/components/landing/TopTutors';
import YoutubePlayer from '@/components/landing/YoutubePlayer';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

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
