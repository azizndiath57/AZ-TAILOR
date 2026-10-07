"use client";

import React from "react";
import { motion } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInUp({
  children,
  className = "",
  delay = 0,
}: FadeInUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay: delay / 1000, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
