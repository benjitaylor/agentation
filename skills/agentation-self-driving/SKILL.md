---
name: agentation-self-driving
description: Autonomously critique a web page by scanning layout, typography, spacing, and CTA placement, then adding design annotations via the Agentation toolbar in a headed browser. Use when the user asks to "critique this page," "add design annotations," "review the UI," "self-driving mode," or "auto-annotate." Opens a visible browser, scrolls through sections, identifies hierarchy and grouping issues, and submits actionable feedback per element. Requires Agentation toolbar and agent-browser skill.
allowed-tools: Bash(agent-browser:*)
---

# Agentation Self-Driving Mode

Autonomously critique a web page by adding design annotations via the Agentation toolbar — in a visible headed browser so the user can watch the agent work in real time, like watching a self-driving car navigate.

## Launch — Always Headed

The browser MUST be visible. Never run headless. The user watches you scan, hover, click, and annotate.

**Preflight**: Verify `agent-browser` is available before anything else:

```bash
command -v agent-browser >/dev/null || { echo "ERROR: agent-browser not found. Install the agent-browser skill first."; exit 1; }
```

**Launch**: Try opening directly first. Only close an existing session if the open command fails with a stale session error — this avoids killing a browser someone else is using:

```bash
# Try to open. If it fails (stale session), close first then retry.
agent-browser --headed open <url> 2>&1 || { agent-browser close 2>/dev/null; agent-browser --headed open <url>; }
```

Then verify the Agentation toolbar is present and expand it:

```bash
# 1. Check toolbar exists on the page (data-feedback-toolbar is the root marker)
agent-browser eval "document.querySelector('[data-feedback-toolbar]') ? 'toolbar found' : 'NOT FOUND'"
# If "NOT FOUND": Agentation is not installed on this page — stop and tell the user

# 2. Expand ONLY if collapsed (clicking when already expanded collapses it)
agent-browser eval "document.querySelector('[data-feedback-toolbar][class*=expanded]') ? 'already expanded' : (document.querySelector('[class*=toggleContent]')?.click(), 'expanding')"

# 3. Verify: take a snapshot and look for toolbar controls
agent-browser snapshot -i
# If expanded: you'll see "Block page interactions" checkbox, color buttons (Purple, Blue, etc.)
# If collapsed: you'll only see the small toggle button — retry step 2
```

"Block page interactions" must be checked (default: on).

> **eval quoting rule**: Always use `[class*=toggleContent]` (no quotes around the attribute value) in eval strings. Do not use double-bang in eval because bash treats it as history expansion. Do not use backslash-escaped inner quotes either, as they break unpredictably across shells.

## Critical: How to Create Annotations

**Standard element clicks (`click @ref`) do NOT trigger annotation dialogs.** The Agentation overlay intercepts pointer events at the coordinate level. Use coordinate-based mouse events — this also makes the interaction visible in the browser as the cursor moves across the page.

> **`@ref` compatibility**: Only `click`, `fill`, `type`, `hover`, `focus`, `check`, `select`, `drag` support `@ref` syntax. The commands `scrollintoview`, `get box`, and `eval` do NOT — they expect CSS selectors. Use `eval` with `querySelector` for scrolling and position lookup.

```bash
# 1. Take interactive snapshot — identify target element and build a CSS selector
agent-browser snapshot -i
# Example: snapshot shows  heading "Point at bugs." [ref=e10]
# Derive a CSS selector: 'h1', or more specific: 'h1:first-of-type'

# 2. Scroll the element into view via eval (NOT scrollintoview @ref — that breaks)
agent-browser eval "document.querySelector('h1').scrollIntoView({block:'center'})"

# 3. Get its bounding box via eval (NOT get box @ref — that also breaks)
agent-browser eval "((r) => r.x+','+r.y+','+r.width+','+r.height)(document.querySelector('h1').getBoundingClientRect())"
# Returns: "383,245,200,40"  (parse these as x,y,width,height)

# 4. Move cursor to element center, then click
#    centerX = x + width/2,  centerY = y + height/2
agent-browser mouse move <centerX> <centerY>
agent-browser mouse down left
agent-browser mouse up left

# 5. Get the annotation dialog refs — read the FULL snapshot output
#    Dialog refs appear at the BOTTOM of the list, don't truncate with head/tail
agent-browser snapshot -i
# Look for: textbox "What should change?" and "Cancel" / "Add" buttons

# 6. Type critique — fill and click DO support @ref
agent-browser fill @<textboxRef> "Your critique here"

# 7. Submit (Add button enables after text is filled)
agent-browser click @<addRef>
```

