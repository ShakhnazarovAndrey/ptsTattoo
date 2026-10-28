// Preloader (logo draws itself + counter) followed by the hero entrance.
import { gsap } from 'gsap';
import { reducedMotion } from './smooth.js';

function preloader() {
  const el = document.querySelector('.preloader');
  if (!el) return Promise.resolve();

  if (reducedMotion) {
    el.remove();
    return Promise.resolve();
  }

  const paths = el.querySelectorAll('path');
  const count = el.querySelector('.preloader__count');
  const counter = { v: 0 };

  paths.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => el.remove() })
      .to(paths, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.18 })
      .to(counter, {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => (count.textContent = Math.round(counter.v)),
      }, 0)
      .to(paths, { fillOpacity: 1, duration: 0.35 }, '-=0.25')
      .to('.preloader__logo', { scale: 0.9, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      .to(count, { autoAlpha: 0, duration: 0.3 }, '<')
      .call(resolve)
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '<');
  });
}

function heroIntro() {
  if (reducedMotion) return;

  gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__media', { clipPath: 'inset(0 0 0 100%)', duration: 1.8, ease: 'expo.inOut' }, 0)
    .from('.hero__img', { scale: 1.3, duration: 2.6 }, 0)
    .from('.hero__line > span', { yPercent: 110, duration: 1.5, stagger: 0.12 }, 0.45)
    .from('[data-hero-fade]', { autoAlpha: 0, y: 30, duration: 1.4, stagger: 0.1 }, 0.7)
    .from('.hero__logo, .hero__nav a', { autoAlpha: 0, y: -14, duration: 1.1, stagger: 0.05 }, 0.6);

  // Leaving the hero: photo drifts slower than the page, text fades up
  const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__img', { yPercent: 14, ease: 'none', scrollTrigger: st });
  gsap.to('.hero__content', { yPercent: -18, autoAlpha: 0.15, ease: 'none', scrollTrigger: st });
}

export async function runIntro() {
  // Hold the page until fonts are in, so split lines measure correctly
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
  await preloader();
  document.body.classList.remove('is-loading');
  heroIntro();
}
