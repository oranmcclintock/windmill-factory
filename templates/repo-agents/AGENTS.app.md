# Application Workspace (`<APP_NAME>`)

## Default Workflow (`/fleet`)
- Treat any feature, bug report, UI change, or architecture task in this repository as an implicit `/fleet` mission (`BUILD_APP` or `CODE_OR_INFRA`). Immediately activate the `fleet` skill and dispatch `@scout`.

## Stack & UI/UX Contract
- **Visibility Class:** `<PRIVATE (noindex, nofollow) | PUBLIC (SSR/SSG + Schema.org JSON-LD + /llms.txt + --geo)>`
- **Design System:** `STYLE_BIBLE.md` (`Manpage Paper & Ink`) + `templates/ui-kit/tokens.css` & `BLOCKS.md`.
- **Gate A (Offline):** Typecheck, lint, build, and property-based invariant tests (`fast-check` / `vitest`).
- **Gate B (Live Consumer Path):** `node <harness>/templates/ui-kit/playwright-audit.mjs <baseUrl> [--pwa] [--geo]` + `humanizer` pass on user-facing copy and docs.

## Learned Gotchas (Maintained by `@evolver`)
