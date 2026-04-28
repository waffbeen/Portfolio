/* ===========================================
   PRATHVI.SYS / v3.1 — interactive layer
   =========================================== */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- CONSOLE WELCOME ---------------- */
(function () {
  const styles = {
    big: 'font: 700 24px/1.2 "Fraunces", serif; color: #c8ff00; padding: 8px 0;',
    sub: 'font: 500 12px/1.6 "JetBrains Mono", monospace; color: #8a857c;',
    tag: 'font: 600 11px/1 "JetBrains Mono", monospace; color: #0a0a0a; background: #c8ff00; padding: 4px 8px; border-radius: 4px;',
    link: 'font: 500 12px/1.6 "JetBrains Mono", monospace; color: #c8ff00; text-decoration: underline;',
    muted: 'font: 400 11px/1.6 "JetBrains Mono", monospace; color: #5a564f;'
  };
  const banner = `
   ____           _   _          _   ___ ___
  |  _ \\ _ __ __ _| |_| |____   _(_) / __/ __| _   _ ___
  | |_) | '__/ _\` | __| '_ \\ \\ / / |.\\__ \\__ \\| | | / __|
  |  __/| | | (_| | |_| | | \\ V /| |.___) |__) | |_| \\__ \\
  |_|   |_|  \\__,_|\\__|_| |_|\\_/ |_||____/____(_)__, |___/
                                                |___/
  `;
  console.log('%c' + banner, 'font: 400 12px/1.2 "JetBrains Mono", monospace; color: #c8ff00;');
  console.log('%cPRATHVI SINGH RAJPUT', styles.big);
  console.log('%cSoftware Developer · Indore, MP · Available for full-time roles', styles.sub);
  console.log('%c v3.1 ', styles.tag, '  Static site · Vercel · Hand-coded · No frameworks');
  console.log('%c→ Inspecting the source? Cool. Take what you like.', styles.muted);
  console.log('%c→ Hire / contact: rajputana1208@gmail.com', styles.link);
  console.log('%c→ Press T to toggle theme · / to open chatbot · ↑↑↓↓←→←→BA for a surprise', styles.muted);
  console.log(' ');
})();

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

/* ---------------- SCROLL PROGRESS + BACK-TO-TOP ---------------- */
const scrollProgress = $('#scrollProgress');
const backToTop = $('#backToTop');
const bttProgress = $('#bttProgress');

function updateScrollProgress() {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
  if (bttProgress) bttProgress.style.setProperty('--p', pct);
  if (backToTop) backToTop.classList.toggle('visible', scrolled > 600);
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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
  // Open chatbot: /
  if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    openChatbot();
  }
  // Close chatbot or modal: Escape
  if (e.key === 'Escape') {
    closeChatbot();
    closeVisualModal();
  }
});

/* ====================================================
   SVG NODE TOOLTIPS (hover on .node-info elements)
   ==================================================== */
const nodeTooltip = $('#nodeTooltip');

function showNodeTooltip(text, e) {
  if (!nodeTooltip || !text) return;
  // Split first newline as title
  const idx = text.indexOf('\n');
  let title = '';
  let body = text;
  if (idx > -1) {
    title = text.slice(0, idx);
    body = text.slice(idx + 1);
  }
  nodeTooltip.innerHTML = (title ? `<span class="tip-title">${title}</span>` : '') + body;
  nodeTooltip.classList.add('visible');
  positionNodeTooltip(e);
}

function hideNodeTooltip() {
  if (nodeTooltip) nodeTooltip.classList.remove('visible');
}

function positionNodeTooltip(e) {
  if (!nodeTooltip) return;
  const pad = 16;
  const w = nodeTooltip.offsetWidth;
  const h = nodeTooltip.offsetHeight;
  let x = e.clientX + pad;
  let y = e.clientY + pad;
  if (x + w + pad > window.innerWidth) x = e.clientX - w - pad;
  if (y + h + pad > window.innerHeight) y = e.clientY - h - pad;
  nodeTooltip.style.left = x + 'px';
  nodeTooltip.style.top = y + 'px';
}

document.addEventListener('mouseover', (e) => {
  const node = e.target.closest('.node-info');
  if (node && node.dataset.tip) {
    showNodeTooltip(node.dataset.tip, e);
  }
});

document.addEventListener('mousemove', (e) => {
  if (nodeTooltip?.classList.contains('visible')) {
    positionNodeTooltip(e);
  }
});

document.addEventListener('mouseout', (e) => {
  const node = e.target.closest('.node-info');
  if (node) hideNodeTooltip();
});

