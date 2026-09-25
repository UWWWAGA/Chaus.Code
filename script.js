const IMG = "./images/";

const skills = [
  ["Web design", 80], ["HTML", 100], ["CSS", 100],
  ["SCSS / SASS", 100], ["JavaScript", 90], ["PHP", 90],
  ["WordPress", 95], ["Tilda", 100], ["1C-Bitrix", 50]
];
const skillsGrid = document.getElementById('skillsGrid');
skills.forEach(([name, val]) => {
  const el = document.createElement('div');
  el.className = 'skill-card reveal';
  el.innerHTML = `
      <div class="skill-top"><span>${name}</span><span>${val}%</span></div>
      <div class="skill-bar"><i style="width:0%" data-target="${val}"></i></div>`;
  skillsGrid.appendChild(el);
});

const reviews = [
  ["Mobilkom", "avatar-1-converted.webp", "Быстро и качественно выполнена работа! Внимательный и понимающий задачи человек! Огромное спасибо! Рекомендую людям, которые хотят заказать себе качественный сайт!"],
  ["diefrompain1993", "avatar-4-converted.webp", "Рекомендую данного исполнителя! Всё было выполнено в соответствии с требованиями, также предлагалось своё видение того, как всё должно выглядеть — 10 из 10."],
  ["VK17", "avatar-1-converted.webp", "Отличная работа, 100% доволен результатом. Быстро и чётко реагирует на все пожелания, работает точно по ТЗ. Терпелив и приятен в общении."],
  ["Sasha Ieriemina", "avatar-3-converted.webp", "Обратилась за сайтом с нуля и не пожалела ни секунды. Отвечал на все вопросы и объяснял максимально подробно. Осталась в восторге, рекомендую на 100%."],
  ["Юлия", "avatar-2-converted.webp", "Получила готовый сайт за 2 дня, Константин объяснил устройство админки и ответил на все вопросы. Однозначно рекомендую, буду обращаться ещё!"],
  ["getlucky2021", "avatar-3-converted.webp", "Перевели оперативно 2 сайта на новые языки за несколько часов. Всё чётко, все пожелания учтены."],
  ["Константин", "avatar-4-converted.webp", "И другие отзывы, которые можно почитать на <a href=\"https://kwork.ru/user/buwaga\" target=\"_blank\" rel=\"noopener noreferrer\">Kwork</a>."],
];

const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsDots = document.getElementById('reviewsDots');

function cardStep() {
  const card = reviewsTrack.querySelector('.review-card');
  if (!card) return 360;
  const style = getComputedStyle(reviewsTrack);
  return card.offsetWidth + parseFloat(style.gap || 18);
}

reviews.forEach(([name, avatar, text], i) => {
  const el = document.createElement('div');
  el.className = 'review-card reveal in';
  el.dataset.index = i;
  el.innerHTML = `
      <div class="stars">★★★★★</div>
      <p>«${text}»</p>
      <div class="review-top">
        <img src="${IMG}${avatar}" alt="${name}" loading="lazy" decoding="async">
        <strong>${name}</strong>
      </div>`;
  reviewsTrack.appendChild(el);

  const dot = document.createElement('div');
  dot.className = 'rdot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => {
    const targetCard = [...reviewsTrack.children].find(c => parseInt(c.dataset.index) === i);
    if (targetCard) {
      reviewsTrack.scrollTo({ left: targetCard.offsetLeft - reviewsTrack.offsetLeft, behavior: 'smooth' });
    }
  });
  reviewsDots.appendChild(dot);
});

const origCards = [...reviewsTrack.children];
origCards.forEach(c => reviewsTrack.appendChild(c.cloneNode(true)));
[...origCards].reverse().forEach(c => reviewsTrack.insertBefore(c.cloneNode(true), reviewsTrack.firstChild));

const total = reviews.length;
setTimeout(() => {
  reviewsTrack.scrollLeft = total * cardStep();
}, 50);

let isAdjusting = false;
reviewsTrack.addEventListener('scroll', () => {
  if (isAdjusting) return;
  const step = cardStep();
  const setWidth = total * step;

  if (reviewsTrack.scrollLeft <= step * 0.5) {
    isAdjusting = true;
    reviewsTrack.style.scrollBehavior = 'auto';
    reviewsTrack.scrollLeft += setWidth;
    reviewsTrack.style.scrollBehavior = '';
    isAdjusting = false;
  }
  else if (reviewsTrack.scrollLeft >= setWidth * 2 - step * 0.5) {
    isAdjusting = true;
    reviewsTrack.style.scrollBehavior = 'auto';
    reviewsTrack.scrollLeft -= setWidth;
    reviewsTrack.style.scrollBehavior = '';
    isAdjusting = false;
  }

  const rawIndex = Math.round(reviewsTrack.scrollLeft / step);
  const realIndex = ((rawIndex % total) + total) % total;
  [...reviewsDots.children].forEach((d, i) => d.classList.toggle('active', i === realIndex));
});

