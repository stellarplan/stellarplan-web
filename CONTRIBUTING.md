# Contributing to StellarPlan Web

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The web app expects the API at `NEXT_PUBLIC_API_URL` (see `.env.example`).

## Workflow

1. Branch from `main`.
2. Add or update a screen under `app/`, shared UI under `components/`, data access only via `lib/api.ts`.
3. `npm run build` must pass before opening a PR (it type-checks everything).
4. Conventional commits.

## Design system rules

- Use the palette tokens (`bg-jade`, `text-muted`, `bg-clay/...`) — no raw hex in components.
- Balances and IDs always use the `data-balance` attribute (IBM Plex Mono, tabular numbers).
- Vault surfaces use `.vault-card`; never roll a custom shadow/border for plan cards.
- Animations < 300 ms and must respect `prefers-reduced-motion`.
- Product language is "Plans / Protected / Release" — never "vault / smart contract / escrow" in UI copy.
