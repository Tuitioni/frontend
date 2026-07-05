import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';

const Brand = () => (
  <Link href="/" className="flex items-center gap-3">
    <Image
      src="/Logo.svg"
      alt="Tuitioni Logo"
      width={64}
      height={64}
      className="transition-transform hover:scale-105"
    />
  </Link>
);

const FooterLinks = () => {
  const links = [
    { text: 'About', href: '/aboutUs' },
    { text: 'Find Tutors', href: '/tutors' },
    { text: 'Jobs', href: '/jobs' },
    { text: 'Contact', href: '/contact' },
  ];

  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="transition-colors hover:text-primary">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const SocialLinks = () => {
  const socialLinks = [
    { Icon: FaFacebook, href: 'https://www.facebook.com', label: 'Facebook' },
    { Icon: FaYoutube, href: 'https://www.youtube.com', label: 'YouTube' },
    { Icon: FaTiktok, href: 'https://www.tiktok.com', label: 'TikTok' },
  ];

  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social) => (
        <Link
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft-sm transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-soft"
        >
          <social.Icon className="text-lg" />
        </Link>
      ))}
    </div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-4">
            <Brand />
            <p className="text-sm text-muted-foreground">
              Learning, connected. Tuitioni matches students with verified tutors across Bangladesh
              — transparent pricing, trusted teachers, effortless booking.
            </p>
          </div>
          <div className="flex flex-col gap-6 sm:items-end">
            <FooterLinks />
            <SocialLinks />
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <span>
            © {currentYear}{' '}
            <Link
              href="/"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              Tuitioni
            </Link>
            . All rights reserved.
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground/70">
            Learning, Connected.
          </span>
        </div>
      </div>
    </footer>
  );
}