document.getElementById('revNext').addEventListener('click', () => {
  reviewsTrack.scrollBy({ left: cardStep(), behavior: 'smooth' });
});
document.getElementById('revPrev').addEventListener('click', () => {
  reviewsTrack.scrollBy({ left: -cardStep(), behavior: 'smooth' });
});

let isDragging = false, dragStartX = 0, dragStartScroll = 0, dragMoved = false;
reviewsTrack.addEventListener('mousedown', (e) => {
  isDragging = true; dragMoved = false;
  reviewsTrack.classList.add('dragging');
  dragStartX = e.pageX;
  dragStartScroll = reviewsTrack.scrollLeft;
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const delta = e.pageX - dragStartX;
  if (Math.abs(delta) > 4) dragMoved = true;
  reviewsTrack.scrollLeft = dragStartScroll - delta;
});
window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  reviewsTrack.classList.remove('dragging');
});
reviewsTrack.addEventListener('click', (e) => { if (dragMoved) e.preventDefault(); }, true);

const AUTOPLAY_MS = 4000;
let autoplayTimer = null;

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    reviewsTrack.scrollBy({ left: cardStep(), behavior: 'smooth' });
  }, AUTOPLAY_MS);
}
function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}
function pauseAutoplay() { stopAutoplay(); }
function resumeAutoplay() { startAutoplay(); }

const reviewsSlider = document.querySelector('.reviews-slider');
reviewsSlider.addEventListener('mouseenter', pauseAutoplay);
reviewsSlider.addEventListener('mouseleave', resumeAutoplay);
reviewsTrack.addEventListener('touchstart', pauseAutoplay, { passive: true });
reviewsTrack.addEventListener('touchend', resumeAutoplay, { passive: true });

reviewsDots.addEventListener('click', () => {
  pauseAutoplay();
  resumeAutoplay();
});

startAutoplay();

document.getElementById('revNext').addEventListener('click', () => {
  pauseAutoplay();
  reviewsTrack.scrollBy({ left: cardStep(), behavior: 'smooth' });
  resumeAutoplay();
});
document.getElementById('revPrev').addEventListener('click', () => {
  pauseAutoplay();
  reviewsTrack.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  resumeAutoplay();
});

const folio = [
  { name: "Project 1", cat: "dev", img: "project-1(1)-converted.webp" },
  { name: "Project 2", cat: "dev", img: "project-2(1)-converted.webp" },
  { name: "Project 3", cat: "design", img: "project-3(1)-converted.webp" },
  { name: "Project 4", cat: "design", img: "project-4(1)-converted.webp" },
  { name: "Project 5", cat: "dev", img: "project-5(1)-converted.webp" },
  { name: "Metaspark", cat: "dev", img: "project-6(1)-converted.webp" },
  { name: "Project 7", cat: "design", img: "project-7(1)-converted.webp" },
  { name: "Project 8", cat: "dev", img: "project-8(1)-converted.webp" },
  { name: "Project 9", cat: "design", img: "project-9(1)-converted.webp" },
  { name: "Iterumsi", cat: "dev,design", img: "iterum-converted.webp"},
  { name: "Shusha", cat: "dev,design", img: "shusha-converted.webp"},
  { name: "Stadia", cat: "dev", img: "stadia-converted.webp"},
  { name: "Biznesgrib", cat: "dev,design", img: "biznesgrib-converted.webp", link: "https://uwwwaga.github.io/biznesgrib/" },
  { name: "Apollon Group", cat: "dev,design", img: "apollongroup-converted.webp", link: "https://apollongroup.shop" },
  { name: "Coca", cat: "dev", img: "coca-converted.webp", link: "https://uwwwaga.github.io/Coca-1/" },
  { name: "Wake&Bake", cat: "dev", img: "wakebake-converted.webp", link: "https://uwwwaga.github.io/Wake-Bake/" },
  { name: "Car Musc", cat: "dev", img: "carmusc-converted.webp", link: "https://uwwwaga.github.io/Car-musc/" },
  { name: "Agrofrost", cat: "dev", img: "agrofrost-converted.webp", link: "https://agrofrost.pro" },
  { name: "MooniРейтинг", cat: "dev,design", img: "mooni-converted.webp", link: "https://uwwwaga.github.io/Mooniverse/" },
  { name: "Lumina Coffee", cat: "dev,design", img: "Lumina-Coffee-converted.webp", link: "https://uwwwaga.github.io/Lumina-Coffee/" },
  { name: "Lartums", cat: "dev", img: "lartums-converted.webp", link: "https://lartums.ru" },
  { name: "Lapki Vet", cat: "design", img: "Lapki Vet-converted.webp", link: "https://www.figma.com/proto/MWz2rb2hVxLJxRGO2J552N/Lapki" },
  { name: "ParmaSystems", cat: "dev,design", img: "parmasystems-converted.webp", link: "https://uwwwaga.github.io/ParmaSystems/" },
  { name: "Aura", cat: "dev,design", img: "aura-converted.webp", link: "https://uwwwaga.github.io/Aura/" },
  { name: "PhotographerKazan", cat: "dev,design", img: "photographerkazan-converted.webp", link: "https://uwwwaga.github.io/PhotographerKazan/" },
  { name: "Dimension", cat: "dev,design", img: "dimension-converted.webp", link: "https://uwwwaga.github.io/Dimension/" },
  { name: "Hyperspace", cat: "dev,design", img: "hyperspace-converted.webp", link: "https://uwwwaga.github.io/Hyperspace/" },
];
const catLabel = c => c.includes(',') ? 'Разработка · Дизайн' : (c === 'dev' ? 'Веб разработка' : 'Веб дизайн');
const folioGrid = document.getElementById('folioGrid');
const folioMoreWrap = document.getElementById('folioMoreWrap');
const folioMoreBtn = document.getElementById('folioMoreBtn');

