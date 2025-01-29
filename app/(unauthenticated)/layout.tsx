import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
