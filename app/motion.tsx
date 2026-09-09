'use client';

import { useEffect } from 'react';

/** A visual enhancement only: content stays visible before JS and without motion. */
export default function Motion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    const cancel = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };

    const observe = () => {
      cancel();
      if (
        preference.matches ||
        !('IntersectionObserver' in window) ||
        !Element.prototype.animate
      )
        return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            observer?.unobserve(element);
            if (element.dataset.revealed) return;
            element.dataset.revealed = 'true';
            const animation = element.animate(
              [
                { opacity: 0.25, transform: 'translateY(14px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)' },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          });
        },
        { threshold: 0.08 },
      );
      document
        .querySelectorAll('[data-reveal]')
        .forEach((element) => observer?.observe(element));
    };

    observe();
    preference.addEventListener('change', observe);
    return () => {
      cancel();
      preference.removeEventListener('change', observe);
    };
  }, []);

  return null;
}
