"use client";

import React, { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./FadeInUp";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

const format = (n: number) => Math.round(n).toLocaleString("fr-FR");

export default function CountUp({ value, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
