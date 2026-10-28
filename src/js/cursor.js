// Custom cursor and magnetic buttons — only for precise pointers.
import { gsap } from 'gsap';
import { reducedMotion } from './smooth.js';

export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.querySelector('.cursor');
  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    cursor.classList.add('is-active');
    moveX(e.clientX);
    moveY(e.clientY);
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));

  document.addEventListener('pointerover', (e) => {
    const view = e.target.closest('[data-cursor="view"]');
    const link = !view && e.target.closest('a, button');
    cursor.classList.toggle('is-view', Boolean(view));
    cursor.classList.toggle('is-link', Boolean(link));
  });

  if (reducedMotion) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
