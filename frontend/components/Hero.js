// hero.js
"use client";

export default function Hero() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-8">Welcome!</h1>

      {/* This is the magic line */}
      <a
        href="/products"
        className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        Shop Now
      </a>
    </div>
  );
}