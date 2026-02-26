import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
