import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teaching Jobs',
  description: 'Browse teaching and tutoring job opportunities on Tuitioni.',
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
