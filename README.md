# DevPath — Study Planner & Reference Guide

DevPath is a local, zero-dependency, browser-based study planner and reference tool built for developers learning Salesforce and Java. It organises structured study plans and documentation into a single dark-themed interface with a fixed navigation bar, tab-based plan switching, a responsive card grid, and a slide-in detail drawer. There is no build step, no npm, no framework, and no server required. Every file is plain HTML, CSS, and vanilla JavaScript that you open directly in a browser.

---

## What the project looks like

The interface is a single fixed navigation bar at the top of the screen. Below it, the selected study plan or reference document fills the remaining viewport height inside an invisible iframe. Clicking any tab in the nav bar swaps the iframe's source — the nav bar never reloads or re-renders. Each study page is completely self-contained and handles its own filtering, scrolling, and drawer behaviour independently.

Inside each study page, content is organised into phase or week blocks. Each block contains a grid of day cards (or entry cards for the SLDS reference). Clicking a card slides in a detail drawer from the right side of the screen with full content: topics to study, a hands-on practice exercise, skills gained that day, and resource links. The drawer supports keyboard navigation — `←` and `→` arrows step through cards, `Escape` closes the drawer.

---

## Project structure

```
/
├── index.html                      ← Nav shell. The only file that loads in the browser directly.
├── index.css                       ← All styles for the entire project. No other CSS files.
├── README.md                       ← This file.
└── study/
    ├── java-60day.html             ← Java: Noob to Advanced — 60-day plan
    ├── lwc-30day.html              ← Lightning Web Components — 30-day plan
    ├── apex-30day.html             ← Salesforce Apex — 30-day plan
    ├── slds-doc.html               ← SLDS Reference Guide — 19 modules, 49 entries
    └── experience-cloud-30day.html ← Experience Cloud — 30-day plan
```

There are no subdirectories inside `study/`, no asset folders, no JavaScript files, and no external dependencies beyond two Google Fonts loaded via CDN in `index.css`.

---

## File-by-file explanation

### `index.html`

This is the only file you open in your browser. It is intentionally minimal — around 55 lines of HTML and 11 lines of JavaScript total.

Its job is:

1. Render the fixed navigation bar with the DevPath logo, the tab strip, and a hint label on the right.
2. Render the `<iframe>` that fills the rest of the screen below the nav bar.
3. Handle tab switching — when a tab is clicked, the iframe's `src` is updated to the tab's `data-src` attribute. That is the entirety of the JavaScript in this file.

The tab strip is a series of plain `<a>` tags inside a `div#nav-tabs`. Each tag has a `data-src` attribute pointing to its study file inside `study/`. To add a new plan, you add one `<a>` block here and create the corresponding file. Nothing else changes.

```html
<a class="nav-tab" data-src="study/your-plan.html">
  <span class="tab-dot" style="background: var(--green);"></span>
  🧠 Your New Plan
</a>
```

Current tabs in order:
- ☕ Java 60-Day → `study/java-60day.html`
- ⚡ LWC 30-Day → `study/lwc-30day.html`
- ☁️ Apex 30-Day → `study/apex-30day.html`
- ⚡ SLDS Reference → `study/slds-doc.html`
- 🌐 Experience Cloud 30-Day → `study/experience-cloud-30day.html`

---

### `index.css`

The single stylesheet for the entire project. Every style used by every file — the nav shell, the study pages, and the SLDS reference — lives here. No `<style>` blocks exist in any HTML file. No inline styles exist except for dynamic per-card accent colours (explained below).

The file is organised into clearly commented sections:

**Section 1 — Fonts & Tokens**
Imports JetBrains Mono and Syne from Google Fonts. Defines all CSS custom properties on `:root`: surface colours (`--bg`, `--surface`, `--surface2`, `--surface3`), borders, text shades, an accent palette (`--accent`, `--green`, `--blue`, `--purple`, `--red`), nav height, font references, and border radii.

