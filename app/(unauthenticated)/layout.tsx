import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
