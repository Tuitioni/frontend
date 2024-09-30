import User from "@/ui/profile/User";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <User />
      {children}
    </div>
  );
}
