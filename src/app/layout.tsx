import { DM_Mono, Inter, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';

import type { Metadata } from 'next';

import { AuthProvider } from '@/contexts/auth-context';
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const dmSans = localFont({
  src: [
    {
      path: '../../fonts/dm-sans/DMSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/dm-sans/DMSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../fonts/dm-sans/DMSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/dm-sans/DMSans-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../fonts/dm-sans/DMSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/dm-sans/DMSans-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../fonts/dm-sans/DMSans-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Xano AI Developer - Your AI backend developer',
    template: '%s | Xano AI Developer',
  },
  description:
    'Like having your own AI Xano developer. Build APIs, manage databases, create workflows, and deploy instantly — all through natural conversation with any AI.',
  keywords: [
    'Xano',
    'AI Developer',
    'No-code Backend',
    'API Builder',
    'Backend Automation',
    'MCP',
    'Claude',
    'ChatGPT',
  ],
  authors: [{ name: 'Xano AI Developer Team' }],
  creator: 'Xano AI Developer Team',
  publisher: 'Xano AI Developer',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${dmSans.variable} ${dmMono.variable} ${inter.variable} ${playfair.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
