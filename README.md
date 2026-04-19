# Jani AI Command Center — Simulation

Interactive AI platform simulation built by **ARQ ONE AI Labs** for **Jani Sales Pvt. Ltd.**

A working demo of five AI modules for a paper manufacturing and trading business, presented as one operating platform. Modelled on the live ARQ ONE demo pattern.

## Five modules

| Module | What it does |
| --- | --- |
| **PaperOps Copilot** | Ask anything on WhatsApp or web — in English, Hindi, or Gujarati. Answers pulled from YOUR SOPs, specs, and certificates. |
| **Reel Quality AI** | Reads GSM, brightness, moisture, and process signals. Flags quality drift during the run — not after. |
| **Dispatch & ETA Engine** | Connects stock across locations with QA release and truck readiness. Confidence score on every promise date. |
| **Certificate & Doc AI** | Auto-generate mill test certificates, customer questionnaires, and compliance packs. |
| **Sourcing Radar** | Tracks waste paper prices, vendor lot consistency, and lead times 7–21 days ahead. |

## Features

- Three-language toggle: **English / Hinglish / Gujarati**
- Live savings counter (simulated)
- Each module is a self-contained phased workflow (idle → processing → result)
- No backend required — pure React simulation for sales demos
- Single-file `App.jsx` — easy to extend or rebrand

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

Static output goes to `dist/`.

## Deploy to Vercel

**Option 1 — via Git (recommended):**

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Vite — keep defaults. Click **Deploy**.
4. You get a live URL like `janiops.vercel.app` in ~60 seconds.

**Option 2 — via CLI:**

```bash
npm install -g vercel
vercel         # first deploy (interactive)
vercel --prod  # subsequent production deploys
```

## Project structure

```
janiops/
├── index.html
├── package.json
├── vercel.json          # SPA rewrites
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx         # React root
    └── App.jsx          # Full app — all 5 modules, 3 languages, inline styles
```

## Design notes

- **Single file on purpose.** All five modules live in `App.jsx`. Extend by copying the pattern of any existing module.
- **Inline styles, no Tailwind or CSS framework.** Pick-up-and-rebrand is trivial — change the `C` colour object at the top.
- **No external chart library.** The price chart is a hand-drawn SVG `<path>` so the build has zero data-viz dependencies.
- **Fonts:** system sans for body, Georgia for headlines (gives the deck a printed-paper feel matching the Jani brand).

## Brand palette

| Token | Hex | Use |
| --- | --- | --- |
| `forest` | `#0B4F3C` | Primary — headers, CTAs, forest-green identity |
| `kraft` | `#C17A3F` | Accent — kraft-paper amber, live indicators |
| `cream` | `#F7F3ED` | Recycled-paper card backgrounds |

## Attribution

Built by **Rishi — ARQ ONE AI Labs**.
Website: [arqoneailabs.space](https://arqoneailabs.space)

---

This is a **simulation for sales conversations** — not a live production system. Data shown is illustrative.
