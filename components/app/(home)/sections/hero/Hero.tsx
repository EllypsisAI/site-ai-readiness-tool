'use client';

import { motion } from 'framer-motion';
import HomeHeroBadge from './Badge/Badge';
import HomeHeroTitle from './Title/Title';

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-background-primary" id="home-hero">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary to-background-primary"></div>

      {/* Content */}
      <div className="relative pt-32 lg:pt-40 pb-20 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <HomeHeroBadge />
          <HomeHeroTitle />
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-primary to-transparent pointer-events-none"></div>
    </section>
  );
}
