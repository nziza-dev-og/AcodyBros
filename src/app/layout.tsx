
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { headers } from 'next/headers';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'AcodyBros Connect',
  description: 'We build your digital future.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('next-url') || "";
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${spaceGrotesk.variable} font-body antialiased`}>
        <div className="flex min-h-screen flex-col">
          {!isAdminRoute && <Header />}
          <main className={isAdminRoute ? 'w-full' : 'flex-grow'}>{children}</main>
          {!isAdminRoute && <Footer />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
