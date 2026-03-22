# Platform-Specific Setup

## ChatGPT

Paste into **Custom Instructions**. Note: ChatGPT has a character limit (~1,500 chars), so you may need to trim to essentials.

## Claude (Web)

Use **Claude Projects** and paste into **Project Instructions**. Persists across all conversations in the project.

## Claude Code

The CLI **auto-detects** Claude Code from `CLAUDE.md` and injects your identity automatically. Claude Code reads it every session. Run `acore pull --sync-only` to re-sync anytime.

## Cursor

The CLI **auto-detects** Cursor from `.cursorrules` and injects your identity automatically. Pair with amem (`acore connect`) for the best experience.

## Windsurf

The CLI **auto-detects** Windsurf from `.windsurfrules` and injects your identity automatically. Pair with amem (`acore connect`) for the best experience.

## API Usage

Pass as the `system` message:

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "system": "<contents of core.md>",
  "messages": [...]
}
```
