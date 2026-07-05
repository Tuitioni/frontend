import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
