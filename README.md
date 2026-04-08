# DevPath — Study Planner

An interactive, zero-dependency study planner. No build step. Works on Vercel, Netlify, GitHub Pages, or any static host — or just open `index.html` directly in a browser.

## Deploying to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Framework: **Other** (leave blank), Output directory: leave blank
4. Click Deploy — done ✅

## Adding a New Study Plan

### Step 1 — Create a data file

Create `data/your-plan-name.js` with this structure:

```js
window.StudyPlans = window.StudyPlans || [];
window.StudyPlans.push({
  id:          "python-30day",        // unique ID (no spaces)
  title:       "Python 30-Day",       // shown in the nav tab
  emoji:       "🐍",                  // tab emoji
  subtitle:    "Zero to Intermediate",
  totalDays:   30,
  hoursPerDay: 1,
  description: "A 30-day Python journey for beginners.",

  phases: [
    { label: "Phase 1", title: "Foundations", days: [1, 30], color: "#34D399" }
  ],

  days: [
    {
      day:   1,
      week:  1,
      phase: "beginner",             // "beginner" | "intermediate" | "advanced"
      topic: "Setup & Hello World",
      whatToLearn: [
        "Install Python 3 and VS Code",
        "Understand the REPL vs running .py files",
        "Write your first print() statement"
      ],
      outcome: [
        "Python is installed and prints Hello World",
        "You know how to run a .py file from the terminal"
      ],
      sources: [
        { title: "Official Python Docs",    url: "https://docs.python.org/3/",        type: "docs"    },
        { title: "Python Tutorial – W3Schools", url: "https://www.w3schools.com/python/", type: "article" },
        { title: "Python for Beginners – freeCodeCamp (YouTube)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "video" }
      ]
    },
    // ... repeat for each day
  ]
});
```

### Step 2 — Link it in index.html

Open `index.html` and find the data files section (near the top of `<head>`). Add one line:

```html
<!-- ── Data files: add one <script> per new study plan ── -->
<script src="data/java-60day.js"></script>
<script src="data/python-30day.js"></script>  <!-- ← add this -->
```

That's it. The new tab appears automatically.

## Source types

Use one of these three values for `type` in your sources:

| type      | badge color | use for               |
|-----------|-------------|----------------------|
| `docs`    | blue        | official documentation |
| `article` | amber       | blog posts, tutorials  |
| `video`   | red         | YouTube, courses       |

## Keyboard shortcuts

| Key        | Action               |
|------------|----------------------|
| `→`        | Next day (in drawer) |
| `←`        | Previous day         |
| `Escape`   | Close drawer         |

## File structure

```
devpath/
├── index.html          ← the whole app
├── data/
│   ├── java-60day.js   ← Java plan (60 days)
│   └── your-plan.js    ← add new plans here
└── README.md
```
