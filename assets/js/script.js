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



/* Titels vullen regel voor regel tijdens het scrollen */
const fillTitles = Array.from(document.querySelectorAll('h1, h2'));
const originals = new Map(fillTitles.map(t => [t, t.innerHTML]));
let titleLines = new Map();   // titel -> lijst met regel-elementen

function splitIntoLines(title) {
  title.innerHTML = originals.get(title);

  // 1. Verzamel woorden (een <br> blijft een harde regelbreuk)
  const items = [];
  title.childNodes.forEach(node => {
    if (node.nodeName === 'BR') items.push(null);
    else items.push(...node.textContent.split(/\s+/).filter(Boolean));
  });

  // 2. Zet elk woord in een span om te meten waar de regels breken
  const label = title.textContent.replace(/\s+/g, ' ').trim();
  title.textContent = '';
  const wordEls = [];
  items.forEach(item => {
    if (item === null) { wordEls.push(null); return; }
    const s = document.createElement('span');
    s.textContent = item;
    s.style.display = 'inline-block';
    title.append(s, ' ');
    wordEls.push(s);
  });

  // 3. Groepeer woorden per regel (op basis van hun hoogte-positie)
  const lines = [[]];
  let lastTop = null;
  wordEls.forEach(el => {
    if (el === null) { lines.push([]); lastTop = null; return; }
    const top = el.offsetTop;
    if (lastTop !== null && top > lastTop + 2) lines.push([]);
    lines[lines.length - 1].push(el.textContent);
    lastTop = top;
  });

  // 4. Bouw de uiteindelijke regels op
  title.textContent = '';
  title.setAttribute('aria-label', label);
  const els = [];
  lines.filter(l => l.length).forEach((words, i) => {
    if (i > 0) title.append(document.createElement('br'));
    const line = document.createElement('span');
    line.className = 'fill-line';
    line.setAttribute('aria-hidden', 'true');
    line.textContent = words.join(' ');
    title.append(line);
    els.push(line);
  });
  titleLines.set(title, els);
}

function updateFill() {
  const vh = window.innerHeight;
  const start = vh * 0.95;   // begint te vullen als de titel onderaan in beeld komt
  const end   = vh * 0.40;   // volledig gevuld rond 40% van de viewport

  titleLines.forEach((lines, title) => {
    const rect = title.getBoundingClientRect();
    let p = (start - rect.top) / (start - end);
    p = Math.min(1, Math.max(0, p));

    const n = lines.length;
    lines.forEach((line, i) => {
      // regel i vult pas nadat de vorige regel klaar is
      const lp = Math.min(1, Math.max(0, p * n - i));
      line.style.setProperty('--fill', (lp * 100) + '%');
    });
  });
}

function setupTitles() {
  fillTitles.forEach(splitIntoLines);
  updateFill();
}

// Wachten tot het lettertype geladen is, anders kloppen de regelbreuken niet
document.fonts.ready.then(setupTitles);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setupTitles, 150);
});
window.addEventListener('scroll', () => requestAnimationFrame(updateFill), { passive: true });


// Laatste twee woorden van elke paragraaf aan elkaar vastzetten
document.querySelectorAll('p').forEach(p => {
  if (p.children.length === 0) {
    p.textContent = p.textContent.trim().replace(/\s+(\S+)$/, '\u00A0$1');
  }
});


// Alle projecten: nummer + naam (zoals op de index)
const projects = [
  { nr: 1, title: "Project één" },
  { nr: 2, title: "Huid retouches" },
  { nr: 3, title: "Huistijl" },
  { nr: 4, title: "Geometrische otter" },
  { nr: 5, title: "Patches" },
  { nr: 6, title: "Project zes" }
];

// Zelfde kleurenpatroon als op de index (herhaalt om de 4)
const colors = ["var(--pink)", "var(--lavender)", "var(--olive)", "var(--sky)"];

const box = document.getElementById("moreProjects");

if (box) {
  const current = Number(box.dataset.current);

  // Huidig project eruit halen en de rest willekeurig schudden
  const others = projects.filter((p) => p.nr !== current);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }

  // Eerste 2 tonen
  others.slice(0, 2).forEach((p) => {
    const link = document.createElement("a");
    link.className = "banner__item";
    link.href = `project-${p.nr}.html`;
    link.style.setProperty("--bg", colors[(p.nr - 1) % 4]);

    const img = document.createElement("img");
    img.src = `assets/images/project-${p.nr}-cover.jpg`;
    img.alt = p.title;

    const label = document.createElement("span");
    label.textContent = p.title;

    link.append(img, label);
    box.append(link);
  });
}



