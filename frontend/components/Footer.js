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
    <footer className="bg-gradient-to-br from-darkblue via-slate-900 to-darkblue text-white py-16 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-lavender/5 to-transparent pointer-events-none" />
      
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
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-lavender transition-all duration-300"
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
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className=" text-gray-300 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li><br></br>
              <Link href="/products" ><li className="hover:text-white transition-colors">Products</li></Link> <br></br>
              {/* <li><a href="#" className="hover:text-white transition-colors">Categories</a></li> */}
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li><br></br>
              <li><Link href="/support" className="hover:text-white transition-colors">Support Page</Link></li><br></br>
              <li><Link href="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li><br></br>
              <li><Link href="/policy" className="hover:text-white transition-colors">Privacy Policy</Link></li><br></br>
              <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Condition</Link></li><br></br>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/products?category=Bathroom%20Cleaners" className="hover:text-white transition-colors">
                  Bathroom Cleaners
                </Link>
              </li><br></br>
              <li>
                <Link href="/products?category=Glass%20%26%20Surface" className="hover:text-white transition-colors">
                  Glass & Surface
                </Link>
              </li><br></br>
              <li>
                <Link href="/products?category=Personal%20Care" className="hover:text-white transition-colors">
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 9227008742, +91 9227448742</span>
              </li><br></br>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>hotelbazar2025@gmail.com</span>
              </li><br></br>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  Simfnity Enterprises, 104 Sunrise Apartment, Near Wikalp Hospital, Chhani Road.
                  Vadodara, Gujarat India 390024
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <motion.div 
          className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="flex items-center justify-center gap-2">
            &copy; {new Date().getFullYear()} Simfnity Enterprise. All rights reserved.
            <span className="text-lavender">•</span>
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