"use client";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/profile/dashboard" },
  // { name: "Job Board", path: "/profile/job-board" },
  // { name: "Notification", path: "/profile/notification" },
  { name: "Update Profile", path: "/profile/update-profile" },
  { name: "Payment Section", path: "/profile/payment-section" },
  // { name: "My Apply Status", path: "/profile/apply-status" },
  {
    name: "Profile Verification Request",
    path: "/profile/verification-request",
  },
  // { name: "Security", path: "/profile/security" },
];

export default function User() {
  const pathname = usePathname();

  return (
    <div className="h-screen p-4 w-1/4 bg-gray-100">
      <div className="mx-auto">
        <div className="mb-4 flex justify-center">
          <Image
            alt="dummy image"
            src="https://picsum.photos/400/300"
            width={200}
            height={150}
          />
        </div>
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            <Link href={item.path}>
              <div
                className={`mx-auto p-2 rounded  ${
                  pathname === item.path
                    ? "bg-yellow text-white"
                    : "bg-sky-100 hover:bg-yellow hover:text-white"
                }`}
              >
                {item.name}
              </div>
            </Link>
            {index < menuItems.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}
