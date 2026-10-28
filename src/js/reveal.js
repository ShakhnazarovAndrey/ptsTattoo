// Scroll-driven reveals: split headings, fade-ups, counters, parallax, marquee.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { lenis, reducedMotion } from './smooth.js';

const onView = (trigger, start = 'top 85%') => ({ trigger, start, once: true });

function splitHeadings() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: onView(el),
        }),
    });
  });

  document.querySelectorAll('.eyebrow').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, x: -30, duration: 1.4, ease: 'expo.out', scrollTrigger: onView(el) });
  });

  // Big "Записаться": letters rise one by one, then drift with the scroll
  const title = document.querySelector('[data-split-chars]');
  const split = SplitText.create(title, { type: 'chars', charsClass: 'char', mask: 'chars' });
  gsap.from(split.chars, {
    yPercent: 115,
    duration: 1.3,
    ease: 'expo.out',
    stagger: 0.045,
    scrollTrigger: onView(title, 'top 90%'),
  });
  gsap.fromTo(title, { x: '4vw' }, {
    x: '-2vw',
    ease: 'none',
    scrollTrigger: { trigger: title, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

function fadeUps() {
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, overwrite: true }),
  });
}

function counters() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-count]').forEach((el) => {
    const since = el.dataset.countSince;
    const to = since ? year - Number(since) : Number(el.dataset.count);
    const from = Number(el.dataset.countFrom ?? 0);
    const format = 'countFormat' in el.dataset;
    const show = (v) => (el.textContent = format ? Math.round(v).toLocaleString('ru-RU') : Math.round(v));
    const state = { v: from };
    show(from);
    gsap.to(state, {
      v: to,
      duration: 2,
      ease: 'power3.out',
      onUpdate: () => show(state.v),
      scrollTrigger: onView(el, 'top 92%'),
    });
  });
}

function parallax() {
  // About photo: image is 120% tall, slides within its frame
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -16 }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  gsap.from('.about__badge', {
    scale: 0.6,
    rotate: -40,
    autoAlpha: 0,
    duration: 1.6,
    ease: 'expo.out',
    scrollTrigger: onView('.about__badge', 'top 95%'),
  });

  // Studio collage: mask reveal + inner parallax at different speeds
  const shots = gsap.utils.toArray('.shot');
  gsap.from(shots, {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1.5,
    ease: 'expo.inOut',
    stagger: 0.1,
    scrollTrigger: onView('.studio__grid', 'top 80%'),
  });
  shots.forEach((shot, i) => {
    const amount = 6 + (i % 3) * 2;
    gsap.fromTo(shot.querySelector('img'), { yPercent: -amount }, {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Booking steps: each row slides in, its bottom rule fills while the row crosses the middle of the screen
  gsap.from('.step', {
    autoAlpha: 0,
    y: 40,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: onView('.steps', 'top 85%'),
  });
  gsap.utils.toArray('.step').forEach((step) => {
    gsap.fromTo(step, { '--fill': 0 }, {
      '--fill': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: step,
        start: 'top 65%',
        end: 'bottom 45%',
        scrub: true,
        toggleClass: { targets: step, className: 'is-active' },
      },
    });
  });

  gsap.from('.footer__wordmark', {
    yPercent: 40,
    autoAlpha: 0,
    duration: 1.6,
    ease: 'expo.out',
    scrollTrigger: onView('.footer__wordmark', 'top 98%'),
  });
}

function marquee() {
  const track = document.querySelector('.marquee__track');
  track.innerHTML += track.innerHTML; // two copies → seamless loop at -50%
  let x = 0;
  let dir = -1;
  let boost = 0;
  const wrap = () => gsap.utils.wrap(-track.scrollWidth / 2, 0);
  let wrapX = wrap();
  window.addEventListener('resize', () => (wrapX = wrap()));
  const setX = gsap.quickSetter(track, 'x', 'px');

  gsap.ticker.add((_, dt) => {
    x = wrapX(x + dir * (0.05 + boost) * dt);
    boost *= 0.94;
    setX(x);
  });

  // Scroll direction flips the marquee, scroll speed pushes it
  lenis?.on('scroll', ({ velocity, direction }) => {
    if (direction) dir = direction > 0 ? -1 : 1;
    boost = Math.max(boost, Math.min(Math.abs(velocity) * 0.025, 1.2));
  });
}

export function initReveal() {
  counters();
  if (reducedMotion) return;
  splitHeadings();
  fadeUps();
  parallax();
  marquee();
}
