# University Module Workspace (`<MODULE_CODE>`)

## Default Workflow (`/fleet` Elephant-Goldfish + `module-engine`)
- **Coursework, Labs & Coding Tasks (`src/`, `tests/`, `cw1/`, `cw2/`):** Treat any task, coursework prompt, or debugging request as an implicit `/fleet` mission (`CODE_OR_INFRA`). Immediately activate the `fleet` skill (`.agents/skills/fleet/SKILL.md`), dispatch `@scout`, track multi-step coursework in `ELEPHANT_STATE.md`, and fan out scoped `TypeName: "self"` Goldfish workers so the main context stays clean.
- **Study & Exam Pipelines (`notes/`, `flashcards/`, `mock_exam/`):** Use the scaffolded `module-engine` skills (`latex-exam-engine`, `flashcard-engine`, `mock-exam-engine`, `syllabus-auditor`, `mastery-tutor`, `coursework-auditor`) and always run their deterministic validators (`./notes/build.sh`, `./flashcards/build.sh`, `./mock_exam/build.sh`).

## Module Constraints & Deliverable Guardrails
- **Language / Runtime & Allowed Libraries:** `<e.g., Java 21 stdlib + JUnit 5 only / Python 3.12 / Cisco IOS 15.x>`
- **Formal Invariants & Gate A:** Require property-based or boundary invariant tests (`jqwik`, `hypothesis`, `pytest`, `junit`) alongside standard unit tests.
- **Bland Student Styling (`.pptx` / `.docx` / Reports):** Plain white `#FFFFFF` background, standard system font (`Calibri` or `Arial`), plain dark text, simple 1pt grey tables, zero colored badges/cards/dark banners, and mandatory `humanizer` pass on all prose, slide bullets, and speaker scripts before Phase 3 audit.
- **Real HiDPI Screenshots Only:** Never fabricate or composite fake GUI screenshots from PDF crops or PIL mockups. Capture live desktop GUIs (e.g., Wireshark) at `2x` HiDPI (`QT_SCALE_FACTOR=2`, 192 DPI) with tightly framed windows; if a proprietary binary (e.g., Cisco Packet Tracer) is not installed, generate copy-paste configs + 3-step student capture instructions.

## Learned Gotchas (Maintained by `@evolver`)
