import Image from "next/image";
import React from "react";

const menuItems = [
  "Dashboard",
  "Job Board",
  "Notification",
  "Update Profile",
  "Payment Section",
  "My Apply Status",
  "Profile Verification Request",
  "Security",
];

export default function User() {
  return (
    <div className="h-screen p-4 w-1/4 bg-gray-100">
      <div className="mb-4">
        <Image
          alt="dummy image"
          src="https://via.placeholder.com/100" // Dummy image URL
          width={100}
          height={100}
        />
      </div>
      {menuItems.map((item, index) => (
        <div key={index} className="mb-2">
          <button className="w-full p-2 text-left bg-blue-500 text-black rounded hover:bg-blue-600">
            {item}
          </button>
        </div>
      ))}
    </div>
  );
}
