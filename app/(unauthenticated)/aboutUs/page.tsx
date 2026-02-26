import React from 'react';

import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Tuitioni and our mission to connect students with qualified tutors in Bangladesh.',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-7xl mx-auto px-4 py-6">
      <AboutUs />
      <FAQ />
    </div>
  );
}