/* ====================================================
   VISUAL EXPAND MODAL — click .project-visual to expand
   ==================================================== */
const visualModal = $('#visualModal');
const visualModalContent = $('#visualModalContent');
const visualModalMeta = $('#visualModalMeta');
const visualModalClose = $('#visualModalClose');

function openVisualModal(visualEl) {
  if (!visualModal || !visualEl) return;
  const svg = visualEl.querySelector('svg');
  if (!svg) return;

  // Read all project data from data attributes
  const title    = visualEl.dataset.modalTitle    || '';
  const sub      = visualEl.dataset.modalSub      || '';
  const desc     = visualEl.dataset.modalDesc     || '';
  const techRaw  = visualEl.dataset.modalTech     || '';
  const featsRaw = visualEl.dataset.modalFeatures || '';
  const github   = visualEl.dataset.modalGithub   || '';
  const demo     = visualEl.dataset.modalDemo     || '';
  const status   = visualEl.dataset.modalStatus   || '';

  // Build tech badge HTML
  const badges = techRaw.split(',').filter(Boolean)
    .map(t => `<span class="vm-badge">${t.trim()}</span>`)
    .join('');

  // Build features list HTML
  const featureItems = featsRaw.split('|').filter(Boolean)
    .map(f => `<li>${f.trim()}</li>`)
    .join('');

  // Build action buttons / status pill
  let actions = '';
  if (demo)   actions += `<a href="${demo}" target="_blank" rel="noopener" class="vm-btn vm-btn-primary">Live Demo ↗</a>`;
  if (github) actions += `<a href="${github}" target="_blank" rel="noopener" class="vm-btn vm-btn-secondary">GitHub ↗</a>`;
  if (status) actions += `<span class="vm-status"><span class="vm-status-dot"></span>${status}</span>`;

  // Populate right panel — each array item becomes ONE direct child of vm-right,
  // which is what the CSS nth-child stagger selectors count against (max 7 children).
  visualModalMeta.innerHTML = [
    sub      ? `<div class="vm-tag">${sub}</div>`   : '',
    title    ? `<div class="vm-title">${title}</div>` : '',
               `<div class="vm-divider"></div>`,
    desc     ? `<div class="vm-desc">${desc}</div>` : '',
    // Wrap label + badges together so they count as one child
    badges   ? `<div class="vm-section"><div class="vm-tech-label">Tech Stack</div><div class="vm-tech-badges">${badges}</div></div>` : '',
    // Wrap label + list together so they count as one child
    featureItems ? `<div class="vm-section"><div class="vm-features-label">Key Features</div><ul class="vm-features">${featureItems}</ul></div>` : '',
    actions  ? `<div class="vm-actions">${actions}</div>` : '',
  ].join('');

  // Populate left panel with a cloned SVG (preserves CSS variables + animations)
  visualModalContent.innerHTML = '';
  visualModalContent.appendChild(svg.cloneNode(true));

  // Open
  visualModal.classList.add('open');
  visualModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  hideNodeTooltip();
}

function closeVisualModal() {
  if (!visualModal) return;
  visualModal.classList.remove('open');
  visualModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

$$('.project-visual').forEach((visual) => {
  visual.addEventListener('click', (e) => {
    // Don't open modal if clicking on a tooltip-bearing node directly (let tooltip show)
    // Only open on visual area click — treat all clicks as expand
    openVisualModal(visual);
  });
});

visualModalClose?.addEventListener('click', closeVisualModal);
visualModal?.addEventListener('click', (e) => {
  if (e.target === visualModal) closeVisualModal();
});

/* ====================================================
   3D CARD TILT — applied to project, edu, ach cards
   ==================================================== */
const tiltSelectors = '.edu-card, .ach-card, .qf-item, .metric';
$$(tiltSelectors).forEach((card) => {
  card.classList.add('tilt');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rx = py * -8;
    const ry = px * 12;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ====================================================
   KONAMI CODE — ↑↑↓↓←→←→BA → party mode
   ==================================================== */
(function () {
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let progress = 0;

  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[progress]) {
      progress++;
      if (progress === sequence.length) {
        triggerPartyMode();
        progress = 0;
      }
    } else {
      progress = key === sequence[0] ? 1 : 0;
    }
  });

  function triggerPartyMode() {
    const overlay = $('#partyMode');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.classList.add('party');

    // Spawn confetti
    const confetti = $('.party-confetti', overlay);
    confetti.innerHTML = '';
    const colors = ['#c8ff00', '#ff5b1f', '#7850ff', '#0fdf6f', '#ffffff'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 1.5 + 's';
      piece.style.animationDuration = 2 + Math.random() * 2 + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.appendChild(piece);
    }

    // Bot reaction (if open)
    if (chatbotState.open) {
      addBotMessage('Konami code unlocked 🎉 — you found the secret. Welcome to party mode.');
    }

    setTimeout(() => {
      overlay.classList.remove('active');
      document.body.classList.remove('party');
    }, 5000);
  }
})();

