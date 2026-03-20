# aman-core

**The identity layer for AI companions.**

---

## What is aman-core?

aman-core is a simplified, platform-agnostic AI identity system. It gives any LLM a persistent personality and relationship memory through a single markdown file (`core.md`) that you paste into the system prompt. Inspired by [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) — which uses 30+ files and 9 feature modules — aman-core reduces the entire concept to just 2 files: `core.md` and this README.

The system is built around two kinds of memory:

- **Identity memory** (human-curated) — lives in `core.md`. This is your AI's personality, your relationship context, and session state. You write it, you own it, and you update it manually.
- **Knowledge memory** (automated) — lives in [amem](https://github.com/amanasmuei/amem), an optional MCP memory server. This is where corrections, decisions, patterns, and preferences get stored and recalled automatically during conversations.

You can use aman-core standalone with just `core.md`, or supercharge it with amem for automated knowledge memory.

---

## Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/amanasmuei/aman-core.git
   cd aman-core
   ```

2. **Edit `core.md`** — replace the placeholders with your own values:

   | Placeholder | What to fill in |
   |-------------|-----------------|
   | `[AI-NAME]` | The name you want your AI to use |
   | `[USER-NAME]` | Your name |
   | `[USER-ROLE]` | Your role (e.g., "software engineer", "writer") |
   | Personality traits | 3-5 traits that define your AI's character |
   | Communication Style | How the AI should talk to you |
   | Values | What the AI should prioritize |
   | Preferences | How you like to communicate |
   | Work Context | Your tech stack, domain, current focus |
   | Personal Context | Interests, goals, how you like to be supported |
   | Learned Patterns | Leave empty — the AI fills this in over time |

3. **Paste `core.md` into your LLM's system prompt** — works with ChatGPT, Claude, Gemini, or any LLM that accepts a system prompt.

---

## How It Works

aman-core works in standalone mode with no dependencies. Every session follows a 3-phase lifecycle:

### Session Start

Paste `core.md` into the system prompt. The AI reads the **Resume Summary** to pick up where you left off, along with any Active Topics and Recent Decisions.

### During Session

The AI responds shaped by the **Identity** section (personality, communication style, values) and the **Relationship** section (your preferences, work context, learned patterns). It feels like talking to the same AI every time.

### Session End

Say **"update core"**. The AI outputs a fully updated `core.md` in a fenced code block. Copy it and save it back to your file. The next session picks up seamlessly.

---

## Supercharge with amem

[amem](https://github.com/amanasmuei/amem) is an MCP memory server designed for AI coding tools like Claude Code, Cursor, and Windsurf. It gives your AI automated knowledge memory that persists across sessions without manual copy-paste.

### Install

```bash
npx @aman_asmuei/amem
```

### What it adds

With amem connected, your AI can automatically store and recall corrections, decisions, patterns, and preferences. Identity and relationship data still live in `core.md` — amem handles everything else.

### amem Tools

| Tool | Purpose |
|------|---------|
| `memory_store` | Save corrections, decisions, patterns, preferences during conversation |
| `memory_recall` | Semantic search across past context |
| `memory_inject` | Load relevant corrections + decisions at session start |
| `memory_context` | Get formatted context grouped by memory type |

When amem is available, the AI will:
- Call `memory_inject` at session start to load relevant context
- Store corrections, decisions, and patterns automatically via `memory_store`
- Use `memory_recall` to search past context before asking you to repeat yourself
- Keep identity and relationship info in `core.md` only — never duplicated into amem

---

## Commands

### `update core`

Say "update core" at the end of a session. The AI follows these 6 steps:

1. Output the **full** updated `core.md` in a single fenced code block
2. Update the **Relationship** section with anything new it learned about you
3. Write a **Resume Summary** capturing where you left off
4. Clear **Temporary Notes**
5. Set **Last Updated** to today's date
6. Do **NOT** change the **Identity** section unless you explicitly ask

You then copy the output and save it back to `core.md`.

---

## Customization

The Identity section is yours to shape. Here are some tips:

**Personality** — pick 3-5 traits that define the AI's character. Fewer is better; they compound.

**Communication Style** — be specific about how you want the AI to talk.

- Formal: `"Use complete sentences. Cite sources. Avoid colloquialisms."`
- Casual: `"Keep it brief. Use contractions. Match my energy."`

**Values** — set priorities the AI should follow when making trade-offs.

- `"Honesty over comfort"` — the AI will push back when you're wrong
- `"Simplicity over cleverness"` — the AI will prefer straightforward solutions

Start minimal and refine over time. The Relationship section evolves naturally as the AI learns your patterns through sessions.

---

## Size Guideline

Keep `core.md` under **2,000 words**. If it grows beyond that:

- **Standalone mode** — archive older Learned Patterns and Recent Decisions to a `core-archive.md` file. Keep only what's actively relevant in `core.md`.
- **Enhanced mode (with amem)** — offload patterns and preferences to amem via `memory_store`. Let `core.md` focus on identity and relationship essentials.

---

## Philosophy

The original [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) proved that giving an AI structured memory dramatically improves the experience. But 30+ files and 9 modules is a lot of overhead for what is fundamentally a personal tool.

aman-core takes a different approach: **one file, not thirty**.

The insight is that AI memory splits cleanly into two kinds. **Identity memory** — who the AI is, who you are, how you work together — is inherently human-curated. It belongs in a file you control and paste into the system prompt. **Knowledge memory** — corrections, decisions, recurring patterns — is inherently automated. It belongs in a tool like amem that stores and retrieves it without manual effort.

By separating these concerns, aman-core stays simple while still supporting rich, persistent AI relationships.

---

## Privacy

After you customize `core.md` with your personal information, treat it like any other private file:

- **Add `core.md` to your `.gitignore`** if you plan to push this repo anywhere public
- **Or use a private repo** to keep your customized core under version control

The shipped `.gitignore` does **not** ignore `core.md` because the template contains no personal data — it's just placeholders. Once you fill in your details, it's your responsibility to keep it private.

---

## Credits

- [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) by Kiyoraka — the original inspiration for structured AI memory
- [amem](https://github.com/amanasmuei/amem) — MCP memory server for automated knowledge memory (`npm: @aman_asmuei/amem`)

---

## License

MIT

---

*aman-core v1*
