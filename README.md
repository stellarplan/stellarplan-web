# StellarPlan Web

Frontend for the StellarPlan automatic financial planning platform.

Your salary arrives → StellarPlan instantly puts rent, bills, and savings into protected plans, leaving only what you can safely spend.

## Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS — custom StellarPlan skeuomorphic design system
- **Animations**: Framer Motion (< 300ms, reduced-motion friendly)
- **Icons**: Lucide React + custom emoji vault icons
- **UI**: shadcn/ui-inspired primitives

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Then open http://localhost:3000.

> The web app expects the API to be running at `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`).

## Authentication

Sign-in is **Freighter wallet only** — no email, no password. The flow lives in
[`lib/freighter.ts`](./lib/freighter.ts):

1. Connect Freighter and read the wallet address.
2. Request a challenge from the API (`POST /auth/challenge`).
3. Sign the challenge message with Freighter (SEP-53 `signMessage`).
4. Exchange the signature for JWT tokens (`POST /auth/wallet`).

The same signed-challenge pattern gates breaking a vault early. Freighter must
be installed — the login screen links to it when it isn't detected.

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