/* ====================================================
   PRATHVI.BOT — chatbot
   ==================================================== */

// ---- Knowledge base (rule-based, keyword-weighted) ----
const knowledge = [
  {
    patterns: ['hi', 'hello', 'hey', 'sup', 'yo', 'namaste', 'hola', 'hii', 'hiii'],
    responses: [
      "Hey there! 👋 I'm <strong>Prathvi.bot</strong> — trained on Prathvi's bio. Ask me anything.",
      "Hi! What do you want to know — work, skills, projects, or how to reach Prathvi?",
      "Namaste 🙏 — Prathvi.bot here. Try a suggestion below or type your question."
    ]
  },
  {
    patterns: ['who', 'about', 'introduce', 'tell me about', 'tell about', 'intro', 'kaun'],
    responses: ["<strong>Prathvi Singh Rajput</strong> — Software Developer at <strong>Indus Analytics</strong>, Indore. ~2 years shipping production-grade ERP code, backend services, and cloud-deployed tools. Specializes in the unglamorous backend logic that quietly keeps businesses running."]
  },
  {
    patterns: ['name', 'naam', 'called'],
    responses: ["Prathvi Singh Rajput. Friends call him just <strong>Prathvi</strong>."]
  },
  {
    patterns: ['work', 'job', 'company', 'employed', 'kaha kaam', 'where work', 'indus', 'analytics'],
    responses: ["He works at <strong>Indus Analytics</strong> in Indore — Software Developer since June 2023. Building modules inside Thomson ERP — procurement, inventory, CAPEX, AMC tracking — plus the backend automation and SQL behind them."]
  },
  {
    patterns: ['skill', 'tech', 'stack', 'technology', 'language', 'know', 'expert'],
    responses: ["Core stack: <strong>VB.NET, Java, Python, MS SQL Server</strong>. Frontend: HTML/CSS/JS, Bootstrap. Cloud: Vercel, Railway, PlanetScale. Plus Google Maps API, email automation, ChatGPT/Copilot integrations. Want details on any specific area?"],
    action: { type: 'scrollTo', target: '#skills', label: 'See full stack' }
  },
  {
    patterns: ['backend', 'server', 'api'],
    responses: ["Backend is his strongest area. <strong>VB.NET</strong> for ERP work, <strong>Python</strong> for automation, <strong>Java</strong> for general dev. Comfortable with REST APIs, integrations (Google Maps, email pipelines), and writing the kind of business logic that has to survive Monday morning."]
  },
  {
    patterns: ['sql', 'database', 'db', 'query', 'stored proc'],
    responses: ["<strong>MS SQL Server</strong> deep-dive — stored procedures, triggers, and query optimization are bread and butter. He's refactored heavy ERP queries with indexed access patterns and measurable response-time wins on production load."]
  },
  {
    patterns: ['frontend', 'html', 'css', 'ui', 'javascript'],
    responses: ["Frontend stack: HTML5, CSS3, JavaScript, Bootstrap, responsive UI. This portfolio you're on right now? Hand-coded — no framework, just clean static files."]
  },
  {
    patterns: ['cloud', 'deploy', 'vercel', 'aws', 'hosting'],
    responses: ["Cloud experience: <strong>Vercel</strong> (this site), <strong>Railway DB</strong>, <strong>PlanetScale</strong>. Currently expanding into bigger cloud platforms and AI-augmented dev workflows."]
  },
  {
    patterns: ['ai', 'artificial', 'chatgpt', 'copilot', 'gpt'],
    responses: ["AI is part of his daily workflow — <strong>ChatGPT</strong> and <strong>GitHub Copilot</strong> deeply integrated into the dev cycle. Productivity compounds when AI tools become muscle memory. (Yes, this very chatbot is one of those experiments.)"]
  },
  {
    patterns: ['erp', 'thomson', 'procurement', 'inventory', 'capex', 'amc', 'maintenance'],
    responses: ["His main domain. Inside <strong>Thomson ERP</strong>, he's shipped: full PR → PO → GRN procurement lifecycle, supplier rating, CAPEX tracking, AMC modules with email triggers, and inventory reconciliation flows. All running in production."],
    action: { type: 'scrollTo', target: '#work', label: 'Show projects' }
  },
  {
    patterns: ['project', 'portfolio', 'case', 'shipped', 'built'],
    responses: ["Three highlight projects: <strong>1)</strong> Thomson ERP Procurement Suite — full PR→PO→GRN. <strong>2)</strong> AI-Based Parcel Delivery — real-time tracking on Google Maps API. <strong>3)</strong> CAPEX & AMC Tracking with automated alerts. Want me to scroll you down to the case studies?"],
    action: { type: 'scrollTo', target: '#work', label: 'Show case studies' }
  },
  {
    patterns: ['parcel', 'delivery', 'tracking', 'maps', 'google maps'],
    responses: ["The <strong>AI-Based Parcel Delivery</strong> project — real-time tracking using Google Maps API with automated email pipelines for every state change (dispatched → in-transit → out-for-delivery → delivered). Customers stopped calling support; ops stopped typing status updates."]
  },
  {
    patterns: ['education', 'study', 'studied', 'degree', 'college', 'university', 'school'],
    responses: ["Two degrees: <strong>MCA from IPS Academy, Indore (2023–2025)</strong> and <strong>B.Sc. Computer Science from Barkatullah University (2020–2023)</strong>. Did the MCA in parallel with shipping production ERP code at Indus Analytics."],
    action: { type: 'scrollTo', target: '#education', label: 'See education' }
  },
  {
    patterns: ['mca', 'master', 'ips', 'ips academy'],
    responses: ["<strong>MCA — IPS Academy, Indore (2023–2025)</strong>. Specialized in advanced software engineering, distributed systems, and database internals. Bridged academic theory with the production work he was already doing."]
  },
  {
    patterns: ['bsc', 'b.sc', 'bachelor', 'barkatullah'],
    responses: ["<strong>B.Sc. Computer Science — Barkatullah University, Bhopal (2020–2023)</strong>. Core CS foundation: data structures, algorithms, OS, networks, DBMS. Started shipping side projects in parallel during this time."]
  },
  {
    patterns: ['experience', 'years', 'how long', 'long time'],
    responses: ["~2 years of production experience as Software Developer at Indus Analytics (Jun 2023 → present). On top of that, side projects since college days."]
  },
  {
    patterns: ['where', 'location', 'city', 'indore', 'base', 'kaha rehta', 'rahta', 'live'],
    responses: ["Based in <strong>Indore, Madhya Pradesh</strong> (22.7196° N, 75.8577° E). <strong>Open to relocation</strong> for the right role."]
  },
  {
    patterns: ['relocate', 'relocation', 'shift'],
    responses: ["Yes — <strong>open to relocation</strong> anywhere in India or remote roles globally."]
  },
  {
    patterns: ['available', 'hire', 'hiring', 'looking', 'open', 'job', 'position', 'role'],
    responses: ["Available for <strong>full-time roles</strong>. Looking for backend / ERP / cloud-leaning positions where production reliability matters. Happy to chat about opportunities."],
    action: { type: 'scrollTo', target: '#contact', label: 'Get in touch' }
  },
  {
    patterns: ['contact', 'reach', 'email id', 'phone number', 'how to contact', 'kaise contact'],
    responses: ["<strong>Email:</strong> rajputana1208@gmail.com<br><strong>Phone:</strong> +91 79878 18873<br><strong>LinkedIn:</strong> /prathvisinghrajput<br><strong>GitHub:</strong> /Prathviie"],
    action: { type: 'scrollTo', target: '#contact', label: 'Open contact section' }
  },
  {
    patterns: ['email', 'mail'],
    responses: ["<strong>rajputana1208@gmail.com</strong> — drops there go straight to him."],
    action: { type: 'mailto', target: 'rajputana1208@gmail.com', label: 'Send email' }
  },
  {
    patterns: ['phone', 'number', 'call', 'mobile', 'whatsapp'],
    responses: ["<strong>+91 79878 18873</strong>. Calls during IST waking hours, please."]
  },
  {
    patterns: ['linkedin'],
    responses: ["LinkedIn: <strong>linkedin.com/in/prathvisinghrajput</strong>"],
    action: { type: 'link', target: 'https://linkedin.com/in/prathvisinghrajput', label: 'Open LinkedIn ↗' }
  },
  {
    patterns: ['github', 'git'],
    responses: ["GitHub: <strong>github.com/Prathviie</strong> — code samples and side projects."],
    action: { type: 'link', target: 'https://github.com/Prathviie', label: 'Open GitHub ↗' }
  },
  {
    patterns: ['resume', 'cv', 'pdf', 'download'],
    responses: ["You can download the resume PDF directly — current version is on the site."],
    action: { type: 'link', target: '/resume.pdf', label: 'Download resume ↓', download: true }
  },
  {
    patterns: ['salary', 'package', 'ctc', 'expected', 'pay', 'money', 'paisa'],
    responses: ["For salary discussions, best to reach out directly via email — that's a conversation about role, scope, and stack, not a one-liner."],
    action: { type: 'mailto', target: 'rajputana1208@gmail.com', label: 'Email Prathvi' }
  },
  {
    patterns: ['why hire', 'why you', 'why prathvi', 'why should'],
    responses: ["Because his code runs in production right now, has been for 2 years, and hasn't broken anything important. He optimizes the SQL <em>before</em> the architecture, and he automates anything that has to happen twice. Boring, reliable, fast — pick three."]
  },
  {
    patterns: ['strength', 'good at', 'best at', 'specialty'],
    responses: ["Strongest at: <strong>SQL optimization</strong>, <strong>backend logic for enterprise systems</strong>, and <strong>workflow automation</strong>. Plus a track record of taking ERP modules from idea to production-stable."]
  },
  {
    patterns: ['weakness', 'bad at', 'cant', 'cannot', 'not good'],
    responses: ["Honest answer? Heavy frontend animation work isn't his daily — he can build the UI (this site is hand-coded), but he reaches for backend depth before pixel-perfect motion design. Working on it."]
  },
  {
    patterns: ['hobby', 'free time', 'fun', 'life', 'interests'],
    responses: ["Outside work: shipping side projects, exploring AI tools, and the occasional deep-dive into a new database engine. Hard to separate work and play when you genuinely like the craft."]
  },
  {
    patterns: ['joke', 'funny', 'laugh', 'humor'],
    responses: [
      "Why did the database admin leave his wife? She had one-to-many relationships. 🥁",
      "Why don't programmers like nature? Too many bugs.",
      "What's a SQL developer's favorite song? Anything by Joins."
    ]
  },
  {
    patterns: ['are you human', 'are you real', 'are you ai', 'bot or human', 'who built you', 'who made'],
    responses: ["I'm <strong>Prathvi.bot</strong> — a rule-based chatbot trained on Prathvi's bio. Not an LLM, not magic — just clean keyword matching and a personality. Built by Prathvi himself for this portfolio."]
  },
  {
    patterns: ['how are you', 'kaise ho', 'kaisa hai', 'whats up', 'sab thik'],
    responses: ["Online and trained, ready to answer. How can I help you about Prathvi?"]
  },
  {
    patterns: ['thank', 'thanks', 'thx', 'thank you', 'shukriya', 'dhanyawad'],
    responses: ["Anytime 🙌 — drop another question, or hit the contact section if you want to talk to Prathvi directly."]
  },
  {
    patterns: ['bye', 'goodbye', 'see you', 'cya', 'alvida'],
    responses: ["Catch you later 👋 — Prathvi.bot will be here whenever."]
  },
  {
    patterns: ['marry', 'date', 'love', 'girlfriend', 'wife', 'crush'],
    responses: ["I'm a chatbot 🤖 — but I appreciate the energy. Stick to professional questions, please."]
  },
  {
    patterns: ['age', 'old', 'umar', 'birthday'],
    responses: ["Old enough to ship production code, young enough to enjoy it. For specifics, ask him directly 😄"]
  },
  {
    patterns: ['family', 'parent', 'father', 'mother', 'sibling'],
    responses: ["Personal life isn't part of my training data — I stick to professional facts. Ask Prathvi directly if you'd like."]
  },
  {
    patterns: ['konami', 'easter egg', 'secret', 'hidden'],
    responses: ["There <em>might</em> be a secret. Try the classic gamer cheat code on your keyboard. 🎮"]
  }
];

