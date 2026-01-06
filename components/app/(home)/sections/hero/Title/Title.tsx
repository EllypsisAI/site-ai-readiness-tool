'use client';

import { motion } from 'framer-motion';

export default function HomeHeroTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-4xl mx-auto text-center mb-8 lg:mb-12"
    >
      <h1 className="font-mono text-4xl lg:text-6xl font-bold text-foreground-primary mb-6 leading-tight">
        Can AI agents find{' '}
        <br className="hidden lg:block" />
        your website?
      </h1>

      <p className="text-lg lg:text-xl text-foreground-secondary font-sans max-w-2xl mx-auto leading-relaxed">
        Most websites are invisible to AI crawlers.{' '}
        <br className="hidden lg:block" />
        Run a free diagnostic to find out where you stand—
        <br className="hidden lg:block" />
        and get a <span className="text-accent-amber font-medium">battle plan</span> to fix it.
      </p>
    </motion.div>
  );
}
