# Omar Bacho — Architecture portfolio

Architecture, interiors, objects and research, with searchable collections and six interactive Three.js studies.

## Local development

Use Node.js 22.13 or newer (Node 24 recommended).

```sh
npm ci
npm run dev
```

A normal clone uses the Nitro development server. The private Sites checkout retains its Cloudflare integration when `.openai/hosting.json` is present.

## Vercel

Import this repository with the repository root as the Root Directory. The checked-in `vercel.json` selects the build command and output; no environment secrets are required.

```sh
npm run build:vercel
```

This creates `.vercel/output/config.json`, static assets, and a server function that handles the home page, project pages, filters and direct links. Do not deploy `public/` or the Cloudflare `dist/` folder as a static site: neither contains the application entry point.

If an existing Vercel project has dashboard overrides, use Framework Preset **Other**, Build Command **npm run build:vercel**, and Output Directory **.vercel/output**. Redeploy the latest commit.

## Checks

```sh
npm test
npx tsc --noEmit
npm run build:vercel
npm run test:deployment
```

For a standalone Node server: `npm run build:node`, then `node .output/server/index.mjs`.

## Mobile and 3D

The portfolio adapts to narrow screens, tablets and landscape orientation. Model and image dialogs use the available device viewport with safe-area padding. Touch controls use one finger to orbit and two fingers to zoom/pan. Camera gestures are optional and require HTTPS, camera permission and a compatible browser. Detection runs in a worker; video stays on the device. The 3D studies are interpretive reconstructions, not surveyed or fabrication models.
