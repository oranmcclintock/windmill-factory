# `/fleet`

A deterministic, self-improving 7-agent harness that turns 1 to 3 sentence ideas or brain dumps into verified deliverables across GitOps and infrastructure, Tier 2 Windmill automations, standalone web or PWA apps, and general codebases.

## Architecture

### Tier 1 (Elephant Orchestrator and Goldfish Workers)
Antigravity runs `/fleet` (`.agents/skills/fleet/SKILL.md`) as the **Elephant** (maintaining `ELEPHANT_STATE.md` across multi-step missions and keeping its context window clean) while delegating to 7 specialized subagents and scoped `TypeName: "self"` Goldfish workers:
- `@scout` (`flash`): Read-only triage, one-shot repo recon, and replacement or secret-key audit.
- `@architect`: Zero-code domain-locked blueprints, parity inventories, formal invariants, and `ELEPHANT_STATE.md` Goldfish task queues.
- `@ui-ux`: `STYLE_BIBLE.md` (`Manpage Paper & Ink`) layout shells, 5-state matrices, and WCAG AA specs for `BUILD_APP`.
- `@ios-pwa`: iOS Safari and standalone PWA safe-area insets, `100dvh`, `>=16px` input sizing, and manifest or service worker specs for mobile `BUILD_APP` targets.
- `@builder` (and scoped `self` Goldfish): Parallel Windmill MCP draft builder (`@builder` for `WINDMILL_WORKFLOW`) and isolated `TypeName: "self"` Goldfish workers for multi-unit code, forensics, LaTeX, or presentation builds.
- `@red-team`: Clean-context adversarial auditor (`PASS`, `CONDITIONAL PASS`, or `BLOCK`).
- `@evolver` (`flash`): Post-mortem rule patcher that routes harness lessons to `META_RULES.md` and domain or repo lessons to `<target-repo>/AGENTS.md`.

### Tier 2 (Deterministic Runtime, When Warranted)
Self-hosted [Windmill](https://www.windmill.dev/) runs Python 3.13 Workflows as Code (`@workflow` and `@task`) with zero unattended LLM calls by default. Pure code, university coursework, GitOps, and standalone apps stay in their native toolchains rather than being routed through Windmill.

## Verification and safety

- Draft-first mutations: Live infrastructure, GitOps pushes, SSH targets, and external writes pause for explicit diff and approval gates.
- Closed-loop Gate A and Gate B: Every `CODE_OR_INFRA` and `BUILD_APP` task runs offline validators plus formal invariant or property-based checks (`hypothesis`, `fast-check`, `jqwik`, `proptest`) in Gate A so tests cannot be tautological happy-path mocks, then verifies the live end-to-end consumer path in Gate B with up to 3 self-repair iterations. Runs do not stop at `git push`.
- 3-Gate Windmill QA: `ruff check .`, `wmill lint`, and live MCP `test_run_*` plus `get_run` log checks.
- Native prose cleanup (`humanizer`) and coursework guardrails: User-facing docs, UI microcopy, slides, speaker scripts, PR descriptions, and commit messages run through `.agents/skills/humanizer/SKILL.md` in Step 3 and are checked by `@red-team` in Step 4. University coursework `.pptx`/`.docx` deliverables default to plain white student formatting on pass 1, capture real desktop GUIs at `2x` HiDPI (`QT_SCALE_FACTOR=2`), and strictly forbid synthetic or composited GUI screenshots.
- Public vs. private GEO (`--geo`): `BUILD_APP` blueprints declare `Visibility Class: PUBLIC | PRIVATE`. Private internal or homelab tools enforce `noindex, nofollow`; public sites require Schema.org JSON-LD, semantic landmarks, and `/llms.txt`, verified by `playwright-audit.mjs --geo`.

## Quickstart

1. Clone and symlink globally:
   ```bash
   git clone <repo-url> ~/windmill-factory
   ln -s ~/windmill-factory/.agents/agents ~/.gemini/agents
   ln -s ~/windmill-factory/.agents/skills/fleet ~/.gemini/config/skills/fleet
   ln -s ~/windmill-factory/.agents/skills/humanizer ~/.gemini/config/skills/humanizer
   ```
2. Optional — Auto-route any target repository into `/fleet`:
   Copy one of the drop-in starter files from `templates/repo-agents/` (`AGENTS.uni.md`, `AGENTS.app.md`, or `AGENTS.infra.md`) into your target repo's root `AGENTS.md`:
   ```bash
   cp ~/windmill-factory/templates/repo-agents/AGENTS.uni.md /path/to/uni-module/AGENTS.md
   ```
3. Optional Windmill Tier 2 setup:
   - Set your remote URL and workspace (defaults to `factory`) in `wmill.yaml`.
   - Connect the Windmill MCP server with `scopes: ["mcp:all", "mcp:session"]`.
   - Create `f/meta/notify` in your workspace if you use mobile approval or status pings.
4. Optional token-saving and web platform tooling:
   - Connect [`upstash/context7`](https://github.com/upstash/context7) for versioned library docs and [`oraios/serena`](https://github.com/oraios/serena) for symbol lookups in large repositories.
   - `BUILD_APP` tasks use [`GoogleChrome/modern-web-guidance`](https://github.com/GoogleChrome/modern-web-guidance) (`npx -y modern-web-guidance@latest`) on demand for Baseline native HTML, CSS, and JS patterns and `legacy-scan` audits.
5. Run `/fleet`: Paste a raw task, coursework brief, or brain dump in any repository, or invoke `/fleet <goal>`. Add `--auto` on a single `READ_ONLY` task to skip the Step 2 Go/No-Go pause.

## Repository map

- `AGENTS.md`: Always-loaded router (~3.4 KB)
- `META_RULES.md`: Global harness, coursework, Windmill WAC, and verification guardrails
- `STYLE_BIBLE.md`: Locked v1 `Manpage Paper & Ink` design system
- `.agents/skills/fleet/SKILL.md`: 7-step Elephant-Goldfish Commander state machine
- `.agents/skills/humanizer/SKILL.md`: Prose anti-slop pass for user-facing docs, slides, UI copy, PRs, and commits
- `.agents/agents/*.md`: 7 subagent definitions
- `templates/repo-agents/`: Drop-in `AGENTS.uni.md`, `AGENTS.app.md`, and `AGENTS.infra.md` starter files
- `templates/ui-kit/`: Reusable `tokens.css`, `BLOCKS.md`, and `playwright-audit.mjs` (`--pwa`, `--geo`, `--interactions`)
- `templates/infra-kit/`: Reusable `gate-a-k8s.sh` offline manifest validator
