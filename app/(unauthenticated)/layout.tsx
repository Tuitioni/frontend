import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
