# StellarPlan Web

> The StellarPlan frontend — connect Freighter, and when your salary arrives the app puts rent, bills, and savings into protected on-chain plans, leaving only what you can safely spend.

<p align="center"><em>Next.js 15 · Freighter wallet sign-in · built for the Drips Stellar Wave program (testnet)</em></p>

[![CI](https://github.com/stellarplan/stellarplan-web/actions/workflows/ci.yml/badge.svg)](https://github.com/stellarplan/stellarplan-web/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Stellar](https://img.shields.io/badge/Stellar-Freighter-black)

---

## Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS — custom StellarPlan skeuomorphic design system
- **Animations**: Framer Motion (< 300ms, reduced-motion friendly)
- **Icons**: Lucide React + custom emoji vault icons
- **UI**: shadcn/ui-inspired primitives

## Quick start

One command creates `.env.local`, installs dependencies, and type-checks the
whole app via a build:

```bash
./scripts/setup.sh
```

Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 (the Freighter extension is required to sign in).

<details>
<summary>Manual steps (what the script automates)</summary>

```bash
cp .env.example .env.local
npm install
npm run dev
```

</details>

> The web app expects the API to be running at `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`). Edit it in `.env.local` if your API is elsewhere.

## Authentication

Sign-in is **Freighter wallet only** — no email, no password. The flow lives in
[`lib/freighter.ts`](./lib/freighter.ts):

1. Connect Freighter and read the wallet address.
2. Request a challenge from the API (`POST /auth/challenge`).
3. Sign the challenge message with Freighter (SEP-53 `signMessage`).
4. Exchange the signature for JWT tokens (`POST /auth/wallet`).

The same signed-challenge pattern gates breaking a vault early. Freighter must
be installed — the login screen links to it when it isn't detected.

## Architecture

```
        ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
 user ─▶│  web         │─────▶│  api         │─────▶│ PostgreSQL   │
        │  (this repo, │      │  (NestJS)    │      │              │
        │   Next.js)   │      └──────┬───────┘      └──────────────┘
        └──────┬───────┘             │
               │                     ▼
               │          ┌────────────────────────┐
               └─────────▶│ Stellar                │
             (Freighter   │ Horizon / Soroban RPC  │──▶ PlanVault contract
              signing)    └────────────────────────┘
```

The web app renders UI and handles Freighter signing; it calls the API for all
data and business logic. The API is what talks to PostgreSQL and the PlanVault
Soroban contract; the browser reaches Stellar directly only through Freighter.

## Screens

| Route | Screen |
|---|---|
| `/login` / `/signup` | Freighter connect + sign-in |
| `/onboarding` | "You're connected" welcome + next step |
| `/dashboard` | Balances + vault grid + recent activity |
| `/budgets/new` | 3-step plan creation wizard |
| `/plans` | Full vault list, search & filter |
| `/plans/:id` | Vault details + break vault (signed) |
| `/activity` | Complete financial timeline |
| `/settings` | Wallet, notifications, theme, log out |

## Design system

| Token | Value | Use |
|---|---|---|
| Moon Sand | `#F2EEE8` | page background |
| Soft Ivory | `#FCFAF6` | primary surface |
| Warm Clay | `#E9DFD2` | secondary surface, dividers |
| Deep Jade | `#0F8B6D` | primary actions, success |
| Burnished Copper | `#B76E3B` | locked vaults, premium actions |
| Forest Emerald | `#2C9C69` | success status |
| Amber Gold | `#D89B2B` | warnings |
| Deep Terracotta | `#B54848` | danger |

Typography: Fraunces (headings), Manrope (UI), IBM Plex Mono (numeric). All IDs & balances are tabular-mono.

Cards use a layered shadow (`0 18px 40px` / inner highlight) with a soft bevel — subtle skeuomorphism so vaults feel tangible without looking dated.

## Folder structure

```
app/               # Next.js routes (App Router)
├── page.tsx       # welcome → dashboard redirect
├── dashboard/
├── budgets/new/
├── plans/[id]/
├── activity/
├── settings/
└── login|signup|onboarding|welcome/
components/
├── plans/         # VaultCard, PlanWizard, BreakVaultModal, AllocationAnimation
└── common/        # AppShell (auth guard), NavShell (mobile/desktop nav), NumberTicker
lib/
├── api.ts         # Typed API client with token refresh
└── format.ts      # Money, date, icon helpers
```

## CI

Every push and pull request to `main` runs the [CI workflow](./.github/workflows/ci.yml):
a `build` job (`npm run build`) and a `lint` job (`npm run lint`). Use `build`
and `lint` as required status checks for branch protection on `main`.

## Related repositories

- [stellarplan-api](https://github.com/stellarplan/stellarplan-api) — NestJS backend this frontend calls for all data and business logic.
- [stellarplan-contracts](https://github.com/stellarplan/stellarplan-contracts) — the PlanVault Soroban contract behind the plans.

## Maintainers

| Name | Contact |
|---|---|
| StellarPlan Team | <!-- add Telegram/email --> |

<!-- Maintainer: replace the placeholder above with a real name and a Telegram handle or email. -->

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). `main` is
protected, so all changes land via pull request with CI green.

**Security:** please report vulnerabilities privately per [SECURITY.md](./SECURITY.md).

**License:** [MIT](./LICENSE).

## Contributors

[![Contributors](https://contrib.rocks/image?repo=stellarplan/stellarplan-web)](https://github.com/stellarplan/stellarplan-web/graphs/contributors)
