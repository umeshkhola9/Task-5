# Sochit Web Studio

**Internship Program of Web Development with HTML & CSS & JavaScript by ApexPlanet Software Pvt. Ltd.**

**Task 5 – Final Submission**
**Version: v1.0.0**

## 📌 Project Overview

Sochit Web Studio is a 7-page responsive website built entirely with HTML, CSS, and vanilla JavaScript. It was developed incrementally across a series of internship tasks — starting with page structure and styling, then adding interactive components (image slider, modal, form validation), a Weather App and a Todo List App, and finally a Task 4 pass focused on performance, SEO, and accessibility optimization.

Task 5 is the **final project preparation** stage: the codebase itself is unchanged in design, layout, and functionality. This task adds proper project documentation, a `.gitignore`, and deployment readiness so the project can be published and shared as a finished, submission-ready product.

## ✨ Features

- **7 fully responsive pages** — Home, About, Services, Contact, Portfolio, Weather, Todo
- **Dark / Light Mode** toggle, persisted across visits and synced with ARIA state
- **Weather App** — live current-weather lookup by city via the OpenWeatherMap API
- **Todo List App** — add, edit, delete, toggle, filter, and clear tasks, with `localStorage` persistence
- **Image slider/carousel** on Home and Portfolio pages
- **Modal popup** ("Get a Free Quote") on the Services page with accessible dialog behavior
- **Contact form validation** with inline error handling
- **Hamburger navigation menu** and **Back to Top** button on every page
- **Smooth scrolling** with keyboard focus management
- **SEO-friendly markup** — canonical URLs, meta descriptions, Open Graph/Twitter Card tags, multi-resolution favicons
- **Accessibility features** — ARIA roles/labels, semantic landmarks, keyboard-friendly interactions
- **Optimized images** — WebP versions of gallery/logo images with original-format fallbacks

## 🛠 Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — modular stylesheets (base, navbar, footer, responsive, plus one per page)
- **JavaScript (Vanilla, ES6+)** — no frameworks or build tools
- **OpenWeatherMap API** — external weather data
- **Browser `localStorage`** — theme preference and Todo list persistence

No build step, package manager, or server-side code is required — this is a static site.


## Pages

- `index.html` – Home
- `about.html` – About
- `services.html` – Services
- `contact.html` – Contact
- `portfolio.html` – Portfolio
- `weather.html` – Weather App
- `todo.html` – Todo List

## Folder Structure

```
Task 5 Final Submission/
├── index.html
├── about.html
├── services.html
├── contact.html
├── portfolio.html
├── weather.html
├── todo.html
├── README.md
├── .gitignore
├── favicon.ico
├── css/
│   ├── base.css
│   ├── navbar.css
│   ├── footer.css
│   ├── responsive.css
│   ├── home.css
│   ├── about.css
│   ├── services.css
│   ├── contact.css
│   ├── portfolio.css
│   ├── weather.css
│   └── todo.css
├── js/
│   ├── script.js
│   ├── darkmode.js
│   ├── slider.js
│   ├── storage.js
│   ├── ui.js
│   ├── validation.js
│   ├── api.js
│   ├── weather.js
│   └── todo.js
└── images/
    ├── logo.png / logo.webp
    ├── gallery1–4.jpeg / .webp
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    └── og-image.jpg
```

## Component Placement

| Component | Home | About | Services | Contact | Portfolio | Weather | Todo |
|---|---|---|---|---|---|---|---|
| Hamburger Menu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dark / Light Mode | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Back To Top Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image Slider | ✅ | | | | ✅ | | |
| Modal Popup (Get a Quote) | | | ✅ | | | | |
| Form Validation | | | | ✅ | | | |
| Smooth Scrolling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Weather App | | | | | | ✅ | |
| Todo List App | | | | | | | ✅ |

## JavaScript File Responsibilities

- `script.js` — shared page initialization (hamburger menu, nav, general setup).
- `darkmode.js` — dark/light theme toggle, persisted via `storage.js` and synced with ARIA attributes.
- `slider.js` — image slider/carousel logic for Home and Portfolio.
- `storage.js` — centralised `localStorage` helpers (`storageGet`, `storageSet`, `storageRemove`) with safe JSON parsing and a single source of truth for storage keys.
- `ui.js` — cross-page UI utilities: Back to Top button, smooth scrolling with focus management, Todo filter `aria-pressed` sync.
- `validation.js` — Contact form validation logic.
- `api.js` — `fetchWeatherData()`; wraps the OpenWeatherMap `fetch()` call with error handling.
- `weather.js` — Weather page controller: renders results, loading state, and last-searched-city persistence.
- `todo.js` — Todo List app: add/edit/delete/toggle tasks, filters, clear completed, task counter, persistence.