If no dialog appears after clicking, the toolbar may have collapsed. Re-expand (only if collapsed) and retry:

```bash
agent-browser eval "document.querySelector('[data-feedback-toolbar][class*=expanded]') ? 'ok' : (document.querySelector('[class*=toggleContent]')?.click(), 'expanded')"
```

### Building CSS selectors from snapshots

The snapshot shows element roles, names, and refs. Map them to CSS selectors:

| Snapshot line | CSS selector |
|--------------|-------------|
| `heading "Point at bugs." [ref=e10]` | `h1` or `h1:first-of-type` |
| `button "npm install agentation Copy" [ref=e15]` | `button:has(code)` or by text content via eval |
| `link "Star on GitHub" [ref=e28]` | `a[href*=github]` |
| `paragraph (long text...) [ref=e20]` | Target by section: `section:nth-of-type(2) p` |

When in doubt, use a broader selector and verify with eval:
```bash
agent-browser eval "document.querySelector('h2').textContent"
```

## The Loop

Work top-to-bottom through the page. For each annotation:

1. Scroll to the target area via eval (`scrollIntoView`)
2. Pick a specific element — heading, paragraph, button, section container
3. Get its bounding box via eval (`getBoundingClientRect`)
4. Execute the coordinate-click sequence (`mouse move` → `mouse down` → `mouse up`)
5. Read the **full** snapshot output to find dialog refs at the bottom
6. Write the critique (`fill @ref`) and submit (`click @ref`)
7. Verify the annotation was added (see below)
8. Move to the next area

### Verifying annotations

After submitting each annotation, confirm the count increased:

```bash
agent-browser eval "document.querySelectorAll('[data-annotation-marker]').length"
# Should return the expected count (1 after first, 2 after second, etc.)
```

If the count didn't increase, the submission failed silently — re-snapshot and check if the dialog is still open.

Aim for 5-8 annotations per page unless told otherwise.

## What to Critique

| Area | What to look for |
|------|-----------------|
| **Hero / above the fold** | Headline hierarchy, CTA placement, visual grouping |
| **Navigation** | Label styling, category grouping, visual weight |
| **Demo / illustrations** | Clarity, depth, animation readability |
| **Content sections** | Spacing rhythm, callout treatments, typography hierarchy |
| **Key taglines** | Whether resonant lines get enough visual emphasis |
| **CTAs and footer** | Conversion weight, visual separation, final actions |

## Critique Style

2-3 sentences max per annotation:

- **Specific and actionable**: "Stack the install command below the subheading at 16px" not "fix the layout"
- **1-2 concrete alternatives**: Reference CSS values, layout patterns, or design systems
- **Name the principle**: Visual hierarchy, Gestalt grouping, whitespace, emphasis, conversion design
- **Reference comparable products**: "Like how Stripe/Linear/Vercel handles this"

Bad: "This section needs work"
Good: "This bullet list reads like docs, not a showcase. Use a 3-column card grid with icons — similar to Stripe's guidelines pattern. Creates visual rhythm and scannability."

## Install

The skill must be symlinked into `~/.claude/skills/` for Claude Code to discover it:

```bash
ln -s "$(pwd)/skills/agentation-self-driving" ~/.claude/skills/agentation-self-driving
```

Restart Claude Code after installing. Verify with `/agentation-self-driving` — if it loads the skill instructions, the symlink is working.

## Troubleshooting & Pitfalls

See [references/troubleshooting.md](references/troubleshooting.md) for common issues and agent-browser pitfalls.

**Key rule**: `@ref` works for interaction commands (`click`, `fill`, `type`, `hover`). For everything else (`eval`, `get`, `scrollintoview`), use CSS selectors via `querySelector` in an eval.

## Two-Session Workflow

With MCP connected, one agent critiques while another fixes code in real time. See [references/two-session-workflow.md](references/two-session-workflow.md) for full setup.
