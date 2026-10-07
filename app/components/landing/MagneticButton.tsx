"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import styles from "../../landing.module.css";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

const SPRING = { stiffness: 220, damping: 14, mass: 0.4 };

export default function MagneticButton({
  children,
  href,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    const position = buttonRef.current.getBoundingClientRect();
    x.set((e.clientX - position.left - position.width / 2) * 0.3);
    y.set((e.clientY - position.top - position.height / 2) * 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const innerContent = (
    <motion.span
      className="inline-block"
      style={{ x, y }}
      animate={{ scale: isHovered ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      {children}
    </motion.span>
  );

  const combinedClassName = `${styles.magneticBtn} ${className} active:scale-95 transition-transform duration-150`;

  if (href) {
    return (
      <Link
        href={href}
        ref={buttonRef}
        className={combinedClassName}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={combinedClassName}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {innerContent}
    </button>
  );
}
