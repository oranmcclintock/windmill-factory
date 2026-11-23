---
name: fleet
description: >-
  Default multi-agent engineering workflow (/fleet) for turning raw brain dumps, tasks, bug reports,
  migrations, or app specs into verified deliverables across CODE_OR_INFRA, WINDMILL_WORKFLOW, and
  BUILD_APP. Activate this skill first whenever the user gives a coding, infrastructure, GitOps,
  Windmill, or web/PWA building task (or types /fleet) to orchestrate @scout, @architect, @ui-ux,
  @ios-pwa, @builder, @red-team, and @evolver with Gate A/B and 3-gate Windmill verification.
---

# `/fleet` — Tier 1 Windmill Factory Commander

Invoke explicitly with `/fleet <raw brain dump or task goal>` (add `--auto` on a single `READ_ONLY`/low-risk task to skip the Step 2 Go/No-Go pause), or **implicitly whenever a raw 1–3 sentence dump, task, or architecture idea is pasted in this workspace**.

## Zero-Boilerplate Intake
- Flow raw 1–3 sentence dumps **straight into `@scout` -> `@architect` -> `@builder` -> `@red-team` -> `@evolver`** with zero preamble or boilerplate questions.
- **Never** ask whether the user meant Windmill AI agents (`ai_agent`) or the Fleet, never ask which repos to inspect, and never stall for clarifications before `@scout` has triaged the workspace and live Windmill inventory.

## Core Architecture & Guardrails
- **Elephant-Goldfish Orchestration:** The Commander operates as the **Elephant** (maintaining global mission state, architectural decisions, and rubric/acceptance checklists while protecting its context window from raw execution noise). Subagents operate as **Goldfish** (stateless, single-purpose workers given a strict 4-part brief: `1. Objective`, `2. Exact Files/Context`, `3. Constraints`, `4. Definition of Done`).
  - **Persistent State (`ELEPHANT_STATE.md`):** On any multi-phase mission with 3+ work units (e.g., university coursework, multi-service migrations, full app builds), maintain `ELEPHANT_STATE.md` in the target workspace root (`Goal & Deliverables`, `Rubric / Verification Checklist`, `Architecture & Interfaces`, and `Task Queue` with `[ ]` / `[/]` / `[x]`) and update it after each Goldfish completes so sessions can pause/resume with zero context rot.
- **Two-Tier Split:** Antigravity (Tier 1) is the brain/builder (reasoning, architecture, parallel build, QA). Windmill `factory` (Tier 2) is the deterministic runtime (Python 3.13 **Workflows as Code** by default, visual DAG flows only when primarily chaining existing scripts/Hub items; **zero pay-per-token LLM calls** unless explicitly approved).
- **Safety & Draft-First:** Never commit secrets, never store root infra keys in `factory`, and never auto-deploy workflows mutating live homelab infra, SSH targets, or GitOps repos.
- **Anti-Slop:** Zero emojis in code/UI, no speculative abstractions, no neon UI slop, no synthetic/forged GUI screenshots, and plain student formatting on academic `.pptx`/`.docx`/report deliverables.
- **Subagent Integrity (No Bogus Tool Aliases / Fix-Before-Run):** Never put unverified tool names or group aliases in `.agents/agents/*.md` `tools:` frontmatter. If any subagent fails to construct or validate, STOP and fix the definition file on disk first—never silently bypass a broken agent file with a runtime override.
- **Global Symlink Pathing:** When `/fleet` is invoked from another repo, resolve harness files (`META_RULES.md`, `STYLE_BIBLE.md`, `.agents/agents/`, `.agents/skills/humanizer/`, `templates/`, `reference/windmill-skills/`) from the `windmill-factory` harness root (via the symlinked `.agents/skills/fleet` target) rather than the caller's CWD. Load `reference/windmill-skills/` on demand only.

---

## 7-Step Commander State Machine

