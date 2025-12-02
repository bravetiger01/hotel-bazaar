'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Product Images Row with Parallax */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        <motion.div
          className="pointer-events-auto max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-blue-500/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">Premium Quality Supplies</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Premium Hotel Supplies
            <br />
            <span className="gradient-text">For Excellence</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 drop-shadow-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Quality products for hospitality excellence. Trusted by hotels nationwide.
          </motion.p>

          {/* CTA Button */}
          <motion.a
            href="/products"
            className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-full overflow-hidden group blue-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              SHOP NOW
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-6 h-6 text-blue-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}