const fallbackResponses = [
  "Hmm, I don't have a great answer for that. Try asking about Prathvi's <strong>work, skills, projects, education, or contact</strong>.",
  "Not sure I followed — I'm best at questions about Prathvi's experience, stack, or how to reach him.",
  "That's outside my training. Want to ask about his ERP work, projects, or skills?"
];

const initialSuggestions = [
  "Who is Prathvi?",
  "What's his stack?",
  "Show projects",
  "How to contact?",
  "Download resume",
  "Tell me a joke"
];

// ---- Chatbot state + DOM ----
const chatbot = $('#chatbot');
const chatbotPanel = $('#chatbotPanel');
const chatbotToggle = $('#chatbotToggle');
const chatbotClose = $('#chatbotClose');
const chatbotMessages = $('#chatbotMessages');
const chatbotSuggestions = $('#chatbotSuggestions');
const chatbotForm = $('#chatbotForm');
const chatbotInput = $('#chatbotInput');

const chatbotState = {
  open: false,
  greeted: false,
  busy: false,
};

function openChatbot() {
  if (!chatbot) return;
  chatbot.classList.add('open');
  chatbotState.open = true;
  setTimeout(() => chatbotInput?.focus(), 400);
  if (!chatbotState.greeted) {
    setTimeout(() => {
      addBotMessage("Hi 👋 I'm <strong>Prathvi.bot</strong> — trained on Prathvi's bio. Ask me anything, or tap a suggestion below.");
      renderSuggestions(initialSuggestions);
    }, 500);
    chatbotState.greeted = true;
  }
}

