'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Product Images Row with Parallax Effect */}
      <div className="relative flex w-full h-screen z-10">
        {[
          { src: '/product1.png', alt: 'Glass Cleaner', delay: 0 },
          { src: '/product2.png', alt: 'Toilet Cleaner', delay: 0.1 },
          { src: '/product3.png', alt: 'Shampoo', delay: 0.2 },
        ].map((product, index) => (
          <motion.div
            key={index}
            className="relative flex-1 h-screen"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: product.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={product.src}
              alt={product.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 pointer-events-none z-10" />
          </motion.div>
        ))}
      </div>

      {/* Hero Content - centered */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Premium Hotel Supplies
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Quality products for hospitality excellence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/products">
              <motion.button
                className="relative bg-gradient-to-r from-lavender to-purple-600 text-white px-10 py-4 text-lg font-bold shadow-2xl rounded-xl overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(181, 126, 220, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  SHOP NOW
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-lavender"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <ChevronDown className="w-8 h-8 text-white/70" />
        </motion.div>
      </div>
    </section>
  );
}