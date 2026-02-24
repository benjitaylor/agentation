# Troubleshooting & agent-browser Pitfalls

## Common Issues

- **"Browser not launched. Call launch first."**: Stale session from a previous run — run `agent-browser close 2>/dev/null` then retry the `--headed open` command
- **Toolbar not found on page**: Agentation isn't installed — run `/agentation` to set it up first
- **No dialog after clicking**: Toolbar collapsed — re-expand with the state-aware eval (check `[class*=expanded]` first), retry
- **Wrong element targeted**: Click Cancel, scroll to intended element, retry with correct coordinates
- **Add button stays disabled**: Text wasn't filled — re-snapshot and fill the textbox
- **Page navigated**: "Block page interactions" is off — enable via toolbar settings
- **Annotation count didn't increase**: Submission failed — dialog may still be open, re-snapshot and check
- **Interrupted mid-run (Ctrl+C)**: The browser stays open with whatever state it was in. Run `agent-browser close` to clean up before starting a new session

## agent-browser Pitfalls

These will silently break the workflow if you're not aware of them:

| Pitfall | What happens | Fix |
|---------|-------------|-----|
| `scrollintoview @ref` | Crashes: "Unsupported token @ref while parsing css selector" | Use `eval "document.querySelector('sel').scrollIntoView({block:'center'})"` |
| `get box @ref` | Same crash — `get box` parses refs as CSS selectors | Use `eval "((r)=>r.x+','+r.y+','+r.width+','+r.height)(document.querySelector('sel').getBoundingClientRect())"` |
| `eval` with double-bang | Bash expands double-bang as history substitution before the command runs | Use `expr !== null` or `expr ? true : false` instead |
| `eval` with backslash-escaped quotes | Escaped inner quotes break across shells | Drop the quotes: `[class*=toggleContent]` works for simple values without spaces |
| `snapshot -i \| head -50` | Annotation dialog refs (`textbox "What should change?"`, `Add`, `Cancel`) appear at the BOTTOM of the snapshot | Always read the **full** snapshot output — never truncate |
| `click @ref` on overlay elements | The click goes through to the real DOM, bypassing the Agentation overlay | Use `mouse move` → `mouse down left` → `mouse up left` for coordinate-based clicks that the overlay intercepts |
| `--headed open` fails with "Browser not launched" | Stale sessions from previous runs block new launches | Run `agent-browser close 2>/dev/null` then retry the open command |

**Rule of thumb**: `@ref` works for interaction commands (`click`, `fill`, `type`, `hover`). For everything else (`eval`, `get`, `scrollintoview`), use CSS selectors via `querySelector` in an eval.