function closeChatbot() {
  if (!chatbot) return;
  chatbot.classList.remove('open');
  chatbotState.open = false;
}

chatbotToggle?.addEventListener('click', openChatbot);
chatbotClose?.addEventListener('click', closeChatbot);

// ---- Render helpers ----
function addMessage(text, role, action) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + role;
  msg.innerHTML = text;

  if (action) {
    const btn = document.createElement(action.type === 'link' ? 'a' : 'button');
    btn.className = 'chat-msg-action';
    btn.textContent = action.label;
    if (action.type === 'scrollTo') {
      btn.addEventListener('click', () => {
        const target = document.querySelector(action.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          closeChatbot();
        }
      });
    } else if (action.type === 'mailto') {
      btn.href = 'mailto:' + action.target;
    } else if (action.type === 'link') {
      btn.href = action.target;
      btn.target = '_blank';
      btn.rel = 'noopener';
      if (action.download) btn.download = '';
    }
    msg.appendChild(document.createElement('br'));
    msg.appendChild(btn);
  }

  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return msg;
}

function addBotMessage(text, action) {
  return addMessage(text, 'bot', action);
}

function addUserMessage(text) {
  return addMessage(text, 'user');
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'chatTyping';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function hideTyping() {
  const typing = $('#chatTyping');
  if (typing) typing.remove();
}

function renderSuggestions(list) {
  chatbotSuggestions.innerHTML = '';
  list.forEach((label) => {
    const chip = document.createElement('button');
    chip.className = 'suggestion-chip';
    chip.type = 'button';
    chip.textContent = label;
    chip.addEventListener('click', () => {
      handleUserQuery(label);
    });
    chatbotSuggestions.appendChild(chip);
  });
}

// ---- Match logic ----
function findMatch(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  let bestMatch = null;
  let bestScore = 0;
  for (const item of knowledge) {
    for (const pattern of item.patterns) {
      if (q.includes(pattern)) {
        const score = pattern.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
    }
  }
  return bestMatch;
}

function pickResponse(item) {
  const arr = item.responses;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- Handle user input ----
function handleUserQuery(query) {
  if (chatbotState.busy) return;
  const text = query.trim();
  if (!text) return;
  chatbotState.busy = true;

  addUserMessage(escapeHTML(text));
  chatbotInput.value = '';
  chatbotSuggestions.innerHTML = '';

  showTyping();

  const match = findMatch(text);
  const delay = 700 + Math.random() * 600;

  setTimeout(() => {
    hideTyping();
    if (match) {
      addBotMessage(pickResponse(match), match.action);
    } else {
      addBotMessage(fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]);
    }
    // Re-render fresh suggestions
    setTimeout(() => {
      renderSuggestions(rotatedSuggestions());
      chatbotState.busy = false;
    }, 400);
  }, delay);
}

function rotatedSuggestions() {
  const all = [
    "Who is Prathvi?",
    "What's his stack?",
    "Show projects",
    "How to contact?",
    "Download resume",
    "Tell me a joke",
    "Where is he based?",
    "Why hire him?",
    "Education?",
    "Available for hire?"
  ];
  // Shuffle and pick 4
  return all.sort(() => Math.random() - 0.5).slice(0, 4);
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

chatbotForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  handleUserQuery(chatbotInput.value);
});