**Section 2 — Reset**
Universal `box-sizing: border-box`, zeroed margins and padding, smooth scroll on `html`.

**Section 3 — Body**
The shared `body` rule applying the background colour, font family, and `overflow-x: hidden`. This is separate because it applies to both `index.html` and every `study/*.html` page.

**Section 4 — Nav Shell** *(index.html only)*
All styles for `.nav`, `.nav-logo`, `.nav-logo-icon`, `.nav-tabs`, `.nav-tab`, `.nav-hint`, `.frame-shell`, and `.content-frame`. None of these classes appear in any study page.

**Section 5 — Study Page Base** *(study/\*.html)*
Shared styles used by all study pages: `.hero`, `.hero-eyebrow`, `.hero-title`, `.hero-desc`, `.hero-stats`, `.stat`, `.filter-bar`, `.filter-btn`, `.filter-dot`, `.week-jump`, `.plan-body`, `.phase-block`, `.phase-header`, `.phase-tag`, `.phase-title`, `.phase-meta`, `.phase-line`, `.week-group`, `.week-header`, `.week-num`, `.week-name`, `.week-divider`, `.week-goal`, `.day-grid`, `.day-card` and all its state variants (`.active`, `.dimmed`, `.colored`), `.day-num`, `.day-topic`, `.phase-dot`, `.day-type`.

**Section 6 — Drawer** *(study/\*.html)*
All styles for the slide-in detail panel: `.drawer`, `.drawer-header`, `.drawer-top`, `.drawer-badge`, `.drawer-controls`, `.drawer-btn`, `.drawer-topic`, `.drawer-week-info`, `.drawer-body`, `.drawer-section-title`, `.learn-list`, `.learn-item`, `.learn-num`, `.learn-text`, `.outcome-list`, `.outcome-item`, `.outcome-check`, `.outcome-text`, `.source-list`, `.source-link`, `.source-badge` (`.badge-docs`, `.badge-article`, `.badge-video`, `.badge-trail`), `.source-name`, `.source-arrow`.

**Section 7 — Responsive**
Three breakpoints: `900px` (full-width drawer, reduced padding, hide week-jump), `600px` (hide `.nav-hint`), `480px` (smaller hero title, single-column day grid).

**Plan-Specific Overrides** *(bottom of file)*
Additional classes used only by specific study page types, all clearly commented:

- **Week accent colours (`w1`–`w4`)** — used by LWC and Apex plans. Card top bar, phase dot, drawer badge, phase tag, and filter dot colours for each of the four fixed weeks.
- **`.colored` + `--card-accent`** — a flexible system used by SLDS doc and Experience Cloud. Instead of hardcoded `w1`-`w4` class-based colours, these pages set `--card-accent: #hexcolor` as an inline style on each card. The `.colored` CSS class reads that variable. This allows any arbitrary colour without adding new CSS.
- **`.week-goal`** — the italic goal line shown below each phase/module header.
- **`.practice-block` / `.practice-text`** — the gold left-bordered exercise block in the LWC, Apex, and Experience Cloud drawers.
- **`.gain-tags` / `.gain-tag`** — the skill pill tags shown in the drawer's "Skills gained" section.
- **`.badge-trail`** — the cyan badge for Trailhead resource links.
- **`.search-bar` / `.search-input` / `.search-count`** — the search bar used only by `slds-doc.html`.
- **`.code-compare` / `.code-block-label` / `.slds-code-block`** — the before/after code comparison blocks in the SLDS reference drawer.
- **`.scenario-block`** — the blue left-bordered scenario description in the SLDS reference drawer.
- **`.notes-block`** — the key insight block in the SLDS reference drawer.
- **`.slds-class-tags` / `.slds-class-tag`** — clickable cyan class name pills in the SLDS drawer that copy to clipboard on click.
- **`.entry-id` / `.entry-module`** — the `1-3` style ID and module number shown on SLDS reference cards instead of day numbers.

---

### `study/java-60day.html`

