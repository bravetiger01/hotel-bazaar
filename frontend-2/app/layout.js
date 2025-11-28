

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import CartProvider from '@/hooks/useCart';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hotel Bazaar',
  description: 'Your destination for premium hotel products',
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}