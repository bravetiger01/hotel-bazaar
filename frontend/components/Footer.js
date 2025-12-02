'use client';

import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const socialIcons = [
    { Icon: Facebook, href: '#' },
    { Icon: Twitter, href: '#' },
    { Icon: Instagram, href: '#' },
    { Icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-black text-white py-16 relative overflow-hidden border-t border-white/10">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Link href="/">
                <Image src="/logo.png" alt="Hotel Bazaar Logo" width={32} height={32} className="mr-2 rounded" />
              </Link>
              <span className="text-xl font-bold">HOTEL BAZAAR</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for premium hotel cleaning supplies and hospitality solutions.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialIcons.map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300 blue-glow-hover"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white gradient-text">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="/about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">Products</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link href="/support" className="hover:text-blue-400 transition-colors">Support Page</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-blue-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-blue-400 transition-colors">Terms & Condition</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white gradient-text">Categories</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/products?category=Bathroom%20Cleaners" className="hover:text-blue-400 transition-colors">
                  Bathroom Cleaners
                </Link>
              </li>
              <li>
                <Link href="/products?category=Glass%20%26%20Surface" className="hover:text-blue-400 transition-colors">
                  Glass & Surface
                </Link>
              </li>
              <li>
                <Link href="/products?category=Personal%20Care" className="hover:text-blue-400 transition-colors">
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-4 text-white gradient-text">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span>+91 9227008742, +91 9227448742</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span>hotelbazar2025@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-sm leading-relaxed">
                  Simfnity Enterprises, 104 Sunrise Apartment, Near Wikalp Hospital, Chhani Road.
                  Vadodara, Gujarat India 390024
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <motion.div 
          className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="flex items-center justify-center gap-2">
            &copy; {new Date().getFullYear()} Simfnity Enterprise. All rights reserved.
            <span className="text-blue-400">•</span>
            Made with <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-red-500"
            >♥</motion.span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}