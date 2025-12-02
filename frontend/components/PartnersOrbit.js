"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Chrome,
  Figma,
  Slack,
} from "lucide-react";

const partners = [
  // Inner orbit (4 items)
  { Icon: Github, name: "GitHub", orbit: 1 },
  { Icon: Twitter, name: "Twitter", orbit: 1 },
  { Icon: Linkedin, name: "LinkedIn", orbit: 1 },
  { Icon: Facebook, name: "Facebook", orbit: 1 },

  // Middle orbit (4 items)
  { Icon: Instagram, name: "Instagram", orbit: 2 },
  { Icon: Youtube, name: "YouTube", orbit: 2 },
  { Icon: Chrome, name: "Chrome", orbit: 2 },
  { Icon: Figma, name: "Figma", orbit: 2 },

  // Outer orbit (4 items)
  { Icon: Slack, name: "Slack", orbit: 3 },
  { Icon: Github, name: "Partner 1", orbit: 3 },
  { Icon: Twitter, name: "Partner 2", orbit: 3 },
  { Icon: Linkedin, name: "Partner 3", orbit: 3 },
];

const orbitConfig = {
  1: { radius: 120, duration: 20 },
  2: { radius: 200, duration: 30 },
  3: { radius: 280, duration: 40 },
};

const partnersByOrbit = partners.reduce((acc, partner) => {
  if (!acc[partner.orbit]) acc[partner.orbit] = [];
  acc[partner.orbit].push(partner);
  return acc;
}, {});

export default function PartnersOrbit() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Header */}
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

        {/* Desktop Orbit */}
        <div className="hidden md:block">
          <div className="relative w-full max-w-4xl mx-auto aspect-square">

            {/* Center Logo (Fixed) */}
            <motion.div
              className="absolute z-20"
              style={{
                top: "44%",
                left: "43%",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="w-32 h-32 rounded-full glass-card flex items-center justify-center blue-glow">
                <Image
                  src="/logo.png"
                  alt="Hotel Bazaar"
                  width={90}
                  height={90}
                  className="rounded-full"
                />
              </div>
            </motion.div>

            {/* Orbit Rings */}
            {[1, 2, 3].map((orbit) => {
              const { radius } = orbitConfig[orbit];
              return (
                <div
                  key={orbit}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20"
                  style={{ width: radius * 2, height: radius * 2 }}
                />
              );
            })}

            {/* Rotating Orbits */}
            {Object.keys(partnersByOrbit).map((orbitKey) => {
              const orbit = parseInt(orbitKey);
              const items = partnersByOrbit[orbit];
              const { radius, duration } = orbitConfig[orbit];
              const angleStep = 360 / items.length;

              return (
                <div
                  key={`orbit-${orbit}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: radius * 2,
                    height: radius * 2,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full"
                  >
                    {items.map((partner, index) => {
                      const angle = angleStep * index;
                      const x = radius * Math.cos((angle * Math.PI) / 180);
                      const y = radius * Math.sin((angle * Math.PI) / 180);

                      return (
                        <div
                          key={`${partner.name}-${index}`}
                          className="absolute"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                          }}
                        >
                          <motion.div
                            className="w-16 h-16 rounded-full glass-card flex items-center justify-center blue-glow-hover cursor-pointer shadow-lg"
                            whileHover={{ scale: 1.3 }}
                            animate={{ rotate: -360 }}
                            transition={{
                              duration,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <partner.Icon className="w-8 h-8 text-blue-400" />
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Orbit */}
        <div className="md:hidden">
          <div className="relative mx-auto w-full max-w-sm aspect-square">

            {/* Center Logo */}
            <motion.div
              className="absolute z-20 "
              style={{
                top: "44%",
                left: "43%",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="w-18 h-18 rounded-full glass-card flex items-center justify-center blue-glow">
                <Image
                  src="/logo.png"
                  alt="Hotel Bazaar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </motion.div>

            {/* Orbit Rings (Scaled for mobile) */}
            {[1, 2, 3].map((orbit) => {
              const radius = orbitConfig[orbit].radius * 0.55; // 55% scale
              return (
                <div
                  key={`m-orbit-${orbit}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20"
                  style={{ width: radius * 2, height: radius * 2 }}
                />
              );
            })}

            {/* Rotating Orbits (Mobile) */}
            {Object.keys(partnersByOrbit).map((orbitKey) => {
              const orbit = parseInt(orbitKey);
              const items = partnersByOrbit[orbit];
              const { radius, duration } = orbitConfig[orbit];
              const mobileRadius = radius * 0.55; // scale down
              const angleStep = 360 / items.length;

              return (
                <div
                  key={`m-orbit-rot-${orbit}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: mobileRadius * 2,
                    height: mobileRadius * 2,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full"
                  >
                    {items.map((partner, index) => {
                      const angle = angleStep * index;
                      const x = mobileRadius * Math.cos((angle * Math.PI) / 180);
                      const y = mobileRadius * Math.sin((angle * Math.PI) / 180);

                      return (
                        <div
                          key={`m-${partner.name}-${index}`}
                          className="absolute"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                          }}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-full glass-card flex items-center justify-center blue-glow-hover cursor-pointer shadow-lg"
                            whileHover={{ scale: 1.2 }}
                            animate={{ rotate: -360 }}
                            transition={{
                              duration,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <partner.Icon className="w-6 h-6 text-blue-400" />
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}

          </div>
        </div>


      </div>
    </section>
  );
}
