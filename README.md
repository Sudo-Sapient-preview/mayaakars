# Mayaakars Website

Next.js 16 production site for Mayaakars, with static marketing pages, project/service detail routes, and server-side form handlers for contact and career submissions.

This repo intentionally uses the webpack build path for deployment commands so it avoids Turbopack-specific font resolution issues that can appear on some non-Vercel hosts.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP
- Standalone Next.js output for non-Vercel hosting

## Requirements

- Node.js `>=20.9.0`
- npm

## Environment Variables

Copy `.env.example` to `.env` and fill in the values you need:

```bash
NEXT_PUBLIC_SITE_URL=https://www.mayaakars.com
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_CAREERS_WEBHOOK_URL=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is used for metadata, sitemap, and robots output.
- `GOOGLE_SHEETS_WEBHOOK_URL` handles the contact form.
- `GOOGLE_CAREERS_WEBHOOK_URL` handles the careers form.
- If a webhook is unavailable, submissions fall back to local JSONL files under `data/`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run lint
npm run build
```

This project now cleans `.next`, regenerates project data, and builds a fresh production bundle each time.
The build command uses `next build --webpack` for better compatibility on Hostinger and similar hosts.

## Hostinger Deployment

This project is **not** a static export. It uses Next.js server routes (`/api/contact`, `/api/careers`), so you need a Hostinger setup that can run a Node.js app.

Use one of these:

- Hostinger Node.js hosting
- Hostinger VPS
- Any Hostinger plan where you can run a persistent Node process

Do not deploy this as plain shared static hosting unless you remove the server routes.

### Recommended Hostinger Flow

1. Install dependencies on the server:

```bash
npm install
```

2. Set the environment variables from `.env.example`.

3. Build the standalone bundle:

```bash
npm run build:standalone
```

4. Start the production server:

```bash
npm run start:standalone
```

The standalone build script copies `public/` and `.next/static/` into `.next/standalone/`, which makes the deployment folder self-contained for non-Vercel hosting.

## Form Submission Fallbacks

If webhook delivery fails, submissions are written locally:

- `data/contact-leads.jsonl`
- `data/career-applications.jsonl`

Important:

- Keep the webhook URLs configured in production if you want submissions sent to Google Apps Script immediately.
- If your Hostinger environment has limited or non-persistent local storage, do not rely on the fallback files as the final destination.

## Useful Commands

```bash
npm run clean
npm run lint
npm run build
npm run build:standalone
npm run start:standalone
```
