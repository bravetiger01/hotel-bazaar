import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Droplets, Sparkles, Heart, Shield } from 'lucide-react';
import {getCategoryCounts } from '@/utils/api';

const CATEGORY_META = [
  {
    icon: <Droplets className="w-12 h-12 text-lavender" />, title: "Bathroom Cleaners",
    description: "Professional toilet cleaners, sanitizers, and bathroom supplies"
  },
  {
    icon: <Sparkles className="w-12 h-12 text-lavender" />, title: "Glass & Surface",
    description: "Crystal clear glass cleaners and multi-surface solutions"
  },
  {
    icon: <Heart className="w-12 h-12 text-lavender" />, title: "Personal Care",
    description: "Premium shampoos, soaps, and guest amenities Solutions"
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
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-darkblue mb-4">Product Categories</h2>
          <p className="text-gray-600 text-lg">Comprehensive cleaning solutions for every area of your hotel</p>
        </div>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Comprehensive cleaning solutions for every area of your hotel
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {CATEGORY_META.map((category, index) => (
            <Link
              key={category.title}
              href={`/products?category=${encodeURIComponent(category.title)}`}
              className="bg-purple-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300 block"
            >
              <div className="flex justify-center mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-darkblue mb-3">{category.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{category.description}</p>
              <p className="text-lavender font-semibold text-sm">
                {counts[category.title] ? `${counts[category.title]} Product${counts[category.title] > 1 ? 's' : ''}` : '0 Products'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}