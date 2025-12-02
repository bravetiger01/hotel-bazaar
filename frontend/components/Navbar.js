'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle token from URL after Google OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean the URL by removing the token, then dispatch authchange
      window.history.replaceState({}, document.title, window.location.pathname);
      window.dispatchEvent(new Event("authchange"));
    }
  }, []);

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
      className="h-20 sm:h-24 px-4 sm:px-6 sticky top-0 z-50 border-b border-white/10"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center h-full w-full relative">
        {/* Logo - left aligned */}
        <motion.a
          href="/"
          className="flex items-center mr-4 sm:mr-8 z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Image src="/logo.png" alt="Hotel Bazaar Logo" width={60} height={60} className="rounded-lg sm:w-[80px] sm:h-[80px]" />
        </motion.a>

        {/* Search Bar - perfectly centered (desktop only) */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right side icons - right aligned (desktop only) */}
        <div className="hidden md:flex items-center space-x-4 ml-auto z-10">
          {loading ? null : user ? (
            <>
              {user.role === 'admin' && (
                <a href="/admin/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">
                  Admin
                </a>
              )}
              <motion.a 
                href="/profile" 
                className="text-gray-300 hover:text-blue-400 transition-colors" 
                title="Profile"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/cart"
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-blue-400 transition-colors" />
                <AnimatePresence>
                  {getItemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                    >
                      {getItemCount()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
              <a onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 cursor-pointer transition-colors">Logout</a>
            </>
          ) : (
            <>
              <a href="/login" className="border-2 border-blue-500 text-blue-400 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-blue-500 hover:text-white">
                Login
              </a>
              <a href="/signup" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50">
                Signup
              </a>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden ml-auto z-10">
          <motion.a
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-blue-400 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.a>
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
                className="absolute top-20 sm:top-24 left-0 w-full border-b border-white/10 shadow-2xl z-40"
                style={{
                  background: 'rgba(0, 0, 0, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
              
              {/* Nav Links (mobile) */}
              <div className="flex flex-col space-y-4 px-6 py-4">
                {loading ? null : user ? (
                  <>
                  {/* Search Bar (mobile) */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
                    {user.role === 'admin' && (
                      <a href="/admin/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors text-base font-medium" onClick={() => setIsOpen(false)}>
                        Admin
                      </a>
                    )}
                    <a href="/profile" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center" title="Profile" onClick={() => setIsOpen(false)}>
                      <User className="w-5 h-5 mr-2" /> Profile
                    </a>
                    <a href="/cart" className="relative flex items-center text-gray-300 hover:text-blue-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Cart
                      {getItemCount() > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {getItemCount()}
                        </span>
                      )}
                    </a>
                    <a onClick={() => { handleLogout(); setIsOpen(false); }} className="text-gray-400 hover:text-red-400 text-base text-left cursor-pointer transition-colors">Logout</a>
                  </>
                ) : (
                  <>
                    {/* Search Bar (mobile) */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
                    <a href="/login" className="text-blue-400 border-2 border-blue-500 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 hover:bg-blue-500 hover:text-white text-center" onClick={() => setIsOpen(false)}>
                      Login
                    </a>
                    <a href="/signup" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 text-center" onClick={() => setIsOpen(false)}>
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