/* Uitvouwbaar menu */
const menu = document.getElementById('menu');
const toggle = document.getElementById('menuToggle');

function setMenu(open) {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
}

toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

// Sluit met Escape of door ergens buiten het menu te klikken
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => { if (!menu.contains(e.target)) setMenu(false); });

/* "Load more" (alleen als de knop op de pagina staat) */
const loadMoreBtn = document.getElementById('loadMore');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    document.querySelectorAll('.project.hidden').forEach(p => p.classList.remove('hidden'));
    loadMoreBtn.style.display = 'none';
  });
}

/* Banner met werk: loopt van links naar rechts en vertraagt bij hover */
const bannerTrack = document.getElementById('bannerTrack');

if (bannerTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const BASE_SPEED = 50;   // normale snelheid in pixels per seconde
  const SLOW_SPEED = 10;   // snelheid bij hover

  const originals = Array.from(bannerTrack.children);
  let copies = 1;
  let setWidth = 0;
  let speed = BASE_SPEED;
  let target = BASE_SPEED;
  let x = 0;
  let last = performance.now();

  // Voeg een kopie van alle foto's toe (voor de eindeloze lus)
  function addSet() {
    originals.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      bannerTrack.appendChild(clone);
    });
    copies++;
  }
};
/* FAQ: sluit de andere vragen wanneer je er een opent */
const faqItems = document.querySelectorAll('.faq details');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => { if (other !== item) other.open = false; });
    }
  });
});

document.addEventListener('click', e => {
  if (!menu.contains(e.target)) setMenu(false);
});