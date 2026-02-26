import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Tutors',
  description:
    'Browse qualified tutors on Tuitioni and find the perfect match for your learning needs.',
};

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
