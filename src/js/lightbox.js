// Fullscreen viewer for portfolio works: arrows, keyboard, swipe.
import { gsap } from 'gsap';
import { works } from './render.js';
import { lockScroll } from './smooth.js';

const box = document.querySelector('.lightbox');
const img = box.querySelector('.lightbox__img');
const counter = box.querySelector('.lightbox__counter');
const pad = (n) => String(n).padStart(2, '0');

let index = 0;
let opener = null;

function show(i, dir = 0) {
  index = (i + works.length) % works.length;
  const w = works[index];
  counter.textContent = `${pad(index + 1)} / ${pad(works.length)}`;

  gsap.killTweensOf(img);
  const swap = () => {
    img.src = w.srcLarge;
    img.alt = w.alt;
    gsap.fromTo(img, { autoAlpha: 0, x: dir * 40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out' });
  };
  if (dir === 0) swap();
  else gsap.to(img, { autoAlpha: 0, x: -dir * 40, duration: 0.25, ease: 'power2.in', onComplete: swap });

  // Warm up the neighbours so arrows feel instant
  [index - 1, index + 1].forEach((n) => (new Image().src = works[(n + works.length) % works.length].srcLarge));
}

export function openLightbox(i, from) {
  opener = from;
  box.hidden = false;
  lockScroll(true);
  show(i);
  gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
  box.querySelector('.lightbox__close').focus();
}

function close() {
  gsap.to(box, {
    autoAlpha: 0,
    duration: 0.3,
    onComplete: () => {
      box.hidden = true;
      img.removeAttribute('src');
      lockScroll(false);
      opener?.focus({ preventScroll: true });
    },
  });
}

export function initLightbox() {
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(index - 1, -1));
  box.querySelector('.lightbox__nav--next').addEventListener('click', () => show(index + 1, 1));
  box.addEventListener('click', (e) => e.target === box && close());

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1, -1);
    if (e.key === 'ArrowRight') show(index + 1, 1);
    if (e.key === 'Tab') {
      // Keep focus inside the dialog
      const focusable = [...box.querySelectorAll('button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  let startX = null;
  const figure = box.querySelector('.lightbox__figure');
  figure.addEventListener('pointerdown', (e) => (startX = e.clientX));
  figure.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
}
