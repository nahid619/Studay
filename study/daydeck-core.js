/* ══════════════════════════════════════════════════════════
   DayDeck — daydeck-core.js  (Phase 3 update)

   Shared functions used by all four study plan pages.
   slds-doc.html does NOT include this file — it manages
   its own state independently.

   Phase 3 additions vs Phase 2:
     - showDrawer()   — opens both the drawer and the scrim (D1)
     - closeDrawer()  — now also closes the scrim (D1)
     - Pulse-on-first-visit logic at bottom (D7)

   WHY var FOR currentCard:
   Classic script tags each have their own block scope.
   var here creates a window global that both this file
   and each plan page's openDay() can read and write.
══════════════════════════════════════════════════════════ */


/* ── Shared mutable state ── */
// eslint-disable-next-line no-var
var currentCard = null;  /* var intentional — must cross <script> tag boundaries */


/* ── HTML entity decoder  (C5)
   Converts encoded HTML entities back to readable characters
   before injecting data-* text into the drawer.
────────────────────────────────────────────────────────── */
function decodeEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'");
}


/* ── Hex color → rgba string
   hexToRgba('#FF6B6B', 0.1)  →  'rgba(255,107,107,0.1)'
────────────────────────────────────────────────────────── */
function hexToRgba(hex, a) {
  hex = hex.replace('#', '');
  return 'rgba(' +
    parseInt(hex.slice(0, 2), 16) + ',' +
    parseInt(hex.slice(2, 4), 16) + ',' +
    parseInt(hex.slice(4, 6), 16) + ',' +
    a + ')';
}


/* ── Update prev/next button disabled state
   Uses only VISIBLE (non-dimmed) cards so the buttons
   correctly reflect navigation within the active filter.
────────────────────────────────────────────────────────── */
function updateNavButtons(card) {
  const visible = Array.from(document.querySelectorAll('.day-card'))
    .filter(c => !c.classList.contains('dimmed'));
  const idx  = visible.indexOf(card);
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');
  if (prev) prev.disabled = idx <= 0;
  if (next) next.disabled = idx >= visible.length - 1;
}


/* ── D1: showDrawer()
   Called at the end of every openDay() instead of directly
   adding the open class to the drawer.  Handles:
     1. Opening the drawer itself
     2. Opening the scrim overlay behind it
   The scrim element is optional — if a page has no scrim
   div the optional-chain (?.) prevents a crash.
────────────────────────────────────────────────────────── */
function showDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-scrim')?.classList.add('open');
}


/* ── D1: closeDrawer()
   Closes both the drawer AND the scrim.
   The scrim element is optional (?.) so pages without one
   do not crash.
────────────────────────────────────────────────────────── */
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-scrim')?.classList.remove('open');
  document.querySelectorAll('.day-card.active')
    .forEach(c => c.classList.remove('active'));
  currentCard = null;
}


/* ── Navigate prev / next  (T2 — filter-aware)
   Steps only through non-dimmed (visible) cards so arrow
   navigation respects the active week / phase filter.
────────────────────────────────────────────────────────── */
function nav(dir) {
  if (!currentCard) return;
  const visible = Array.from(document.querySelectorAll('.day-card'))
    .filter(c => !c.classList.contains('dimmed'));
  const next = visible[visible.indexOf(currentCard) + dir];
  if (next) openDay(next);  /* openDay defined in the plan-specific script */
}


/* ── Filter by week / phase ── */
function setFilter(phase, btn) {
  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.day-card').forEach(c => {
    c.classList.toggle('dimmed',
      phase !== 'all' && c.dataset.phase !== phase);
  });
  if (currentCard) updateNavButtons(currentCard);
}


/* ── Scroll to a week / phase group ── */
function jumpWeek(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}


/* ── Keyboard shortcuts  (T4 — input guard)
   The input guard prevents arrow keys from navigating the
   drawer while the user is typing in a text field.
────────────────────────────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'Escape')     closeDrawer();
  if (e.key === 'ArrowRight') nav(+1);
  if (e.key === 'ArrowLeft')  nav(-1);
});


/* ── D7: First-visit mobile pulse hint
   On mobile screens (≤ 600px), pulses the first card once
   on the very first visit so users understand cards are
   interactive. Fires only once — stored in localStorage.
   The CSS animation (.pulse-hint / @keyframes card-pulse)
   is defined in index.css.
────────────────────────────────────────────────────────── */
(function initPulseHint() {
  if (window.innerWidth > 600) return;
  if (localStorage.getItem('daydeck-visited')) return;

  /* Wait for the DOM to be fully ready */
  const run = function() {
    const first = document.querySelector('.day-card');
    if (!first) return;
    first.classList.add('pulse-hint');
    first.addEventListener('animationend', function onEnd() {
      first.classList.remove('pulse-hint');
      first.removeEventListener('animationend', onEnd);
    });
    localStorage.setItem('daydeck-visited', '1');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}());
