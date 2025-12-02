'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube,
  Chrome,
  Figma,
  Slack
} from 'lucide-react';

const partners = [
  // Inner orbit
  { Icon: Github, name: 'GitHub', orbit: 1, delay: 0 },
  { Icon: Twitter, name: 'Twitter', orbit: 1, delay: 2 },
  { Icon: Linkedin, name: 'LinkedIn', orbit: 1, delay: 4 },
  { Icon: Facebook, name: 'Facebook', orbit: 1, delay: 6 },
  
  // Middle orbit
  { Icon: Instagram, name: 'Instagram', orbit: 2, delay: 1 },
  { Icon: Youtube, name: 'YouTube', orbit: 2, delay: 3 },
  { Icon: Chrome, name: 'Chrome', orbit: 2, delay: 5 },
  { Icon: Figma, name: 'Figma', orbit: 2, delay: 7 },
  
  // Outer orbit
  { Icon: Slack, name: 'Slack', orbit: 3, delay: 0.5 },
  { Icon: Github, name: 'Partner 1', orbit: 3, delay: 2.5 },
  { Icon: Twitter, name: 'Partner 2', orbit: 3, delay: 4.5 },
  { Icon: Linkedin, name: 'Partner 3', orbit: 3, delay: 6.5 },
];

const orbitSizes = {
  1: { radius: 120, duration: 20 },
  2: { radius: 200, duration: 30 },
  3: { radius: 280, duration: 40 },
};

export default function PartnersOrbit() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Technology Partners
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powered by industry-leading platforms and tools
          </p>
        </motion.div>

        {/* Desktop Orbit View */}
        <div className="hidden md:block">
          <div className="relative w-full max-w-3xl mx-auto aspect-square">
            {/* Center Logo */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-card flex items-center justify-center blue-glow">
                <Image
                  src="/logo.png"
                  alt="Hotel Bazaar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
            </motion.div>

            {/* Orbit Circles */}
            {[1, 2, 3].map((orbit) => (
              <motion.div
                key={orbit}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20"
                style={{
                  width: orbitSizes[orbit].radius * 2,
                  height: orbitSizes[orbit].radius * 2,
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: orbit * 0.1 }}
              />
            ))}

            {/* Partner Icons */}
            {partners.map((partner, index) => {
              const { Icon } = partner;
              const { radius, duration } = orbitSizes[partner.orbit];
              
              // Calculate starting angle for even distribution
              const partnersInOrbit = partners.filter(p => p.orbit === partner.orbit);
              const indexInOrbit = partnersInOrbit.indexOf(partner);
              const startAngle = (360 / partnersInOrbit.length) * indexInOrbit;

              return (
                <motion.div
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: radius * 2,
                    height: radius * 2,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    style={{
                      transformOrigin: `center ${radius}px`,
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    initial={{
                      rotate: startAngle,
                    }}
                  >
                    <motion.div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full glass-card flex items-center justify-center blue-glow-hover transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        rotate: {
                          duration: duration,
                          repeat: Infinity,
                          ease: 'linear',
                        },
                      }}
                      initial={{
                        rotate: -startAngle,
                      }}
                    >
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              {/* Center Logo */}
              <motion.div
                className="flex-shrink-0"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center blue-glow">
                  <Image
                    src="/logo.png"
                    alt="Hotel Bazaar"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
              </motion.div>

              {/* Partner Icons */}
              {partners.map((partner, index) => {
                const { Icon } = partner;
                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center blue-glow-hover transition-all duration-300">
                      <Icon className="w-7 h-7 text-blue-500" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
