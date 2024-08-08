import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-bluishGrey rounded-lg shadow m-4 text-black">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/Logo.svg" // Path to the logo SVG file in the public directory
              alt="Flowbite Logo"
              width={75} // Adjust the width as needed
              height={75} // Adjust the height as needed
            />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm  sm:text-center ">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Tuitioni
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </div>
  );
}