const FOLIO_INITIAL = 9;
const FOLIO_STEP = 6;
let folioVisible = FOLIO_INITIAL;
let folioCurrentFilter = 'all';

function renderFolio(filter) {
  folioGrid.innerHTML = '';
  const filtered = folio.filter(p => filter === 'all' || p.cat.includes(filter));
  filtered.slice(0, folioVisible).forEach(p => {
    const el = document.createElement(p.link ? 'a' : 'div');
    el.className = 'folio-card reveal in';
    if (p.link) { el.href = p.link; el.target = '_blank'; }
    if (p.img) {
      el.innerHTML = `
          <img src="${IMG}${p.img}" alt="${p.name}" loading="lazy" decoding="async">
          <div class="folio-overlay"><span>${catLabel(p.cat)}</span><h4>${p.name}</h4></div>`;
    } else {
      el.innerHTML = `
          <div class="folio-noimg"><span>${catLabel(p.cat)}</span><h4>${p.name}</h4></div>`;
    }
    folioGrid.appendChild(el);
  });
  folioMoreWrap.classList.toggle('hidden', folioVisible >= filtered.length);
}
renderFolio(folioCurrentFilter);

folioMoreBtn.addEventListener('click', () => {
  folioVisible += FOLIO_STEP;
  renderFolio(folioCurrentFilter);
});

document.getElementById('folioFilter').addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  document.querySelectorAll('#folioFilter button').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  folioCurrentFilter = e.target.dataset.filter;
  folioVisible = FOLIO_INITIAL;
  renderFolio(folioCurrentFilter);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      if (entry.target.classList.contains('skill-card')) {
        const bar = entry.target.querySelector('.skill-bar i');
        bar.style.width = bar.dataset.target + '%';
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal:not(.in)').forEach(el => observer.observe(el));

setTimeout(() => {
  document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));
}, 50);

const contactOverlay = document.getElementById('contactModalOverlay');
const openContactBtn = document.getElementById('openContactModal');
const closeContactBtn = document.getElementById('closeContactModal');

let scrollY = 0;

function openContactModal() {
  scrollY = window.scrollY || window.pageYOffset;
  contactOverlay.classList.add('active');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}
function closeContactModal() {
  contactOverlay.classList.remove('active');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
}
openContactBtn.addEventListener('click', openContactModal);
closeContactBtn.addEventListener('click', closeContactModal);
contactOverlay.addEventListener('click', (e) => {
  if (e.target === contactOverlay) closeContactModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactOverlay.classList.contains('active')) closeContactModal();
});

const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
  navBurger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
}
function closeMobileMenu() {
  navBurger.classList.remove('active');
  mobileMenu.classList.remove('active');
}
navBurger.addEventListener('click', toggleMobileMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') &&
    !mobileMenu.contains(e.target) && !navBurger.contains(e.target)) {
    closeMobileMenu();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMobileMenu(); });
