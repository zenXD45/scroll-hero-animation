# Scroll-Driven Hero — WELCOME ITZFIZZ

A faithful, production-ready recreation of the reference hero at
[paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation),
built with Next.js, GSAP ScrollTrigger and Lenis for noticeably smoother scrolling.

**Live demo:** <https://zenxd45.github.io/scroll-hero-animation/>

## What it does

- **Pinned 200vh hero** with a sticky full-height track and a 200px dark road.
- **Scroll-scrubbed car** travels left → right as you scroll; the green trail grows behind it.
- **Letter-by-letter headline reveal** — the 15 letters of `WELCOME ITZFIZZ` light up as the car reaches them. The car travels far enough to reveal the final letter at every viewport.
- **Four stat cards** fade in on scroll at the reference milestones (400 / 600 / 800 / 1000 px), then stay visible.
- **Lenis smooth scroll** (`lerp: 0.08`) wired into ScrollTrigger, with a small scrub smoothing so the car and cards glide instead of snapping.
- **Responsive**: the headline stays centred and fully visible, and the cards keep clear gaps instead of overlapping on tablets and phones.
- **Reduced motion**: when `prefers-reduced-motion` is set, the page renders the finished composition with no scroll animation.
- **Accessible headline**: the animated letters are decorative (`aria-hidden`), with a real `<h1>` available to screen readers.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- React 18
- GSAP 3.12 + ScrollTrigger
- Lenis
- Tailwind CSS
- `next/font` (Inter for the app shell; the hero itself uses the reference's `sans-serif` stack so the type metrics match the demo)

## Run it

```bash
cd scroll-hero-animation
npm install
npm run dev
```

Open <http://localhost:3000>.

Production:

```bash
npm run build
npm start
```

## Deploy

Pushes to `main` are built as a static export and published to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Files

```
src/app/page.tsx       # hero markup + GSAP/Lenis behaviour
src/app/globals.css    # hero card styles, letter styles, responsive rules
src/app/layout.tsx     # app shell, fonts, metadata
src/app/icon.svg       # favicon
public/car.png         # McLaren 720S top-view artwork
```

## Tuning

- **Travel distance / reveal point**: `CAR_WIDTH` and `endX()` in `src/app/page.tsx`.
- **Scroll length**: the section is `200vh`; the track is pinned by ScrollTrigger.
- **Smoothness**: Lenis `lerp` (0.08) and the ScrollTrigger `scrub` values (0.6 car, 0.7 cards).
- **Card milestones**: the `windows` array in `src/app/page.tsx`.
- **Card layout**: `.hero-stat--1…4` and its media queries in `src/app/globals.css`.

## Verified

Checked in headless Chromium at 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024 and 390×844:
all 15 letters reveal, all four cards reach full opacity, the road stays pinned through the end,
there is no horizontal overflow and no card overlap. At 1920×1080 the geometry (headline width,
card positions/sizes, gaps and total scroll length) matches the reference pixel-for-pixel.
