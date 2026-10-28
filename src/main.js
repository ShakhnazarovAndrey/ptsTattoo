import '@fontsource/great-vibes/400.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';

import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

import { renderAll } from './js/render.js';
import { runIntro } from './js/intro.js';
import { initNav } from './js/nav.js';
import { initReveal } from './js/reveal.js';
import { initWorks } from './js/works.js';
import { initLightbox } from './js/lightbox.js';
import { initFaq } from './js/faq.js';
import { initCursor } from './js/cursor.js';

document.documentElement.classList.remove('no-js');
document.body.classList.add('is-loading');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

renderAll();
initNav();
initLightbox();
initFaq();
initCursor();

runIntro().then(() => {
  initWorks();
  initReveal();
  ScrollTrigger.refresh();
});

// Images above the pinned gallery change layout once they load
window.addEventListener('load', () => ScrollTrigger.refresh());
