'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'General Manager',
    company: 'Grand Plaza Hotel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    text: 'Hotel Bazaar has transformed our housekeeping operations. The quality of their cleaning supplies is exceptional, and our guests have noticed the difference. Highly recommended!',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Housekeeping Director',
    company: 'Luxury Suites International',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    text: 'We switched to Hotel Bazaar six months ago and haven\'t looked back. Their products are eco-friendly, effective, and the customer service is outstanding. A true partner in hospitality.',
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Operations Head',
    company: 'Coastal Resort & Spa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    text: 'The range of products available is impressive. From bathroom cleaners to guest amenities, everything we need is in one place. Delivery is always on time, and the pricing is competitive.',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    role: 'Procurement Manager',
    company: 'Metropolitan Hotels',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    text: 'Hotel Bazaar understands the hospitality industry. Their products meet our high standards, and their team is always ready to help with custom orders. Excellent service all around!',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'Hotel Owner',
    company: 'Heritage Inn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    text: 'Quality products at reasonable prices. The glass cleaners leave no streaks, and the bathroom supplies keep our facilities spotless. Our staff loves working with these products.',
  },
  {
    id: 6,
    name: 'Ananya Desai',
    role: 'Executive Housekeeper',
    company: 'Skyline Business Hotel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    text: 'Professional-grade products that deliver results. Hotel Bazaar has become our go-to supplier for all cleaning and guest amenity needs. The consistency in quality is remarkable.',
  },
];

export default function Testimonials() {
  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Trusted by hotels across the country for premium quality supplies
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -50 * testimonials.length + '%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-[90vw] sm:w-[450px] md:w-[500px]"
                >
                  <div className="glass-card p-6 md:p-8 h-full blue-glow-hover transition-all duration-300">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                      &quot;{testimonial.text}&quot;
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-500/50 flex-shrink-0">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg gradient-text">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlays for fade effect */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
