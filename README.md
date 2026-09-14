# maxtourvietnam

Independent TypeScript/React + Cloudflare D1 reconstruction of the public MAX TOUR Vietnam website.

Production target: `https://maxtourvietnam.viiversion.com`
Source reference: `https://maxtourvietnam.com`

## Stack

- React + TypeScript + Vite
- Cloudflare Worker
- Cloudflare D1
- Worker Static Assets
- GitHub Actions CI

## Structure

- `src/client` — public website UI and routes
- `src/worker` — same-origin API (`/api/*`) and static asset fallback
- `migrations` — D1 schema
- `seed/tours.sql` — source-backed tour catalog seed
- `wrangler.jsonc` — Cloudflare worker/assets/D1 configuration

## Current public routes

- `/`
- `/katalog-nyachang`
- `/premium-ekskursii-vetnam`
- `/vechernyaya-obzornaya-ekskursiya-po-nyachangu`
- `/ekskursiya-v-fuyen-iz-nyachanga`
- `/ekskursiya-v-dalat-na-2-dnya-iz-nyachanga`
- `/vip-ekskursiya-v-dalat-iz-nyachanga`
- `/ekskursiya-v-dalat-iz-nyachanga-premium`
- `/dnevnaya-obzornaya-ekskursiya-po-nyachangu`
- `/ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga`
- `/ekskursiya-baho-zoklet-iz-nyachanga`
- `/ostrov-hon-tam-nyachang`
- `/ostrov-orhidey-i-obezian-nyachang`
- `/dayving-i-snorkling-v-nyachange`
- `/ekskursiya-v-danang-iz-nyachanga`
- `/ekskursiya-v-saygon-iz-nyachanga`
- `/ekskursiya-v-fanrang-iz-nyachanga`

## Local development

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## D1

```bash
npm run db:migrate:local
npm run db:seed:local
```

The production deploy runner creates/reuses the `maxtourvietnam` D1 database, injects the real database id into a temporary Wrangler config, applies migrations, seeds the catalog, deploys the Worker/assets, attaches `maxtourvietnam.viiversion.com`, and runs production smoke checks.

## Media migration status

The first reconstruction references current source media hosted on Tilda CDN to preserve visual fidelity while the site is being rebuilt. Before retiring Tilda, approved media should be copied to VIIVERSION-controlled Cloudflare assets/R2 and the URLs updated.
