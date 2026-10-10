# ITZ FIZZ — Cinematic Scroll Experience

React + Vite + Tailwind CSS v4 + GSAP ScrollTrigger. The hero uses a custom inline SVG sports-car illustration, so the visual asset is bundled and does not depend on a third-party image URL.

## Requirements
Node.js 20.19+ or 22.12+ recommended.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Motion architecture
- A short GSAP intro timeline reveals navigation, character-split headline, car illustration, editorial stats, and scroll cue.
- GSAP ScrollTrigger pins the hero stage and scrubs a multi-beat timeline based on real scroll progress. It animates the car's x/y position, scale and rotation, headline emphasis, statistics, road trail, secondary campaign line, and end stamp.
- `gsap.matchMedia()` adjusts the path and scroll distance for mobile.
- `prefers-reduced-motion` bypasses pinning and entrance motion.
- `useGSAP()` scopes GSAP selectors and cleans up context on unmount.

## GitHub Pages deployment
1. Create a **public** GitHub repository named `itz-fizz` (or any name; the workflow derives the repository name automatically).
2. Push the project root contents to the repository's `main` branch.
3. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Add `.github/workflows/deploy.yml` from this project and push it to `main`.
5. Wait for the Actions workflow to finish successfully. The URL will be `https://YOUR-USERNAME.github.io/itz-fizz/` for a repository named `itz-fizz`.
6. Replace the placeholder canonical URL and `og:url` in `index.html` with the final public URL if SEO metadata matters.

## Interaction QA checklist
- Desktop: scroll slowly through the pinned hero and confirm the car, title, stats, and final stamp follow scroll in both directions.
- Mobile: test at 390px and 320px widths; check the subject stays visible and the menu opens/closes.
- Enable OS reduced-motion preference and confirm the hero does not pin.
- Run `npm run build` before publishing.

## Asset note
The car is a custom inline SVG illustration created for this project rather than a photographic car asset. This avoids broken external image links and keeps the hero self-contained. Replace `HeroVisual.jsx` with a high-resolution transparent WebP/PNG if the brand requires photorealistic vehicle imagery.


## Cinematic driving sequence upgrade

The hero has been reworked into a single pinned, scroll-scrubbed GSAP journey:
- The side-profile car begins off-screen to the left and travels across the viewport to the right.
- ScrollTrigger pins the scene while the timeline coordinates the road, streaks, editorial copy, lime color beat, wheel details, and closing stamp.
- The timeline is reversible when scrolling upward.
- Travel distances are recalculated from the stage and rendered car width, with separate responsive tuning for mobile and desktop.
- The car is a self-contained, right-facing SVG asset embedded in `src/components/HeroVisual.jsx`; no external image URL or extra package is required.
- Reduced-motion preferences bypass the pinned driving sequence.

### Run locally

```bash
npm install
npm run dev
```

### Verify production build

```bash
npm run build
```

Note: the build command could not be verified in this environment because dependency installation did not complete. Please run the commands above locally before deploying.


## Premium motion refinement
- Removed the SVG wheel-group rotation that could make the tires jump/orbit because of SVG transform-origin behavior.
- The vehicle now stays grounded while the whole car is driven by the scroll-linked GSAP timeline.
- Added restrained body reflections, darker carbon detailing, sharper headlight highlights, and a softer road-level lime glow.
- The car remains a self-contained vector illustration; no broken external image URL or additional dependency was introduced.


## Real-time 3D sports car
The hero now loads a genuine GLB sports-car model with Three.js and GLTFLoader, rendered with a transparent background, physically based materials, and cinematic key/rim lighting. The model is authored facing +X so it reads correctly during the left-to-right GSAP scroll journey. The car itself is moved by the existing GSAP/ScrollTrigger wrapper; no autoplay car movement is used.

The 3D model is a CC0 asset from [Spectral GT RS](https://github.com/JaronKBragg7337/spectral-gt-rs). The GLB is loaded from the repository's raw file URL at runtime, so an internet connection is required when the hero first loads. If the model cannot be fetched or WebGL is unavailable, the existing vector car remains as a graceful fallback.

Install and run:
```bash
npm install
npm run dev
```
