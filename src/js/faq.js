// FAQ accordion: one answer open at a time.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initFaq() {
  const items = [...document.querySelectorAll('.qa')];

  const toggle = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.qa__q').setAttribute('aria-expanded', String(open));
  };

  items.forEach((item) => {
    item.querySelector('.qa__q').addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((other) => other !== item && toggle(other, false));
      toggle(item, open);
    });
    // Page height changed — let later triggers re-measure
    item.querySelector('.qa__panel').addEventListener('transitionend', (e) => {
      if (e.propertyName === 'grid-template-rows') ScrollTrigger.refresh();
    });
  });

  if (items[0]) toggle(items[0], true);
}
