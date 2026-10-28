// Portfolio: pinned horizontal gallery on desktop, two-column grid with "show more" on mobile.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { openLightbox } from './lightbox.js';

export function initWorks() {
  const section = document.querySelector('.works');
  const track = section.querySelector('.works__track');
  const current = section.querySelector('.works__current');
  const bar = section.querySelector('.works__progress i');
  const total = track.children.length;

  track.addEventListener('click', (e) => {
    const btn = e.target.closest('.work__btn');
    if (btn) openLightbox(Number(btn.dataset.index), btn);
  });

  section.querySelector('.works__more').addEventListener('click', () => {
    section.classList.add('is-expanded');
    ScrollTrigger.refresh();
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-pinned');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // Gallery moves faster than the page so 25 works don't take forever to scroll through
        end: () => `+=${distance() * 0.6}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          bar.style.transform = `scaleX(${progress})`;
          current.textContent = String(Math.min(total, Math.floor(progress * total) + 1)).padStart(2, '0');
        },
      },
    });

    // Cards slide in from the right the first time the section arrives
    gsap.from(track.children, {
      xPercent: 40,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    });

    return () => section.classList.remove('is-pinned');
  });
}
