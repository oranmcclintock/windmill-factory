# META_RULES.md — Tier 1 Windmill Factory Engineering Guardrails

Global harness guardrails for `/fleet` and the local Python/Windmill stack. Append new permanent harness rules to **Learned Rules** whenever a build failure or critique reveals a gap; route repo-specific gotchas to `<target-repo>/AGENTS.md`.

## 1. Two-Tier Token-Split Architecture
- **Tier 1 — Antigravity (Brain & Builder):** Heavy reasoning, triage, DAG/WAC architecture, composability checks, 3-gate QA, and log-driven self-repair.
- **Tier 2 — Windmill `factory` (Deterministic Runtime):** Deterministic Python 3.13 / Bash / TS workflows handling retries, checkpoints, state, webhooks, schedules, and mobile approval gates.
- **Zero unattended LLM calls by default:** Do not put pay-per-token LLM calls inside Windmill workflows unless a task strictly requires unattended runtime reasoning and is approved in the Step 2 Blueprint.

## 2. Declarative GitOps & Infrastructure Standards
- **Declarative GitOps Only:** Every cluster or infra change goes through Git commits to the target GitOps repo (following its `<target-repo>/AGENTS.md` topology). Never mutate production cluster state imperatively with `kubectl create` or `kubectl exec`.
- **Storage & Rollouts:** Single-replica stateful deployments using `ReadWriteOnce` PVCs must use `strategy: { type: Recreate }` to avoid RWO attach deadlocks.
- **Image Pinning:** Pin immutable release tags (e.g., `ghcr.io/windmill-labs/windmill:1.881.1`) or `@sha256:...` digests with `imagePullPolicy: IfNotPresent`. Never leave floating `:main` or `:latest` tags in production manifests.
- **Secrets:** Never commit plaintext secrets to Git. Use the target repo's native secret encryption/injection mechanism (e.g., SOPS + `age`, SealedSecrets, or external secrets).

## 3. Windmill Workspace, Python & Workflows as Code Standards
- **Toolchain:** `mise` manages local runtimes (Node + `wmill` CLI, Python 3.12+). Windmill default workers execute Python 3.13 under `isolation=unshare`.
- **Default to Python Workflows as Code (WAC):** Author new multi-step workflows as standard Python scripts (deployed via `write_script` / `test_run_script` / `deploy_workspace_item`, not OpenFlow YAML). Use multi-step visual DAG flows (`write_flow`) **only** when primarily chaining existing Windmill scripts or WindmillHub items without custom orchestration logic.
  - **Exact Verified Imports (Windmill CE `v1.881.1` — never alias, parser matches names literally):**
    `from wmill import workflow, task, task_script, task_flow, step, sleep, wait_for_approval, get_approval_urls, parallel, TaskError`
  - **Entrypoint & Tasks:** Decorate top-level `async def main(...) -> dict:` with `@workflow` (never call `main()`). Decorate top-level inline child jobs with `@task` or `@task(timeout=600, tag=..., cache_ttl=..., concurrency_limit=..., retry={"attempts": 3, "delay": 30, "multiplier": 2, "max_delay": 300})`. Bind existing workspace items at module top level via `fn = task_script("f/path/script", ...)` or `flow = task_flow("f/path/flow", ...)`, and invoke with `await fn(...)` / `await flow(...)`.
  - **Checkpoint & Replay Safety:** `@workflow` replays from the top on resume. Put every side effect, API call, DB write, notification, timestamp, or random value inside a `@task` or `await step("stable_name", lambda: ...)` (use static step names). Never call `task_script`, `task_flow`, or `wait_for_approval` from inside a `@task` body.
  - **Durable Sleep & Parallelism:** Use `await sleep(seconds)` for worker-free waits; use `await asyncio.gather(...)` or `await parallel(items, my_task, concurrency=5)` for bounded fan-out.
  - **Approvals (CE-compatible):** Mint step-bound URLs inside `step()` and route through `f/meta/notify`, then suspend:
    `urls = await step("urls", lambda: get_approval_urls("approve_key"))` -> notify with `urls["approvalPage"]` (or `urls["resume"]` / `urls["cancel"]`) -> `approval = await wait_for_approval(key="approve_key", timeout=3600)`. Never set `self_approval=False` (Enterprise-only).
  - **Error Handling:** Catch `TaskError` (or `except Exception`), never bare `except:` (internal suspension inherits from `BaseException`).
- **Typed Deterministic Scripts:** Single-step Python scripts define `def main(...) -> dict:` (and WAC workflows `async def main(...) -> dict:`) with explicit type annotations, stdlib-first dependencies (or minimal pinned imports), structured JSON return values, and explicit error messages.
- **Secrets in Windmill:** Store runtime credentials (bot tokens, API keys, webhooks) as typed Windmill **Resources** or **Variables** (`wmill.get_resource(...)` / `wmill.get_variable(...)`) — never hardcode in script bodies, flow YAML, or `.agents/mcp_config.json`.
- **Folder Conventions & Composability:**
  - `f/meta/` — Shared factory primitives (e.g., `f/meta/ping`, `f/meta/notify`).
  - `f/tasks/` — Hyper-specific Tier 2 workflows.
  - **Reuse first:** Always inspect existing `factory` scripts/flows via Windmill MCP (`list_workspace_items`) before authoring anything new.
- **Default Notification Primitive:** Use `f/meta/notify` for all phone pings and Suspend/Approval gate alerts (passing the Windmill resume/approval URL as `action_url`).