A 60-day Java study plan structured into 2 phases (Noob to Medium, Days 1–30; Medium to Advanced, Days 31–60) across 8 weeks.

**Card data model:** Each day card stores all its content as `data-*` attributes directly on the `<div>` element:
- `data-day` — day number (1–60)
- `data-phase` — `beginner`, `intermediate`, or `advanced` (used for filter)
- `data-week` — week label string ("Week 1")
- `data-topic` — the topic title
- `data-learn` — JSON array of bullet points (what to learn)
- `data-outcome` — JSON array of expected outcomes
- `data-sources` — JSON array of `{t, u, b}` objects (title, url, badge type)

**Drawer sections:** What to learn today (numbered list) → Expected outcomes (checkmark list) → Resources (typed links).

**Filter:** by phase — all / beginner / intermediate / advanced. Phase is indicated by a coloured top bar on the card and a dot in the top-right corner using the fixed `w1`-`w4`... actually `beginner` / `intermediate` / `advanced` CSS class names.

**Week colours:** Fixed green (beginner), blue (intermediate), purple (advanced) — matching the `--green`, `--blue`, `--purple` CSS tokens.

**JS features:** `openDay()`, `closeDrawer()`, `nav(dir)`, `setFilter()`, `jumpToWeek()`. Keyboard: `←` `→` `Escape`.

---

### `study/lwc-30day.html`

A 30-day Lightning Web Components study plan across 4 weeks (LWC Foundations, Salesforce Data with Wire & Apex, Advanced Patterns, Production-Ready LWC).

**Card data model:** Same iframe-isolated approach, but with different `data-*` fields:
- `data-phase` — `w1`, `w2`, `w3`, or `w4` (maps to the four weeks)
- `data-week-label` — "Week 1", "Week 2", etc.
- `data-topics` — JSON array of topic strings
- `data-practice` — JSON string of the hands-on exercise paragraph
- `data-gains` — JSON array of skill tag strings
- `data-sources` — JSON array of `{t, u, b}` objects

**Drawer sections:** What to learn today → Practice (gold-bordered block) → Skills gained (pill tags) → Resources.

**Filter:** by week — all / week 1 / week 2 / week 3 / week 4. Each week has its own colour from the JSON (`#00d4ff`, `#7b61ff`, `#ff6b6b`, `#06d6a0`), matching the `w1`–`w4` CSS classes.