### Step 1: Triage & Recon (`@scout`)
1. Immediately dispatch `@scout` (`.agents/agents/scout.md`) via `invoke_subagent` with the user's raw dump or goal.
2. **Parallel Commander CLI Recon (`CODE_OR_INFRA` / `BUILD_APP`):** Because custom `.agents/agents/*.md` subagents lack `run_command`, when the prompt touches local repos or live infra, run a single batched read-only shell recon **in parallel** with `@scout` (`git status --short` dirty-tree check, recent `git log` on the target path, full commit message/diff of any prior revert touching that area — never `--stat` alone — plus live cluster/runtime state) and pass those results straight to `@architect`. Keep recon stdout bounded (`--stat`, `head`, `grep`) to avoid token bloat, while always preserving full exit codes and error tails for Gate A/B. When `context7` or `serena` MCPs are connected, prefer them for versioned library docs and large-repo symbol lookups instead of full-file reads or web scraping.
3. `@scout` performs **targeted one-shot read-only local repo inspection** (reading repo `AGENTS.md` index + only the key manifests/files directly relevant to the prompt, skipping unrelated repos), and runs **conditional Windmill MCP recon ONLY if the prompt clearly involves Windmill or fits `WINDMILL_WORKFLOW`** (never inventing companion Windmill workflows for pure code/GitOps/uni tasks). **Never pause to ask permission to read local files, and never emit `RESEARCH_SPIKE` for local file inspection.**
4. `@scout` classifies surviving items into universal buckets (`CODE_OR_INFRA`, `WINDMILL_WORKFLOW`, `BUILD_APP`, `RESEARCH_SPIKE`, `IGNORE`) and **auto-chains straight into Step 2 (`@architect`)** for every clear `CODE_OR_INFRA`, `WINDMILL_WORKFLOW`, or `BUILD_APP` item (only pause at Step 1 if a multi-idea brain dump contains 3+ distinct competing build candidates that genuinely need user prioritization).

### Step 2: Spec & DAG Compilation (`@architect` + `BUILD_APP` Specialists)
1. Immediately dispatch `@architect` (`.agents/agents/architect.md`) with `@scout`'s grounded findings, Commander CLI recon, and assigned bucket(s) (in parallel if multiple independent items). For `BUILD_APP` items introducing new views, layouts, or interaction flows, **dispatch `@ui-ux` (`.agents/agents/ui-ux.md`) in parallel** — plus **`@ios-pwa` (`.agents/agents/ios-pwa.md`)** whenever mobile/PWA layout, manifest, or touch/viewport behavior is touched (skip both on trivial single-file copy/style fixes to save tokens). `@architect` commits to an opinionated single plan strictly for the assigned bucket:
   - `CODE_OR_INFRA`: target repo's native toolchain and deterministic lint/test gates + formal invariants/property-based tests on stateful logic (never bolting Windmill onto non-Windmill tasks or placing app/DB stacks in cluster monitoring/alerting critical paths). For **University Coursework** with 3+ tasks, compile the rubric bands (e.g., High 1st `80–100%` criteria), artifact list, and atomic Goldfish task queue for `ELEPHANT_STATE.md`.
   - `WINDMILL_WORKFLOW`: Windmill Python **Workflows as Code** (`@workflow` / `@task`) by default (visual DAG flow only when primarily chaining existing scripts/Hub items) + 3-gate Windmill QA.
   - `BUILD_APP`: target standalone UI / web app stack, `Visibility Class: PUBLIC | PRIVATE` (enforcing `noindex, nofollow` on `PRIVATE` internal/homelab apps, and full GEO `/llms.txt` + Schema.org JSON-LD + `--geo` audit on `PUBLIC` apps), `STYLE_BIBLE.md` (`Manpage Paper & Ink`) + `templates/ui-kit/tokens.css`, `@ui-ux` 5-state/layout contract (+ `@ios-pwa` contract when applicable), and native build/Playwright gates.
