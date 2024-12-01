import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-bluishGrey rounded-lg shadow m-4 text-black">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/home"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/Logo.svg" // Path to the logo SVG file in the public directory
              alt="Flowbite Logo"
              width={75} // Adjust the width as needed
              height={75} // Adjust the height as needed
            />
          </Link>
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
        <div className="flex justify-center space-x-6 mb-4">
          {/* Social Media Links */}
          <Link
            href="https://www.facebook.com"
            target="_blank"
            className="text-xl hover:text-blue-600"
          >
            <FaFacebook />
          </Link>
          <Link
            href="https://www.youtube.com"
            target="_blank"
            className="text-xl hover:text-red-600"
          >
            <FaYoutube />
          </Link>
          <Link
            href="https://www.tiktok.com"
            target="_blank"
            className="text-xl hover:text-black"
          >
            <FaTiktok />
          </Link>
        </div>
        <span className="block text-sm sm:text-center">
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
