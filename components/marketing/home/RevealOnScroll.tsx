'use client';

import { useEffect } from 'react';

/**
 * Adds the `reveal-active` class to all `.reveal` elements once they
 * intersect the viewport, so the CSS reveal animations play.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
