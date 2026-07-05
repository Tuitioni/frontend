import { Plus_Jakarta_Sans, Sora, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

import type { Metadata, Viewport } from 'next';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Tuitioni - Find Your Perfect Tutor',
    template: '%s | Tuitioni',
  },
  description:
    'Tuitioni connects students with qualified tutors in Bangladesh. Find the perfect tutor for your learning needs.',
  keywords: ['tutor', 'tutoring', 'education', 'Bangladesh', 'online learning'],
  authors: [{ name: 'Tuitioni' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Tuitioni',
    title: 'Tuitioni - Find Your Perfect Tutor',
    description: 'Connect with qualified tutors in Bangladesh.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tuitioni - Find Your Perfect Tutor',
    description: 'Connect with qualified tutors in Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#5A4FE4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:shadow-lg"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
