# Changelog

## 1.1.0 — 2026-10-09

### Fixed
- **Users could be signed out when several requests expired together.** The API
  rotates refresh tokens, but each failing request started its own refresh, so
  all but the first used an already-spent token and failed. Refresh is now
  shared (one in flight at a time), and a request that fails after another
  request already refreshed retries with the newer token.
- A corrupted or unreadable `sp_tokens` entry in `localStorage` crashed the app
  on load. It is now treated as signed out.
- `formatMoney` rendered `$NaN` and `formatDate` rendered `Invalid Date` for bad
  input. They now return `$0.00` and a dash.

### Added
- First automated tests: 50 tests for formatting, the API client (token storage,
  refresh, errors), and the Freighter login and break-plan flows.
- CI jobs `test` and `typecheck`; `npm test` and `npm run typecheck` scripts.

## 1.0.0
- Initial Next.js app: Freighter login, plans, vaults, activity, notifications.
