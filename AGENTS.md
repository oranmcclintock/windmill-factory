# `/fleet` — Universal Multi-Agent Factory (`factory`)

This repository is the **Tier 1 Elephant-Goldfish Harness** for turning raw, unstructured 1–3 sentence ideas, tasks, or coursework briefs into tested, audited, deterministic deliverables across **Codebases & University Coursework**, **Standalone Web/PWA Apps**, **GitOps/Infrastructure**, and **Tier 2 Workflows** running on self-hosted Windmill (workspace `factory`).

## Zero-Prompting Auto-Routing (Default Behavior)
- **Treat any raw brain dump, task, coursework brief, or architecture idea pasted in this workspace as an implicit `/fleet` mission.**
- Immediately enter the `/fleet` Commander loop (`.agents/skills/fleet/SKILL.md`) starting with `@scout` with zero extra prompting — **never** ask whether the user meant Windmill AI agents (`ai_agent`) or the Fleet, and **never** ask the user to name repos or tell you to inspect first.

## Two-Tier Split (Elephant Brain vs. Goldfish Workers & Runtime)
- **Tier 1 — Antigravity (`/fleet` Elephant & Goldfish Subagents):** The Commander operates as the **Elephant** (maintaining `ELEPHANT_STATE.md` on 3+ task missions and protecting its context window) while delegating triage, blueprints, parallel implementation, 3-gate/Gate A+B QA, and self-improvement to `.agents/agents/{scout,architect,ui-ux,ios-pwa,builder,red-team,evolver}.md` and scoped `TypeName: "self"` Goldfish workers.
- **Tier 2 — Windmill `factory` (Deterministic Runtime — Only When Warranted):** Deterministic Python 3.13 (defaulting to **Workflows as Code** via `@workflow` / `@task`), Bash, or TypeScript scripts and flows handling retries, checkpoints, state, webhooks, schedules, and mobile approval gates. **Zero pay-per-token LLM API calls** in deployed Windmill workflows unless explicitly justified and approved in the Blueprint.

## Hard Safety & Verification Rules
- **Zero secrets in Git:** Never commit tokens, passwords, `.env` files, or `.agents/mcp_config.json`. Store runtime credentials in Windmill Resources/Variables (`wmill.get_resource(...)` / `wmill.get_variable(...)`) and never store root infra keys in `factory`.
- **Draft-first for mutations:** Read-only/sandboxed workflows may auto-deploy after `@red-team` passes. Anything mutating live infra, SSH targets, GitOps repos, or external state **must stay as a draft** with diff review before deployment.
- **Closed-Loop Verification (Gate A/B + 3-Gate Windmill + `humanizer`):** Enforce Gate A (including formal invariant/property-based tests), Gate B (live runtime / `playwright-audit.mjs`), Windmill 3-gate QA (`ruff check .`, `wmill lint`, live MCP `test_run_*` + `get_run`), and `.agents/skills/humanizer/SKILL.md` on user-facing prose/slides before handoff.
- **Subagent Integrity (No Bogus Tool Aliases / Fix-Before-Run):** Never put unverified tool names or group aliases in `.agents/agents/*.md` `tools:` frontmatter. If any subagent fails to construct or validate, STOP and fix the definition file on disk first—never silently bypass a broken agent file with a runtime override.

## Progressive Context Map (Load On Demand)
- **Engineering, Coursework, WAC & Infra Guardrails:** `META_RULES.md`
- **UI/UX Constitution:** `STYLE_BIBLE.md` (`LOCKED v1 — Manpage Paper & Ink`) + `templates/ui-kit/tokens.css`
- **Fleet Orchestrator & Prose Cleanup:** `.agents/skills/fleet/SKILL.md` + `.agents/skills/humanizer/SKILL.md`
- **Subagents:** `.agents/agents/scout.md`, `architect.md`, `ui-ux.md`, `ios-pwa.md`, `builder.md`, `red-team.md`, `evolver.md`
- **Target Repo Starter Templates:** `templates/repo-agents/AGENTS.uni.md`, `AGENTS.app.md`, `AGENTS.infra.md`
- **Windmill Reference Docs (On-Demand Only):** `AGENTS.wmill.md` and `reference/windmill-skills/`
