// Compact header visibility, fullscreen menu and smooth anchor links.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis, scrollTo, lockScroll, reducedMotion } from './smooth.js';

const header = document.querySelector('.header');
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const mobile = window.matchMedia('(max-width: 900px)');

let menuOpen = false;
let menuTl;

function updateHeader(scrollY, direction) {
  const pastHero = scrollY > window.innerHeight * 0.75;
  header.classList.toggle('is-visible', mobile.matches || pastHero);
  header.classList.toggle('is-hidden', !menuOpen && direction > 0 && scrollY > 240);
}

function openMenu() {
  menuOpen = true;
  menu.hidden = false;
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Закрыть меню');
  document.documentElement.classList.add('menu-open');
  lockScroll(true);

  menuTl?.kill();
  menuTl = gsap
    .timeline()
    .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: reducedMotion ? 0 : 0.9, ease: 'expo.inOut' })
    .fromTo('.menu__list a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, '-=0.45')
    .fromTo('.menu__footer', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.6');
}

function closeMenu() {
  if (!menuOpen) return Promise.resolve();
  menuOpen = false;
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
  document.documentElement.classList.remove('menu-open');
  lockScroll(false);

  menuTl?.kill();
  return new Promise((resolve) => {
    gsap.to(menu, {
      clipPath: 'inset(0 0 100% 0)',
      duration: reducedMotion ? 0 : 0.7,
      ease: 'expo.inOut',
      onComplete: () => {
        menu.hidden = true;
        resolve();
      },
    });
  });
}

export function initNav() {
  burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && menuOpen && closeMenu());

  // All in-page anchors scroll smoothly; menu links close the menu first
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    const target = hash === '#top' || hash === '#' ? 0 : document.querySelector(hash);
    if (target === null) return;
    e.preventDefault();
    if (menu.contains(link)) await closeMenu();
    scrollTo(target);
  });

  if (lenis) {
    lenis.on('scroll', ({ scroll, direction }) => updateHeader(scroll, direction));
  } else {
    let last = window.scrollY;
    window.addEventListener('scroll', () => {
      updateHeader(window.scrollY, Math.sign(window.scrollY - last));
      last = window.scrollY;
    }, { passive: true });
  }
  mobile.addEventListener('change', () => {
    updateHeader(window.scrollY, 0);
    ScrollTrigger.refresh();
  });
  updateHeader(window.scrollY, 0);
}
