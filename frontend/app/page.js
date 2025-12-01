"use client";

import Hero from '@/components/Hero';
import ProductCategories from '@/components/ProductCategories';
import ClearanceSale from '@/components/ClearanceSale';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <ProductCategories />
      <ClearanceSale />
    </div>
  );
}