## 4. Mandatory Verification Standards
- **`WINDMILL_WORKFLOW` (3-Gate Standard):**
  1. **Gate 1 — Python Static Lint:** `ruff check .` exits with zero errors.
  2. **Gate 2 — Windmill Lint:** `wmill lint` exits cleanly (also enabled via `lint: true` in `wmill.yaml`).
  3. **Gate 3 — Live Windmill MCP Verification:** Run `test_run_script` / `test_run_flow` against a mock payload and verify both structured output and full execution logs via `get_run` (no silent warnings or swallowed errors).
- **`CODE_OR_INFRA` / `BUILD_APP` (Two-Gate Standard):**
  1. **Gate A (Pre-Push / Pre-Deploy):** Deterministic schema/template dry-run, compiler/typecheck, token lint, unit/build tests, and **formal invariant / property-based checks** (`hypothesis`, `fast-check`, `jqwik`, `proptest`, or executable pre/post-condition contracts on stateful logic, parsers, and algorithms so tests are never tautological happy-path mocks) — never downgraded to bare syntax parsing.
  2. **Gate B (Live Consumer-Path):** Post-deploy verification against the live runtime/consumer interface (`kubectl`/PromQL/UI endpoints, `templates/ui-kit/playwright-audit.mjs` for `BUILD_APP` with `--pwa` on mobile/PWA and `--geo` on `PUBLIC` apps, or autograder/acceptance suite for CLI/uni/consulting).

## 5. Draft-First Safety & Self-Repair Budget
- **Read-only / sandboxed workflows:** Auto-deploy via `deploy_workspace_item` once all 3 gates and `@red-team` pass cleanly.
- **Mutating workflows** (live infra, SSH, GitOps pushes, external writes, financial actions, destructive ops): **MUST stay as drafts** in Windmill with a direct editor/diff review link (Windmill MCP `diff` + editor URL) until the user approves.
- **Approval Gates:** Any subjective or high-stakes action includes a Windmill Suspend/Approval step (`wait_for_approval` in WAC or Suspend step in visual flows) paired with `f/meta/notify`.
- **Self-repair cap (3 iterations max):** Test every draft via `test_run_script` / `test_run_flow` against a mock payload, inspect logs via `get_run`, and patch root causes. After 3 failed attempts, stop and present exact logs + root cause to the user.

## 6. Anti-Slop Engineering & Academic Rules
- **Zero emojis** in code, comments, logs, commit messages, or UI copy.
- **No speculative abstractions:** Write direct, flat, readable code; do not introduce unused wrappers, premature base classes, or config layers for hypothetical requirements.
- **No neon UI slop:** Respect `STYLE_BIBLE.md` (`LOCKED v1 — Manpage Paper & Ink`); never emit generic dark-mode purple/cyan gradients, glowing borders, or unsolicited ornamental styling.
- **No AI prose slop (`humanizer`):** User-facing prose docs (`README.md`, guides, runbooks, client deliverables, coursework reports/slides/speaker scripts), UI microcopy, PR descriptions, and commit messages must follow `.agents/skills/humanizer/SKILL.md` (no "not X, but Y" staging, forced triads, em-dash connectors, stock AI vocabulary like "delve/pivotal/showcase/tapestry/epistemic", or chatbot residue). Never apply prose rewriting to harness/agent/rule files (`AGENTS.md`, `META_RULES.md`, `STYLE_BIBLE.md`, `SKILL.md`, `.agents/agents/*.md`), code blocks, or declarative manifests.
- **Bland Student Deliverable Style (University Coursework `.pptx` / `.docx` / Reports):** Default to a plain white `#FFFFFF` background, standard system font (`Calibri` or `Arial`), plain black/dark-navy text, simple 1pt grey-bordered tables, zero colored badges/cards/dark header banners, and plain student section titles on the very first pass.
- **Zero Synthetic / Forged GUI Screenshots & 2x HiDPI Capture:** Never composite or fabricate fake GUI screenshots from PDF crops, PIL, or HTML mockups. When capturing real desktop GUIs (e.g., Wireshark) via headless X11/Wayland (`Xvfb`), enforce `2x` HiDPI scaling (`QT_SCALE_FACTOR=2`, `GDK_SCALE=2`, 192 DPI) and maximize/crop to the active dialog so fonts are razor-sharp. If a required proprietary GUI binary (e.g., Cisco Packet Tracer) is not installed on the host, state that explicitly and output copy-paste configuration scripts + 3-step student capture instructions instead of faking the image.

---

## Learned Rules (Appended by Step 6)
- **Windmill MCP Scopes:** On Windmill CE `v1.881.1`, `/api/mcp` returns `tools: []` unless the Bearer token includes `scopes: ["mcp:all", "mcp:session"]` and the user is an explicit member of the target workspace (`factory`).
- **No bogus tool aliases:** Never put unverified tool names or group aliases in `.agents/agents/*.md` `tools:` frontmatter; omit `tools:` so subagents inherit the session's registered toolset and `windmill` MCP server, and enforce read-only boundaries in instructions.
- **Fix-before-run:** If any subagent fails to construct or validate, STOP and fix the definition file on disk first—never silently bypass a broken agent file with a runtime override.
- **Scoped `self` Goldfish for heavy local execution:** Because custom `.agents/agents/*.md` definitions do not have `run_command` or file-write tools, use `TypeName: "self"` with a strict 4-part atomic brief (`Objective`, `Exact Files`, `Constraints`, `Verification Gate`) and track progress in `ELEPHANT_STATE.md` whenever parallelizing heavy local file/CLI tasks so the Commander's context window stays clean.
