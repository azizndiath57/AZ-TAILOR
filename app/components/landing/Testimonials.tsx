import React from "react";
import FadeInUp from "./FadeInUp";
import styles from "../../landing.module.css";
import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("Landing.Testimonials");

  const testimonials = [
    {
      name: "Modou",
      role: t('roles.tailor'),
      content: t('modou'),
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Khadija",
      role: t('roles.designer'),
      content: t('khadija'),
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Bassirou",
      role: t('roles.manager'),
      content: t('bassirou'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="py-24 bg-surface-container-low" id="temoignages">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">
              {t('title')}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('subtitle')}
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <FadeInUp key={index} delay={(index + 1) * 100} className={`bg-surface p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col ${styles.hoverLift}`}>
              <div className="flex items-center gap-4 mb-6">
                <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-label-lg text-label-lg font-bold text-primary">{testimonial.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-body-md text-on-surface italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="mt-6 flex text-secondary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined text-sm">star</span>
                ))}
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
