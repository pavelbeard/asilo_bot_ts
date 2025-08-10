# Asylum Helper Bot

Multilingual assistant helping Russian-speaking asylum seekers discover official appointment channels and learn general steps, without providing legal advice.

> Disclaimer: This bot only takes information from **policia.es** without any modification to the site

## Key Objectives

- Aggregate publicly available info about appointment channels (web links, phone numbers, offices).
- Offer step-by-step structured guidance in Russian.
- Deploy seamlessly on Vercel (As a serverless function)

## Features

| Area           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| Chat Flow      | Guided Q&A to narrow user needs (appointment type, location). |
| Knowledge Base | <https://policia.es>                                          |
| Localization   | RU primary                                                    |
| Privacy        | No storage of personal identifying info by default.           |

## Tech Stack

- Runtime: Node.js + TypeScript
- Deployment: Vercel (Edge Functions where suitable)
- Framework: Cheerio + Grammy
- Caching: LRU cache

## Project Structure (suggested)

```

/api
    /bot.ts
/utils
    /actions.ts
    /cache.ts
    /mapper.ts
```

## Environment Variables

| Variable              | Purpose                                                                        |
| --------------------- | ------------------------------------------------------------------------------ |
| ASILO_BOT             | Bot secret token                                                               |
| SERVERLESS (optional) | If you plan to deploy the project on Vercel, set any of values: [1, true, yes] |

Add them in Vercel dashboard or `.env.local` (never commit secrets).

## Deployment (Vercel)

1. Fork repository.
2. Set env vars in Vercel Project Settings.
3. Push to main (auto build).
4. Set the webhook by this way: <https://api.telegram.org/bot><BOT_TOKEN>/setWebhook?url=<HOST_URL>

## Usage (End User Flow)

1. List of provinces (Список провинций).
2. Choose province (e.g., "ÁVILA, MADRID, etc.).
3. User receives official links only (no automated booking attempts).

## Contributing

1. Create an issue for any content addition.
2. Add / update knowledge entry under `src/lib/kb/` with:
   - `id`
   - `locale`
   - `sources` (array of official URLs)
   - `updatedAt`
3. Run lint & type checks.
4. Open PR.

## Content Guidelines

- Cite only official, publicly accessible sources.
- No instructions to bypass queues or security.
- Avoid collecting personal identifiers.

## Scripts (example)

- `dev`: local development
- `test`: test the utils

## License

MIT. See LICENSE file.

## Quick Start

```bash

pnpm install
pnpm dev

```

Visit <http://localhost:3000>.

Stay transparent, cite sources, and protect user privacy.

---

Maintained with care for informational clarity and user safety.
