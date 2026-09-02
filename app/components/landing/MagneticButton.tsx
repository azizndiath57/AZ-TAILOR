"use client";

import React, { useRef, useState, MouseEvent } from "react";
import styles from "../../landing.module.css";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  href,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current || !spanRef.current) return;
    const position = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - position.left - position.width / 2;
    const y = e.clientY - position.top - position.height / 2;
    spanRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
  };

  const handleMouseOut = () => {
    setIsHovered(false);
    if (!spanRef.current) return;
    spanRef.current.style.transform = `translate(0px, 0px)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const innerContent = (
    <span
      ref={spanRef}
      className={`inline-block ${
        isHovered ? "scale-110" : "scale-100"
      } transition-transform duration-200`}
    >
      {children}
    </span>
  );

  const combinedClassName = `${styles.magneticBtn} ${className} active:scale-95 transition-transform duration-150`;

  if (href) {
    return (
      <Link
        href={href}
        ref={buttonRef}
        className={combinedClassName}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
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
      onMouseOut={handleMouseOut}
      onMouseEnter={handleMouseEnter}
    >
      {innerContent}
    </button>
  );
}