**Card colours:** Use the `w1`–`w4` CSS class system (fixed classes added in `index.css`'s overrides section).

**Special cards:** Day 30 (Capstone) gets a `🏆 capstone` label rendered at the bottom of the card via `.day-type`.

---

### `study/apex-30day.html`

A 30-day Salesforce Apex study plan across 4 weeks (Apex Foundations, OOP/SOQL/DML, Triggers/Async/Advanced, Testing/Security/Mastery).

Structurally identical to `lwc-30day.html`. Same data model, same drawer sections (topics → practice → gains → resources), same `w1`–`w4` colour system with the same four week colours from the JSON. Same capstone card on Day 30. The only differences are the content and hero text.

---

### `study/slds-doc.html`

This is a **reference document**, not a daily study plan. It has the most unique structure of any file in the project.

**Content:** 19 modules, 49 total entries covering the full Salesforce Lightning Design System — from foundations and spacing utilities through grid, typography, visibility, borders, buttons, forms, modals, notifications, icons, tables, tabs, accessibility, SLDS 2 styling hooks, and anti-patterns.

**Card data model:** Different from the study plans:
- `data-entry-id` — the `module-entry` string ID, e.g. `3-4`
- `data-mod-num` — module number
- `data-mod-title` — module title
- `data-level` — `beginner`, `intermediate`, or `advanced`
- `data-color` — arbitrary hex color from the JSON, applied via `--card-accent` inline style
- `data-scenario` — JSON string, the "why would you need this?" context
- `data-custom-css` — JSON string, the CSS you would write without SLDS
- `data-css-na` — `"true"` if `customCSS` is not applicable for this entry (skips the ❌ block)
- `data-slds-code` — JSON string, the SLDS equivalent code
- `data-notes` — JSON string, the key insight
- `data-slds-classes` — JSON array of class name strings (the clickable copy pills)
- `data-gains` — JSON array of skill tags
- `data-sources` — JSON array of resource links

**Card display:** Cards show the entry ID (e.g. `3-4`), the topic title, a coloured phase dot, and a `Module N` label at the bottom — no day number.

**Card colours:** Use the `--card-accent` / `.colored` system, not fixed `w1`–`w4` classes, because module colors are arbitrary hex values that don't match the fixed palette.

**Drawer sections:**
1. **Scenario** — blue left-bordered italic block explaining when you'd need this
2. **Code Comparison** — ❌ "Without SLDS" code block (skipped if not applicable) and ✅ "With SLDS" code block, both scrollable with a 240px max-height
3. **Key insight** — the `notes` field
4. **SLDS classes — click to copy** — cyan pill tags that copy the class name to clipboard on click, flash green with "✓ copied" for 1.5 seconds, then reset
5. **Skills gained** — standard gain pill tags
6. **Resources** — standard source links

**Filter:** by level — all / beginner / intermediate / advanced. Entries marked "Beginner → Intermediate" in the JSON map to `intermediate`.

**Search:** A search bar below the filter bar lets you type a keyword. It filters across topic name and SLDS class names in real time. The entry count updates as you type. Module blocks that contain zero visible entries auto-hide entirely. `Ctrl/Cmd + F` focuses the search input.

**JS features:** `openEntry()`, `closeDrawer()`, `nav(dir)`, `setFilter()`, `applyFilters()`, `handleSearch()`, `jumpTo()`, `copyClass()`, `escHtml()`, `hexToRgba()`. The `nav()` function here operates on the *currently visible* cards (respecting active filter and search), not all cards.

---

### `study/experience-cloud-30day.html`

A 30-day Salesforce Experience Cloud study plan across 4 weeks (Platform Foundations, Users/Security/Data, Custom Development, Advanced & Production-Ready).

Structurally identical to `lwc-30day.html` and `apex-30day.html` in terms of drawer sections and interaction model. The difference is the colour system — this plan's four week colours (`#0176D3` Salesforce blue, `#2E7D32` forest green, `#7b61ff` purple, `#E65100` orange) do not match the fixed `w1`–`w4` palette. So cards use the `--card-accent` / `.colored` inline approach instead, the same system used by `slds-doc.html`. This means no additional CSS was required when this plan was added.

**Notable content:** Week 1 covers Builder and platform foundations. Week 2 is heavily security-focused (sharing model, Guest User, OWD, Sharing Sets). Week 3 covers custom LWC and Apex development specifically for portal context (`lightningCommunity__Page` targets, `with sharing` enforcement, CSS layering). Week 4 covers audiences, SEO, deployment, and a capstone project building a full Customer Support Portal.

---

## How the drawer works (all study pages)

Every study page uses the same drawer pattern. The drawer is a `<div class="drawer" id="drawer">` positioned fixed at the right edge of the screen with `transform: translateX(100%)`. Adding the `.open` class transitions it to `translateX(0)` via a cubic-bezier animation.

All content displayed in the drawer is read from the clicked card's `data-*` attributes at click time. The drawer body (`id="d-body"`) is fully replaced with new HTML on every card click — there is no state beyond `currentCard` and the DOM. No data is fetched from any server or stored anywhere; everything that will ever appear in a drawer is already embedded in the HTML at page load as `data-*` attributes.

The drawer header shows a coloured badge (phase/week/module identifier), the topic title, and the week or module name. The prev/next navigation buttons step through cards in document order. On `slds-doc.html`, they step through the currently visible cards only (respecting any active filter or search).

---

## How to add a new study plan

**Step 1:** Create `study/your-plan.html`. The easiest approach is to copy `lwc-30day.html` or `apex-30day.html` as a starting point and replace the content. If your plan has arbitrary week colours (not matching `#00d4ff / #7b61ff / #ff6b6b / #06d6a0`), use the `--card-accent` + `.colored` approach from `experience-cloud-30day.html` instead of the `w1`–`w4` class system.

**Step 2:** Add one `<a>` block inside the `div#nav-tabs` in `index.html`:

```html
<a class="nav-tab" data-src="study/your-plan.html">
  <span class="tab-dot" style="background: var(--purple);"></span>
  🧠 Your Plan Name
</a>
```

Pick any colour for the dot: `var(--green)`, `var(--blue)`, `var(--purple)`, `var(--red)`, `var(--accent)`, or any hex value.

**Step 3:** That's it. No JavaScript changes. No CSS changes (unless your plan needs genuinely new UI elements). The tab appears automatically and clicking it loads your page in the iframe.

**If you need new styles:** Add a clearly commented block at the very bottom of `index.css` in the Plan-Specific Overrides section. Never add `<style>` blocks inside any HTML file.

---

## Design decisions

**Why an iframe architecture?** The iframe keeps each study page fully self-contained. Each page owns its own scroll position, filter state, and drawer state independently of the others. Switching tabs doesn't reset anything in the previously viewed page. The nav bar is always visible and never participates in the study page's layout.

**Why all data in `data-*` attributes?** Avoids any server, any build step, any JSON fetch, and any state management library. The page loads once, all content is immediately available, and clicking a card is near-instant because nothing is fetched at click time.

**Why one CSS file?** A single `index.css` is the contract between the nav shell and every study page. If a class exists in `index.css`, any study page can use it. This prevents style duplication and means you never need to audit multiple CSS files when changing something like spacing or a colour token.

**Why no `<style>` blocks in HTML files?** Inlining CSS in HTML files creates multiple sources of truth. When a style needs changing, you'd have to update it in every file. The single-file CSS approach means one change propagates everywhere immediately.

**Why vanilla JavaScript?** The entire interaction surface — tab switching, filter, drawer, keyboard nav, clipboard, search — is less than 120 lines of plain JS per file. A framework would add complexity, a build step, and a dependency chain for what is fundamentally a local HTML file.

---

## CSS design tokens (quick reference)

All tokens are defined on `:root` in `index.css`. Use these in any plan-specific styles you add.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#09090F` | Page background |
| `--surface` | `#101018` | Card background |
| `--surface2` | `#16161F` | Hover / active card |
| `--surface3` | `#1C1C28` | Active filter button |
| `--border` | `rgba(255,255,255,0.07)` | Subtle border |
| `--border2` | `rgba(255,255,255,0.13)` | Stronger border |
| `--text` | `#E2E2EE` | Primary text |
| `--muted` | `#6868A0` | Secondary text |
| `--muted2` | `#404068` | Tertiary / label text |
| `--accent` | `#F0C050` | Gold accent |
| `--green` | `#34D399` | Beginner / success |
| `--blue` | `#60A5FA` | Intermediate / info |
| `--purple` | `#C084FC` | Advanced |
| `--red` | `#F87171` | Error / destructive |
| `--nav-h` | `54px` | Nav bar height |
| `--font` | Syne | Body font |
| `--mono` | JetBrains Mono | Code / labels |
| `--radius` | `10px` | Card border radius |
| `--radius-sm` | `6px` | Button / input radius |

---

## Browser requirements

Any modern browser: Chrome, Firefox, Safari, Edge. No Internet Explorer. The only external requests made are the Google Fonts import in `index.css` and any resource links clicked inside the drawer. All content renders from local files with no network dependency beyond fonts.

To open the project locally, navigate to the project folder and open `index.html` directly in your browser. On most systems you can double-click the file. If iframes block local file loading in your browser (some Chromium builds restrict `file://` iframe sources), serve the folder with any static file server — for example `python3 -m http.server 8080` then visit `http://localhost:8080`.
