// Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const lenis = reducedMotion ? null : new Lenis({ lerp: 0.1, wheelMultiplier: 1 });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollTo(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (typeof target === 'number') window.scrollTo(0, target);
    else el?.scrollIntoView();
  }
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.body.style.overflow = locked ? 'hidden' : '';
}
