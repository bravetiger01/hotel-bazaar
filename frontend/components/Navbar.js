'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper to get cookie value
  function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Handle token from URL after Google OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean the URL by removing the token, then dispatch authchange
      router.replace(window.location.pathname);
      window.dispatchEvent(new Event("authchange"));
    }
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        localStorage.removeItem('userId');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/auth-supabase/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        // Store userId for cart management
        if (userData.id) {
          localStorage.setItem('userId', userData.id);
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
    window.addEventListener("authchange", checkAuth);
    return () => window.removeEventListener("authchange", checkAuth);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    window.dispatchEvent(new Event("authchange"));
    window.location.href = '/';
  };



  return (
    <motion.nav 
      className="bg-white/95 backdrop-blur-md shadow-sm h-24 px-6 sticky top-0 z-50 border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center h-full w-full relative">
        {/* Logo - left aligned */}
        <Link href="/" className="flex items-center mr-8 z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Image src="/logo.png" alt="Hotel Bazaar Logo" width={80} height={80} className="rounded-lg" />
          </motion.div>
        </Link>

        {/* Search Bar - perfectly centered (desktop only) */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side icons - right aligned (desktop only) */}
        <div className="hidden md:flex items-center space-x-5 ml-auto z-10">
          {loading ? null : user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-lavender transition-colors text-xs font-medium">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-gray-600 hover:text-lavender transition-colors" title="Profile">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="relative">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-lavender transition-colors" />
                  <AnimatePresence>
                    {getItemCount() > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                      >
                        {getItemCount()}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
              <a onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-500 ml-2 cursor-pointer">Logout</a>
            </>
          ) : (
            <>
              <a href="/login" className="border-2 border-darkblue text-darkblue px-6 py-2 rounded-lg shadow-md text-base font-semibold transition-all duration-200 hover:bg-darkblue hover:text-white hover:border-darkblue focus:outline-none">
                Login
              </a>
              <a href="/signup" className="ml-3 bg-darkblue text-white px-6 py-2 rounded-lg shadow-md text-base font-semibold border-2 border-darkblue transition-all duration-200 hover:bg-white hover:text-darkblue hover:border-darkblue focus:outline-none">
                Signup
              </a>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden ml-auto z-10">
          <a
            onClick={() => setIsOpen(!isOpen)}
            className="text-darkblue hover:text-lavender cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </a>
        </div>

        {/* Slide-down mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-30 z-30"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-24 left-0 w-full bg-white shadow-lg z-40"
              >
              
              {/* Nav Links (mobile) */}
              <div className="flex flex-col space-y-4 px-6 py-4">
                {loading ? null : user ? (
                  <>
                  {/* Search Bar (mobile) */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-8 pr-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                  />
                </div>
              </div>
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard" className="text-gray-600 hover:text-lavender transition-colors text-base font-medium" onClick={() => setIsOpen(false)}>
                        Admin
                      </Link>
                    )}
                    <Link href="/profile" className="text-gray-600 hover:text-lavender transition-colors flex items-center" title="Profile" onClick={() => setIsOpen(false)}>
                      <User className="w-5 h-5 mr-2" /> Profile
                    </Link>
                    <Link href="/cart" className="relative flex items-center" onClick={() => setIsOpen(false)}>
                      <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-lavender transition-colors mr-2" />
                      Cart
                      {getItemCount() > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                          {getItemCount()}
                        </span>
                      )}
                    </Link>
                    <a onClick={() => { handleLogout(); setIsOpen(false); }} className="text-gray-500 hover:text-red-500 text-base text-left cursor-pointer">Logout</a>
                  </>
                ) : (
                  <>
                    {/* Search Bar (mobile) */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-8 pr-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                  />
                </div>
              </div>
                    <a href="/login" className="text-darkblue border-2 border-darkblue px-6 py-2 rounded-lg shadow-md text-base font-semibold transition-all duration-200 hover:bg-darkblue hover:text-white hover:border-darkblue focus:outline-none text-center" onClick={() => setIsOpen(false)}>
                      Login
                    </a>
                    <a href="/signup" className="bg-darkblue text-white px-6 py-2 rounded-lg shadow-md text-base font-semibold border-2 border-darkblue transition-all duration-200 hover:bg-white hover:text-darkblue hover:border-darkblue focus:outline-none text-center" onClick={() => setIsOpen(false)}>
                      Signup
                    </a>
                  </>
                )}
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    
  );
}