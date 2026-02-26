import React from 'react';

import Contact from './components/Contact';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Tuitioni team. We are here to help with your tutoring needs.',
};

export default function page() {
  return (
    <div>
      <Contact />
    </div>
  );
}
