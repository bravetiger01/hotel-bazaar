

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import CartProvider from '@/hooks/useCart';
import PageTransition from '@/components/PageTransition';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Hotel Bazaar - Premium Hotel Supplies',
  description: 'Your destination for premium hotel products and hospitality solutions',
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <CartProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
                <Navbar />
                <main className="flex-1">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}