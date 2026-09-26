# AI Insight Engine — Frontend

A React + Vite frontend for an AI summarization and sentiment-analysis tool,
built from the spec in `frontend_details.txt`. Dark-mode-first, glassmorphism
UI with 'Orbitron' (headings) and 'Rajdhani' (body) fonts.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `lucide-react` for icons
- `axios` for HTTP calls
- `clsx` for conditional classNames

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

To build for production:

```bash
npm run build
npm run preview
```

## Backend

The UI expects a backend API at `http://127.0.0.1:8000/api/v1` with two
endpoints:

- `POST /summarize` — body `{ text, max_length, min_length }`, returns
  `{ summary }`
- `POST /sentiment` — body `{ text }`, returns `{ label, score }`

Update `API_BASE` in `src/App.jsx` if your backend runs elsewhere.

## Project structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── frontend_details.txt
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Note on Tailwind setup

The original spec's setup commands (`tailwind.config.js` + `postcss.config.js`
via `npx tailwindcss init -p`) target Tailwind v3. This project uses
Tailwind v4 instead, which drops those two config files in favor of the
`@tailwindcss/vite` plugin (registered in `vite.config.js`) plus a single
`@import "tailwindcss";` line and an `@custom-variant dark (...)` rule at the
top of `src/index.css` for class-based dark mode. The `orbitron` /
`rajdhani` font families and the `glow-indigo` / `glow-emerald` utility
classes from the spec are preserved as-is. Everything else — the component
code, layout, and behavior — is unchanged from the spec.
