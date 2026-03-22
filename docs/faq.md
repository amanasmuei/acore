# FAQ

## Does this work with any AI?

Yes. Any AI that accepts a system prompt — ChatGPT, Claude, Gemini, Llama, Mistral, and more. The quality of adherence varies by model. More capable models follow instructions more closely.

## What's the difference between core.md and amem?

**`core.md`** is the identity layer — who the AI is, how it relates to you. Human-curated, lives in system prompt. Required.

**amem** is the knowledge layer — what the AI has learned. Automated, lives in local database. Optional.

You always need `core.md`. amem supercharges it with automated memory.

## How does acore work across multiple projects?

Your AI's identity lives in `~/.acore/core.md` — shared across all projects. Each project gets its own `.acore/context.md` with project-specific tech stack, session state, and patterns. Both files are merged automatically. Switching projects is just `cd` and run `npx @aman_asmuei/acore` — your identity carries over, only project context is created.

## Can I use this with a team?

Each person should have their own `core.md` — the AI's relationship with you is personal. For consistent team-wide AI behavior, maintain a shared `team-identity.md` with common values and standards, then layer individual `core.md` files on top.

## What if the AI changes my Identity section?

The Instructions explicitly say "Do NOT change Identity unless asked." If it happens, diff the output before saving. More capable models almost never violate this instruction.

## How is this different from CLAUDE.md or .cursorrules?

Those files define **project behavior** — coding standards, tool preferences, repo conventions. `core.md` defines your **personal relationship** with the AI — who you are, how you communicate, what it's learned about you. They complement each other perfectly.

## What happens if I forget to save?

The AI **proactively offers** to save what it learned when your conversation is winding down — so you're unlikely to forget. On dev-tool platforms (Claude Code, Cursor, Windsurf), the AI can save directly to your files — no manual step needed.

**If you do forget (standalone mode):** Session context is lost — you'll need to re-establish it next time.

**With amem:** The AI has already stored corrections, decisions, and patterns via amem during the conversation. Only the Resume Summary is lost.

## What are Dynamics and how do they work?

Dynamics track the quality of your relationship with the AI — trust level, emotional patterns, and conflict history. They're **not included by default** — your AI will suggest adding them after ~3 sessions, once there's enough data to make them meaningful.

## What does [-> amem: topic] mean?

It's a pointer. When `core.md` approaches its size limit, detailed history moves to amem and a pointer like `[-> amem: authentication-decisions]` stays in the file. The AI automatically recalls the full context from amem when it encounters a pointer. In standalone mode, it's just a note reminding you that more context exists.
