// Builds the data-driven parts of the page (works, studio, booking steps, FAQ).
import images from '../data/images.json';
import { booking, faq } from '../data/faq.js';

const BASE = import.meta.env.BASE_URL;
const pad = (n) => String(n).padStart(2, '0');

const studioAlts = [
  'Неоновый логотип PTS и граффити на стене студии',
  'Рабочее место мастера',
  'Стена с комиксами в студии',
  'Зона отдыха для гостей',
  'Рабочая зона с неоновой подсветкой',
  'Вход в студию',
];

export const works = images.works.map((w, i) => ({
  ...w,
  src: `${BASE}img/works/${w.id}-640.webp`,
  srcLarge: `${BASE}img/works/${w.id}-1280.webp`,
  alt: `Татуировка Александра Плоскова, работа ${i + 1}`,
}));

function renderWorks() {
  const track = document.querySelector('[data-works]');
  track.innerHTML = works
    .map(
      (w, i) => `
      <li class="work" style="--ar: ${w.w} / ${w.h}">
        <button class="work__btn" type="button" data-index="${i}" data-cursor="view" aria-label="Открыть работу ${i + 1} из ${works.length}">
          <img src="${w.src}" srcset="${w.src} 640w, ${w.srcLarge} 1280w" sizes="(max-width: 900px) 50vw, 32vw"
            width="${w.w}" height="${w.h}" alt="${w.alt}" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async" />
        </button>
        <span class="work__num">${pad(i + 1)}</span>
      </li>`,
    )
    .join('');

  document.querySelector('.works__total').textContent = pad(works.length);

  const more = document.createElement('button');
  more.className = 'btn works__more';
  more.type = 'button';
  more.textContent = `Показать все ${works.length} работ`;
  document.querySelector('.works__viewport').after(more);
}

function renderStudio() {
  document.querySelector('[data-studio]').innerHTML = images.studio
    .map(
      (s, i) => `
      <figure class="shot">
        <img src="${BASE}img/studio/${s.id}-800.webp"
          srcset="${BASE}img/studio/${s.id}-800.webp 800w, ${BASE}img/studio/${s.id}-1280.webp 1280w"
          sizes="(max-width: 900px) 100vw, ${i === 0 ? '58vw' : '40vw'}"
          width="${s.w}" height="${s.h}" alt="${studioAlts[i] ?? 'Студия PTS TATTOO'}" loading="lazy" decoding="async" />
      </figure>`,
    )
    .join('');
}

function renderSteps() {
  document.querySelector('[data-steps]').innerHTML = booking
    .map(
      ([title, text], i) => `
      <li class="step">
        <span class="step__num">${pad(i + 1)}</span>
        <h4 class="step__title">${title}</h4>
        <p class="step__text">${text}</p>
      </li>`,
    )
    .join('');
}

function renderFaq() {
  document.querySelector('[data-faq]').innerHTML = faq
    .map(
      (item, i) => `
      <div class="qa" data-reveal>
        <h3 class="qa__heading">
          <button class="qa__q" type="button" aria-expanded="false" aria-controls="qa-${i}" id="qa-btn-${i}">
            <span class="qa__num">${pad(i + 1)}</span>
            <span class="qa__title">${item.q}</span>
            <span class="qa__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="qa__panel" id="qa-${i}" role="region" aria-labelledby="qa-btn-${i}">
          <div class="qa__body">
            <ol class="qa__steps">
              ${item.steps
                .map(([t, d], j) => `<li style="transition-delay: ${0.05 * j + 0.1}s"><strong>${t}.</strong> ${d}</li>`)
                .join('')}
            </ol>
            ${item.note ? `<p class="qa__note">${item.note}</p>` : ''}
          </div>
        </div>
      </div>`,
    )
    .join('');
}

export function renderAll() {
  renderWorks();
  renderStudio();
  renderSteps();
  renderFaq();
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}
