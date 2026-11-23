# Canonical UI Blocks — Manpage Paper & Ink (`STYLE_BIBLE.md` v1)

Drop-in structural patterns for `BUILD_APP` projects using `tokens.css`. Never invent new card/table/error wrappers when one of these blocks fits.

## 1. Layout Shells
- **`ConsoleShell`:**
  - *Desktop (`>=768px`):* Fixed `220px–240px` sidebar (`bg-[var(--background)] border-r border-[var(--border)]`) + `48px` topbar (`border-b border-[var(--border)]`) + scrollable `<main className="flex-1 min-w-0 p-6 max-w-7xl">`.
  - *Mobile (`<768px`):* Topbar with menu toggle (`44x44px` hit target) opening slide-over drawer (`overscroll-contain`), `min-h-dvh`, and `pb-[env(safe-area-inset-bottom)]`.
  - *Active Nav Item:* `bg-[var(--muted)] text-[var(--foreground)] border-l-2 border-[var(--primary)] rounded-[var(--radius-sm)]`.
- **`CenteredFormShell`:**
  - Centered `max-w-xl mx-auto p-6` single-column container inside `min-h-dvh` for focused forms and approval gates (scannable summary at top, pre-filled inputs, concrete verb+noun action buttons).
- **`DetailSplitShell`:**
  - `48px` breadcrumb topbar + `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 p-6 max-w-7xl` (primary detail/logs on left, metadata/actions rail on right; collapses cleanly to single column on mobile).

## 2. `StatCard`
- Surface: `bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4`.
- Top row: `text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]` label + optional delta (`text-[var(--success)]` / `text-[var(--destructive)]`).
- Value: `text-2xl font-mono font-semibold tabular-nums text-[var(--foreground)]`.

## 3. `DataTable`
- Container: `bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-x-auto`.
- Header: `bg-[var(--muted)] border-b border-[var(--border)] text-xs font-mono uppercase text-[var(--muted-foreground)]`.
- Rows: `border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/50 text-[13px]`.
- Truncation: Long URLs/IDs in flex/table cells MUST include `min-w-0 truncate` (never cause horizontal page overflow).
- Status cell: `inline-flex items-center gap-1.5 font-mono text-xs whitespace-nowrap` with a `6px` square/dot (`bg-[var(--success)]` / `bg-[var(--warning)]` / `bg-[var(--destructive)]`).

## 4. `CodeBlock`
- Container: `bg-[var(--muted)] border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden`.
- Header strip: `px-3 py-1.5 border-b border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]`.
- Body: `p-3 font-mono text-xs leading-relaxed overflow-x-auto select-text`.
- Line-number gutter (when shown): `select-none tabular-nums text-[var(--muted-foreground)] pr-3 mr-3 border-r border-[var(--border)]`.

## 5. `EmptyState` & `ErrorState`
- **`EmptyState`:** `border border-dashed border-[var(--border)] rounded-[var(--radius)] p-8 text-center` with concise title (`text-sm font-semibold`), 1-line reason (`text-xs text-[var(--muted-foreground)]`), and at most 1 action button.
- **`ErrorState`:** `bg-[var(--card)] border border-[var(--border)] border-l-[3px] border-l-[var(--destructive)] rounded-[var(--radius)] p-4` with monospace error code (`text-xs font-mono text-[var(--destructive)]`), summary, recessed stderr/trace well, and explicit `Retry` button.
