/* ===========================================
   PRATHVI.SYS / v3.0 — interactive layer
   =========================================== */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- LOADER ---------------- */
window.addEventListener('load', () => {
  const loader = $('#loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 700);
  }, prefersReducedMotion ? 200 : 1700);
});

/* ---------------- LIVE TIME (IST) ---------------- */
function updateTime() {
  const el = $('#liveTime');
  if (!el) return;
  const now = new Date();
  const t = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  el.textContent = `IST · ${t}`;
}
updateTime();
setInterval(updateTime, 30000);

/* ---------------- THEME TOGGLE ----------------
   Initial theme is set by inline <script> in <head> (auto by IST time
   if no saved preference). Here we only handle manual toggle clicks.
*/
const themeToggle = $('#themeToggle');
const root = document.documentElement;

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---------------- CUSTOM CURSOR (dual-layer) ---------------- */
const cursorDot = $('#cursorDot');
const cursorBlur = $('#cursorBlur');

if (cursorDot && cursorBlur && !('ontouchstart' in window)) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let bx = mx;
  let by = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // Smooth-follow blur cursor
  function tick() {
    bx += (mx - bx) * 0.18;
    by += (my - by) * 0.18;
    cursorBlur.style.transform = `translate(${bx}px, ${by}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover state on interactive elements
  const hoverSelectors = 'a, button, input, textarea, .skill-block, .ach-card, .case-block, .qf-item, .edu-card, .stat, .metric';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursorDot.classList.add('hover');
      cursorBlur.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursorDot.classList.remove('hover');
      cursorBlur.classList.remove('hover');
    }
  });
}

/* ---------------- MAGNETIC BUTTONS ---------------- */
$$('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ---------------- SCROLL PROGRESS ---------------- */
const scrollProgress = $('#scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------------- SCROLL REVEAL ---------------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        // Trigger skill bar fills
        $$('.skill-fill', entry.target).forEach((bar) => {
          const w = bar.style.width;
          bar.style.setProperty('--target-width', w);
        });
        revealIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$('.reveal').forEach((el) => revealIO.observe(el));

/* ---------------- SECTION DOT NAVIGATION ---------------- */
const sectionIds = ['hero', 'about', 'skills', 'work', 'experience', 'education', 'contact'];
const sectionDots = $$('.side-dot');

const sectionIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        const id = entry.target.id;
        sectionDots.forEach((dot) => {
          dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
        });
      }
    });
  },
  { threshold: [0.4, 0.6] }
);

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionIO.observe(el);
});

/* ---------------- HERO MOUSE PARALLAX ---------------- */
const heroParallax = $('#heroParallax');
const hero = $('.hero');
if (heroParallax && hero && !prefersReducedMotion) {
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    $$('.parallax-orb', heroParallax).forEach((orb, i) => {
      const factor = i === 0 ? 30 : -50;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    $$('.parallax-orb', heroParallax).forEach((orb) => (orb.style.transform = ''));
  });
}

/* ---------------- SKILL BLOCK SPOTLIGHT ---------------- */
$$('.skill-block').forEach((block) => {
  block.addEventListener('mousemove', (e) => {
    const r = block.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    block.style.setProperty('--mx', mx + '%');
    block.style.setProperty('--my', my + '%');
  });
});

/* ---------------- ANIMATED COUNTERS ---------------- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;

  const duration = 1800;
  const start = performance.now();

  // Preserve <sup> if present
  const sup = el.querySelector('sup');
  const hasSup = !!sup;
  const supText = hasSup ? sup.outerHTML : '';

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    // ease-out-cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(target * eased);
    if (hasSup) {
      el.innerHTML = value + supText;
    } else {
      el.textContent = value + suffix;
    }
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

$$('[data-count]').forEach((el) => counterIO.observe(el));

/* ---------------- DEPLOY DATE ---------------- */
const deployDate = $('#deployDate');
if (deployDate) {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  deployDate.textContent = `${mm}.${dd}.${yy}`;
}

/* ---------------- SMOOTH SCROLL FOR INTERNAL ANCHORS ---------------- */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------------- KEYBOARD SHORTCUTS ---------------- */
document.addEventListener('keydown', (e) => {
  // Toggle theme: T
  if (e.key === 't' || e.key === 'T') {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    themeToggle?.click();
  }
});
