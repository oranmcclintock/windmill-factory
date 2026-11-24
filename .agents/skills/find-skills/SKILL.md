---
name: find-skills
description: |
  Helps discover, audit, and install capabilities from the open agent skills ecosystem (skills.sh).
  Use when asked to find, recommend, or install a skill for a domain, language, framework, or task.
---

# Find Skills

Discover and install skills from the open agent skills ecosystem ([skills.sh](https://skills.sh/)).

## When to Use

Use this skill when:
- The user asks "find a skill for X", "is there a skill that can...", or "how do I do X" where a specialized community skill might exist.
- Looking for domain best practices (e.g. Next.js performance, Drizzle migrations, Tailwind v4, Playwright patterns).
- Evaluating whether to write a new custom workflow or install an existing vetted skill package.

## Tooling & Registry

- **Registry:** [https://skills.sh/](https://skills.sh/)
- **CLI:** `npx -y skills <command>`

### Key Commands

```bash
# Search skills interactively or by keyword
npx -y skills find [query] [--owner <owner>]

# List skills in a repo before installing
npx -y skills add <owner/repo> --list

# View details or prompt representation without installing
npx -y skills use <owner/repo>@<skill>
```

## Discovery & Installation Flow

### Step 1: Search the Registry

Run `npx -y skills find [query]` to search matching packages.

Example:
```bash
npx -y skills find react performance
npx -y skills find drizzle
```

### Step 2: Quality & Reputation Verification

Never recommend or install unknown/unverified skills automatically:
1. **Source Reputation:** Prefer official orgs (`vercel-labs`, `anthropics`, `microsoft`, `GoogleChrome`).
2. **Install Count:** Favor skills with 1,000+ installs on `skills.sh`.
3. **Repository Stars:** Verify the source GitHub repository has strong community adoption (>100 stars).

### Step 3: Present Options to User

Before installing, present the findings to the user:
- Skill name and brief summary of what it does.
- Source repo, stars, and install count.
- Link to preview on `https://skills.sh/<owner>/<repo>/<skill>`.
- Ask if they want it installed globally (`~/.gemini/config/skills/`) or into the current repository (`.agents/skills/`).

### Step 4: Install to Antigravity

Antigravity natively discovers skills from:
- **Global:** `~/.gemini/config/skills/<skill-name>/SKILL.md`
- **Project-level:** `.agents/skills/<skill-name>/SKILL.md`

To install cleanly from a GitHub source into Antigravity:

```bash
# Download/clone the skill folder to the target directory:
# Example for a global skill:
git clone --depth 1 https://github.com/<owner>/<repo>.git /tmp/<repo>
cp -r /tmp/<repo>/skills/<skill-name> ~/.gemini/config/skills/
rm -rf /tmp/<repo>
```

Alternatively, if running `npx -y skills add <package>`, ensure the installed `SKILL.md` is symlinked or placed into `~/.gemini/config/skills/` so Antigravity loads it immediately.
