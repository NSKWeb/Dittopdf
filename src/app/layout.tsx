import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Analytics } from '@/components/analytics';
import { SpeedInsights } from '@/components/speed-insights';
import { GoogleTagManager } from '@/components/google-tag-manager';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AdBanner } from '@/components/ads/ad-banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DittoPDF - Complete PDF Tool Suite',
    template: '%s | DittoPDF',
  },
  description: 'Comprehensive PDF tool suite with 16+ tools for merging, splitting, compressing, converting, and editing PDFs',
  keywords: ['PDF tools', 'PDF editor', 'merge PDF', 'split PDF', 'compress PDF', 'convert PDF'],
  authors: [{ name: 'DittoPDF', url: 'https://dittopdf.com' }],
  creator: 'DittoPDF',
  publisher: 'DittoPDF',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dittopdf.com',
    title: 'DittoPDF - Complete PDF Tool Suite',
    description: 'Comprehensive PDF tool suite with 16+ tools for merging, splitting, compressing, converting, and editing PDFs',
    siteName: 'DittoPDF',
    images: [
      {
        url: 'https://dittopdf.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DittoPDF - Complete PDF Tool Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DittoPDF - Complete PDF Tool Suite',
    description: 'Comprehensive PDF tool suite with 16+ tools for merging, splitting, compressing, converting, and editing PDFs',
    images: ['https://dittopdf.com/og-image.jpg'],
    creator: '@dittopdf',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dittopdf.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <Analytics />
        <SpeedInsights />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <AdBanner />
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}