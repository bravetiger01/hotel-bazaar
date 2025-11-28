import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Product Images Row */}
      <div className="relative flex w-full h-screen z-10">
        <div className="relative flex-1 h-screen">
          <Image
            src="/product1.png"
            alt="Glass Cleaner"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
        </div>
        <div className="relative flex-1 h-screen">
          <Image
            src="/product2.png"
            alt="Toilet Cleaner"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
        </div>
        <div className="relative flex-1 h-screen">
          <Image
            src="/product3.png"
            alt="Shampoo"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
        </div>
      </div>
      {/* Shop Now Button - centered over the middle product */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <Link href="/products">
          <button
            className="bg-transparent border-2 border-white text-white px-8 py-3 text-lg font-bold shadow-lg transition-all duration-300 rounded-lg
            hover:-translate-y-2 hover:shadow-2xl hover:bg-white/10 hover:text-white focus:outline-none"
          >
            SHOP NOW
          </button>
        </Link>
      </div>
    </section>
  );
}