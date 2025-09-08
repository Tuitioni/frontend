import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";

// Separate components for better organization
const Logo = () => (
  <Link
    href="/"
    className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
  >
    <Image
      src="/Logo.svg"
      alt="Tuitioni Logo"
      width={75}
      height={75}
      className="transition-transform hover:scale-105"
    />
  </Link>
);

const FooterLinks = () => {
  const links = [
    { text: "About", href: "/about" },
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Licensing", href: "/licensing" },
    { text: "Contact", href: "/contact" },
  ];

  return (
    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className="hover:underline me-4 md:me-6 transition-colors hover:text-gray-700"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const SocialLinks = () => {
  const socialLinks = [
    {
      Icon: FaFacebook,
      href: "https://www.facebook.com",
      hoverColor: "hover:text-blue-600",
    },
    {
      Icon: FaYoutube,
      href: "https://www.youtube.com",
      hoverColor: "hover:text-red-600",
    },
    {
      Icon: FaTiktok,
      href: "https://www.tiktok.com",
      hoverColor: "hover:text-black",
    },
  ];

  return (
    <div className="flex justify-center space-x-6 mb-4">
      {socialLinks.map((social, index) => (
        <Link
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-2xl transition-colors ${social.hoverColor}`}
        >
          <social.Icon />
        </Link>
      ))}
    </div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bluishGrey rounded-lg shadow-lg m-4 text-black">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <FooterLinks />
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <SocialLinks />

        <span className="block text-sm text-center">
          © {currentYear}{" "}
          <Link
            href="/"
            className="hover:underline transition-colors hover:text-gray-700"
          >
            Tuitioni
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
