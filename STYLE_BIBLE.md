# STYLE_BIBLE.md — Manpage Paper & Ink

**STATUS: LOCKED v1**

Timeless, high-contrast monochrome editorial/terminal design system inspired by Unix manpages, Linear, and Vercel's Geist. Built for maximum signal-to-noise ratio across homelab consoles, consulting/B2B tools, and custom apps.

---

## 1. OKLCH Color Tokens (Light: Paper / Dark: Ink)

| Token | Light Mode ("Paper") | Dark Mode ("Ink") | Role |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.985 0.002 90)` | `oklch(0.130 0.003 260)` | Root canvas |
| `--card` | `oklch(1.000 0.000 0)` | `oklch(0.165 0.003 260)` | Elevated container surface |
| `--muted` | `oklch(0.955 0.002 90)` | `oklch(0.205 0.004 260)` | Recessed wells, table headers, hover rows, code blocks |
| `--border` | `oklch(0.890 0.003 90)` | `oklch(0.265 0.004 260)` | Universal `1px` hairline structural rules |
| `--foreground` | `oklch(0.145 0.004 90)` | `oklch(0.950 0.002 90)` | Primary text, headings, active icons |
| `--muted-foreground` | `oklch(0.460 0.005 90)` | `oklch(0.650 0.004 90)` | Metadata, timestamps, axis labels, placeholders |
| `--primary` | `oklch(0.145 0.004 90)` | `oklch(0.950 0.002 90)` | Primary CTA fill, active nav indicator |
| `--primary-foreground` | `oklch(0.985 0.002 90)` | `oklch(0.130 0.003 260)` | Text/icon on `--primary` |
| `--success` | `oklch(0.480 0.120 150)` | `oklch(0.680 0.140 150)` | Pass / healthy / exit 0 |
| `--warning` | `oklch(0.580 0.140 75)` | `oklch(0.750 0.130 75)` | Pending / degraded / dry-run |
| `--destructive` | `oklch(0.500 0.180 25)` | `oklch(0.640 0.180 25)` | Error / failed / irreversible action |

---

## 2. Typography, Scale, Density & Geometry
- **UI Sans (`--font-sans`):** `Geist`, `Inter`, `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Monospace (`--font-mono`):** `Geist Mono`, `JetBrains Mono`, `ui-monospace, SFMono-Regular, monospace`
- **Numeric Discipline:** `font-variant-numeric: tabular-nums` mandatory on all numbers, timestamps, durations, IDs, counts, and table cells.
- **Scale (`14px` base, `12px` minimum floor):** `12px` captions/table headers/badges (`>=12px`), `13px` dense table cells, `14px` body/forms, `16px` card titles, `20px` page H1, `24px–28px` KPI values.
- **4px / 8px Grid:** `4px` tight inline gaps, `8px` form/button gaps, `12px` table cell padding (`8px 12px`), `16px` card padding, `24px` page canvas padding.
- **Radius:** `4px` for buttons, inputs, badges, code blocks; `6px` for cards, panels, dialogs, tables. Zero pill (`9999px`) shapes except `6px` status dots.
- **Elevation:** `box-shadow: none` everywhere. Hierarchy comes strictly from `1px solid var(--border)` hairlines and surface contrast (`--background` vs `--card` vs `--muted`). Focus ring: `2px solid var(--foreground)` with `2px` offset.

---

## 3. Canonical Layout Shells & Component Grammar
- **`ConsoleShell`:** Fixed `220px–240px` left sidebar (`1px` right border, `2px` left active indicator bar) + `48px` topbar (`1px` bottom border, monospace breadcrumb, `Cmd+K` badge) + fluid main canvas (`max-w-7xl`).
- **`CenteredFormShell`:** Centered `max-w-xl` single-column container for focused forms and Windmill Suspend/Approval gates (scannable summary at top, pre-filled inputs, concrete action labels, safe defaults).
- **`DetailSplitShell`:** Breadcrumb topbar + `2:1` asymmetric split (`min-w-0` primary detail/logs pane on left, `320px–360px` metadata/actions rail on right; collapses to single stack below `1024px`).
- **Required Blocks:** `DataTable` (`36px–40px` rows, horizontal `1px` dividers only, `6px` status dot + mono label), `StatCard`, `CodeBlock` (header strip + line-number gutter), `EmptyState` (`1px dashed var(--border)`), `ErrorState` (`3px` `--destructive` left bar + stderr/trace well + `Retry`).

---

## 4. Anti-Slop Blacklist (Automatic `@red-team` `BLOCK`)
- Zero emojis anywhere in UI copy, status labels, or empty states.
- Zero drop shadows, glassmorphism, gradients, or neon/purple/cyan glows.
- Zero arbitrary magic values (`p-[13px]`, `bg-[#...]`, `text-[10px]`) or raw Tailwind palette classes (`bg-blue-500`, `text-slate-400`) — use semantic tokens from `templates/ui-kit/tokens.css` only.
- Zero nested `Card` inside `Card`.
