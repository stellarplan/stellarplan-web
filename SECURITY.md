# Security Policy

## Reporting a vulnerability

Email: security@stellarplan.app (or open a private GitHub security advisory).

Do **not** open public issues for security problems.

## Notes

- Access/refresh tokens are stored in `localStorage` under `sp_tokens`. Do not weaken
  this into cookies with JS access, and never send tokens to third-party origins.
- `NEXT_PUBLIC_API_URL` is public by design — never put secrets in `NEXT_PUBLIC_*` vars.
- Wallet addresses shown in the UI are Stellar **public** keys; treat private key
  entry fields as a red flag in any contribution.
