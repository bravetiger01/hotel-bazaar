'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Droplets, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { getCategoryCounts } from '@/utils/api';
import ScrollReveal from './ScrollReveal';
import StaggerContainer, { StaggerItem } from './StaggerContainer';

const CATEGORY_META = [
  {
    icon: Droplets,
    title: "Bathroom Cleaners",
    description: "Professional toilet cleaners, sanitizers, and bathroom supplies",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Sparkles,
    title: "Glass & Surface",
    description: "Crystal clear glass cleaners and multi-surface solutions",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Heart,
    title: "Personal Care",
    description: "Premium shampoos, soaps, and guest amenities Solutions",
    gradient: "from-rose-500 to-red-500"
  },
];

export default function ProductCategories() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = await getCategoryCounts();
      setCounts(counts);
    };
    fetchCounts();
  }, []);

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <ScrollReveal className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Product Categories
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Comprehensive cleaning solutions for every area of your hotel
          </motion.p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORY_META.map((category, index) => {
            const Icon = category.icon;
            return (
              <StaggerItem key={category.title}>
                <Link href={`/products?category=${encodeURIComponent(category.title)}`}>
                  <motion.div
                    className="group relative glass-card p-8 text-center overflow-hidden blue-glow-hover transition-all duration-300"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Icon with gradient background */}
                    <motion.div 
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.gradient} mb-6 relative z-10`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors relative z-10">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed relative z-10">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-blue-400 font-semibold text-sm relative z-10">
                      <span>
                        {counts[category.title] ? `${counts[category.title]} Product${counts[category.title] > 1 ? 's' : ''}` : '0 Products'}
                      </span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}