"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import FadeInUp, { EASE_OUT } from "./FadeInUp";
import styles from "../../landing.module.css";
import { useTranslations } from "next-intl";

const card: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: index * 0.14, ease: EASE_OUT, staggerChildren: 0.08, delayChildren: 0.4 + index * 0.14 },
  }),
};
const star: Variants = {
  hidden: { scale: 0, rotate: -90, opacity: 0 },
  show: { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 12 } },
};

export default function Testimonials() {
  const t = useTranslations("Landing.Testimonials");

  const testimonials = [
    {
      name: "Modou",
      role: t('roles.tailor'),
      content: t('modou'),
      image: "/images/modou.jpg",
    },
    {
      name: "Khadija",
      role: t('roles.designer'),
      content: t('khadija'),
      image: "/images/khadija.jpg",
    },
    {
      name: "Bassirou",
      role: t('roles.manager'),
      content: t('bassirou'),
      image: "/images/bassirou.jpg",
    },
  ];

  return (
    <section className="py-24 bg-surface-container-low" id="temoignages">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md text-3xl md:text-4xl font-bold tracking-tight leading-tight text-primary mb-4">
              {t('title')}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('subtitle')}
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`bg-surface p-8 rounded-2xl border border-outline-variant/30 flex flex-col ${styles.hoverLift}`}
              variants={card}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-label-lg text-label-lg font-bold text-primary">{testimonial.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-body-md text-on-surface italic">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
              <div className="mt-6 flex text-secondary">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <motion.span key={starIndex} variants={star} className="material-symbols-outlined text-sm">star</motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
