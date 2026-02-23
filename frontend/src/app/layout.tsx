import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Gyan Sammaan | ज्ञान सम्मान — BPSC, UPSC & Govt Exam Preparation',
  description: 'Gyan Sammaan (ज्ञान सम्मान) — India\'s trusted online coaching platform for BPSC, UPSC, SSC, Railway & Banking exam preparation. Quality video courses, test series & free study material.',
  keywords: 'BPSC preparation, UPSC coaching, SSC exam, government exam, online coaching India, Gyan Sammaan, ज्ञान सम्मान',
  openGraph: {
    title: 'Gyan Sammaan | ज्ञान सम्मान',
    description: 'India\'s trusted platform for BPSC, UPSC & Government Exam Preparation',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