2. Present `@scout`'s compact Triage & Reuse summary together with `@architect`'s (and `@ui-ux`/`@ios-pwa`'s) domain-locked blueprint(s), safety class (`READ_ONLY` vs. `MUTATING`), concise assumptions, approval/cutover gate (pairing `f/meta/notify` + Suspend/Approval only for `WINDMILL_WORKFLOW`), and verification contract. If the mission has 3+ work units, write/update `ELEPHANT_STATE.md` in the workspace root.
3. **PAUSE ONCE for user Go/No-Go** with a complete, grounded blueprint ready for `go`. Commit to concrete defaults derived from local/live ground truth — **never** append trailing numbered Q&A menus for facts inspectable on disk or in live state; invite inline overrides on `go` instead. *(Exception: on new React 19+ `BUILD_APP` projects, include a single inline prompt asking whether to use `@astryxdesign/core` themed with `STYLE_BIBLE.md` or standard Tailwind/shadcn primitives.)*

### Step 3: Parallel Build & Self-Repair (`@builder` & Scoped `self` Goldfish)
1. **Execution Routing (Protect the Elephant's Context):**
   - For `WINDMILL_WORKFLOW`: Fan out `@builder` (`.agents/agents/builder.md`) in parallel for Windmill MCP draft creation.
   - For small/direct `CODE_OR_INFRA` / `BUILD_APP` edits (1–2 files): The Commander executes file edits and local CLI gates directly.
   - For **multi-unit or context-heavy local tasks** (e.g., 2+ independent modules, large PCAP/video/dataset forensics, LaTeX/flashcard/mock-exam unit extraction, or generating `.pptx`/reports in university coursework): Fan out parallel **`TypeName: "self"` Goldfish subagents** (which inherit `run_command` and file-write tools) with a strict 4-part atomic brief (`1. Objective`, `2. Exact Files to Read/Write`, `3. Constraints`, `4. Verification Command`) and update `ELEPHANT_STATE.md` (`[/]` -> `[x]`) as each Goldfish completes. Never pollute the Elephant's main context with raw 25k-line dumps or heavy file generation.
   - For `BUILD_APP` tasks involving dialogs, popovers, forms, animations, or modernizing an existing web repo, query `npx -y modern-web-guidance@latest search "<query>"` / `retrieve "<id>"` (or `legacy-scan .` on existing web apps) on demand to use Baseline native web APIs over legacy JS workarounds.
   - **Prose & Coursework Deliverable Discipline (`humanizer` + Bland Student Style + HiDPI Real Screenshots):** When authoring or editing user-facing prose docs (`README.md`, setup guides, runbooks, client deliverables, coursework reports/slides/speaker scripts), UI copy, PR descriptions, or commit messages, load `.agents/skills/humanizer/SKILL.md` in Embedded/File mode before Gate A to strip AI writing tells (keeping code blocks, commands, paths, YAML, citations, and exact forensic numbers intact; **never** run `humanizer` on harness/agent/rule files `AGENTS.md`, `META_RULES.md`, `STYLE_BIBLE.md`, `SKILL.md`, or `.agents/agents/*.md`). For **University Coursework** presentations/reports (`.pptx`/`.docx`), enforce **Bland Student Styling** on pass 1 (plain `#FFFFFF` background, standard system font `Calibri`/`Arial`, simple 1pt grey tables, zero colored badges/cards/dark banners, zero robotic section headers like *"Stage 1A/1B"* or *"Epistemic Matrix"*). When capturing GUI screenshots (e.g., Wireshark) via headless X11/Wayland, always use **2x HiDPI scaling** (`QT_SCALE_FACTOR=2`, `GDK_SCALE=2`, 192 DPI) with tightly framed/maximized windows, and **never fabricate or composite fake GUI screenshots** from PDF crops or PIL mockups (if a proprietary GUI binary like Packet Tracer is not installed, generate the copy-paste config + 3-step student capture instructions instead).
2. For `WINDMILL_WORKFLOW`, `@builder` writes Windmill drafts via MCP and verifies **Gate 3** (`test_run_script` / `test_run_flow` against `@architect`'s mock payload + `get_run` log check; self-repair cap: **3 iterations max**). Commander then mirrors/syncs the draft to `f/` (via `wmill sync pull` or direct write) and runs **Gate 1** (`ruff check .`) and **Gate 2** (`wmill lint`, also enabled via `lint: true` in `wmill.yaml`).
3. Collect all draft paths/URLs, verbatim Gate A / lint stdout + exit codes, `git diff`, test run IDs, repair counts, and Windmill MCP `diff` outputs.

### Step 4: Adversarial QA & Deployment Gate (`@red-team`)
1. Dispatch `@red-team` (`.agents/agents/red-team.md`) with clean context, passing `@architect`'s acceptance contract + verbatim Gate A / lint stdout + exit codes + `git diff` (and for `WINDMILL_WORKFLOW`: `@builder`'s drafts, MCP `diff`, and `test_run_*` / `get_run` job IDs).
2. `@red-team` independently audits the verbatim CLI proofs, MCP `diff` / `get_run` logs, formal invariant/property test coverage (rejecting tautological happy-path mocks), replay safety, secret hygiene, draft-first rules, and anti-slop/humanizer rules.
3. **If `VERDICT: BLOCK`:**
   - For `CODE_OR_INFRA` / `BUILD_APP`: Commander patches surgically, re-runs Gate A, and re-verifies with `@red-team`.
   - For `WINDMILL_WORKFLOW`: Send exact blocking defects back to `@builder` via `send_message` — **except** if `@builder` already used >=2 repair iterations (or on cycle 2), spawn a fresh Goldfish `@builder` with only `@architect`'s Blueprint, current `diff`, and numbered `BLOCK` defects (**cap: 2 audit-fix cycles**, then escalate to user).
4. **If `VERDICT: PASS` (or user-accepted `CONDITIONAL PASS`):**
   - **`WINDMILL_WORKFLOW` (`READ_ONLY` / sandboxed):** Auto-deploy to `factory` via Windmill MCP `deploy_workspace_item`.
   - **`WINDMILL_WORKFLOW` (`MUTATING` — live infra, SSH, GitOps, external writes, destructive):** Keep as **draft**, print exact Windmill MCP `diff` + Windmill editor URL, and wait for explicit user deploy approval.
   - **`CODE_OR_INFRA` / `BUILD_APP`:** Present exact diffs + Gate A verification results, obtain explicit approval before any `git commit` / `git push` / deploy, and immediately proceed to **Step 5**.

### Step 5: Live Gate B Verification & Self-Repair (`CODE_OR_INFRA` / `BUILD_APP`)
- **Never stop at `git push`** or hand the user manual verification commands (`kubectl`, `curl`, "open UI and check") as a handoff.
- After any approved `push`, `deploy`, or runtime execution for `CODE_OR_INFRA` / `BUILD_APP`, the Commander MUST execute:
  1. **Verify the End-to-End Consumer Path:**
     - *Services / GitOps:* Poll the actual target runtime AND query through the exact consumer/user-facing interface using provisioned IDs/routes/configs (never bypass the app layer directly to a backend).
     - *`BUILD_APP` UI:* Run `templates/ui-kit/playwright-audit.mjs` (passing `--pwa` for mobile/PWA targets and `--geo` for `PUBLIC` apps) at `1440x900` and `390x844` verifying zero `console.error`/`pageerror`/`>=400` responses, `document.fonts.ready`, zero horizontal overflow (`scrollWidth <= innerWidth`), computed token styles, zero `axe-core` serious/critical violations, and screenshot sanity check.
     - *University / CLI / Consulting:* Run the exact target runtime/autograder/acceptance test suite against real I/O or staging environment.
  2. **Diagnose & Self-Repair (cap: 3 iterations):** If live state is degraded, out of sync, crashing, or returning empty/wrong data, inspect the exact live events/logs, diagnose root cause, patch locally, re-run Gate A, and ask to commit/push the fix. Never force-delete or run destructive runtime commands without explicit approval.
  3. **Gate B Proof Before Completion:** Only report completion or advance to a Phase 2 cutover after Gate B is proven green from live consumer-path output.

### Step 6: Self-Improvement Loop (`@evolver`)
1. Trigger `@evolver` (`.agents/agents/evolver.md`) after **every** build pass or follow-up repair loop where `@builder` or Step 5 used 1+ repair iterations, `@red-team` issued a `BLOCK`, or the user gave explicit critique or reported a live bug.
2. Always pass the **target repo path and `<target-repo>/AGENTS.md` path** to `@evolver` so domain/stack gotchas route strictly to `<target-repo>/AGENTS.md` and only `/fleet` harness rules route to `META_RULES.md` or `.agents/agents/*.md`.
3. Present `@evolver`'s minimal 1–3 line unified diffs (`META_RULES.md`, `STYLE_BIBLE.md` only on explicit UI/feel feedback, `<target-repo>/AGENTS.md`, or `.agents/agents/*.md`) and wait for user approval before committing.

### Step 7: Mission Handoff
Return a concise summary containing:
- Live Windmill UI / webhook / draft review URLs (or deployed service/commit refs)
- Verification proofs (3-gate Windmill proofs `ruff check .`, `wmill lint`, verified `test_run_*` + `get_run` IDs, or Gate A + live Gate B runtime output)
- Any proposed `@evolver` self-improvement diffs
