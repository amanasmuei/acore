<div align="center">

# aman-core

**The identity layer for AI companions.**

Give any AI a persistent personality and relationship memory — in a single file.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Any%20LLM-green.svg)](#supported-platforms)
[![amem](https://img.shields.io/badge/Enhanced%20by-amem-orange.svg)](https://github.com/amanasmuei/amem)

[Quick Start](#quick-start) · [How It Works](#how-it-works) · [Supercharge with amem](#supercharge-with-amem) · [Guides](#guides)

</div>

---

## The Problem

Every time you start a new conversation with an AI, it forgets who you are. Your preferences, your communication style, the context of your work — all gone. You end up repeating yourself, re-explaining your setup, and losing the continuity that makes collaboration productive.

## The Solution

**aman-core** is one markdown file — `core.md` — that you paste into any AI's system prompt. It tells the AI who it is, who you are, and how you work together. The AI reads it, behaves accordingly, and at the end of your session, you ask it to update the file. Next session, it picks up right where you left off.

No databases. No APIs. No accounts. Just a text file you control.

> *Inspired by [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) (30+ files, 9 modules). aman-core distills the same idea into 2 files.*

---

## How It's Different

aman-core is built around a key insight: **AI memory is two things, not one.**

| | Identity Memory | Knowledge Memory |
|:---|:---|:---|
| **What it stores** | Personality, relationship, communication style | Corrections, decisions, patterns, facts |
| **Who manages it** | You (human-curated) | The AI (automated) |
| **Where it lives** | `core.md` (system prompt) | [amem](https://github.com/amanasmuei/amem) (MCP server) |
| **How it updates** | You say "update core" | Happens automatically |
| **Required?** | Yes | Optional (but powerful) |

You can use `core.md` alone for full functionality, or pair it with **amem** for automated knowledge memory.

---

## Quick Start

### Step 1: Get the file

```bash
git clone https://github.com/amanasmuei/aman-core.git
cd aman-core
```

Or just [download `core.md` directly](core.md) — it's the only file you need.

### Step 2: Make it yours

Open `core.md` and replace the placeholders:

<table>
<tr><th>Replace this</th><th>With this</th><th>Example</th></tr>
<tr><td><code>[AI-NAME]</code></td><td>Your AI's name</td><td>Nova, Atlas, Sage</td></tr>
<tr><td><code>[USER-NAME]</code></td><td>Your name</td><td>Aman</td></tr>
<tr><td><code>[USER-ROLE]</code></td><td>What you do</td><td>Software Engineer, Designer, Writer</td></tr>
</table>

Then fill in the descriptive fields:

| Field | What to write | Tips |
|:------|:-------------|:-----|
| **Personality** | 3-5 traits for your AI | Less is more — traits compound. Try: `curious, direct, pragmatic` |
| **Communication Style** | How the AI should talk | Be specific: `concise by default, detailed when asked` |
| **Values** | What the AI prioritizes | Trade-offs work best: `honesty over comfort` |
| **Preferences** | How you like to communicate | `I prefer bullet points over paragraphs` |
| **Work Context** | Your tech stack and domain | `TypeScript, React, building SaaS products` |
| **Personal Context** | Goals and interests | `Learning Rust, interested in AI tooling` |
| **Learned Patterns** | Leave this empty | The AI fills this in over time as it learns about you |

### Step 3: Use it

Paste the contents of `core.md` into your AI's system prompt. That's it — your AI now has a persistent identity.

<details>
<summary><strong>Where to paste for each platform</strong></summary>

| Platform | Where to paste `core.md` |
|:---------|:------------------------|
| **ChatGPT** | Settings → Personalization → Custom Instructions |
| **Claude** (web) | Project → Project Instructions |
| **Claude Code** | Add to your project's `CLAUDE.md` or system prompt |
| **Cursor** | Settings → Rules for AI, or `.cursorrules` file |
| **Windsurf** | Settings → AI Rules |
| **Gemini** | Gems → Create a new Gem → Instructions |
| **Any LLM API** | Pass as the `system` message |

</details>

---

## How It Works

Every session follows a simple 3-phase lifecycle:

```
┌─────────────────────────────────────────────────────┐
│  SESSION START                                      │
│  Load core.md → AI reads Resume Summary → picks up  │
│  where you left off                                 │
├─────────────────────────────────────────────────────┤
│  DURING SESSION                                     │
│  AI responds shaped by Identity (personality,       │
│  style, values) and Relationship (your preferences, │
│  work context, learned patterns)                    │
├─────────────────────────────────────────────────────┤
│  SESSION END                                        │
│  Say "update core" → AI outputs updated core.md →   │
│  Copy and save it back                              │
└─────────────────────────────────────────────────────┘
```

### What `core.md` contains

| Section | Purpose | Changes how often? |
|:--------|:--------|:-------------------|
| **Identity** | AI's name, personality, communication style, values | Rarely — you set it once |
| **Relationship** | Your preferences, work context, learned patterns | Grows over time as the AI learns about you |
| **Session** | Resume summary, active topics, temporary notes | Every session — keeps continuity |
| **Instructions** | Tells the AI how to update itself and use amem | Never — these are the rules |

### The "update core" command

At the end of any session, just say **"update core"**. The AI follows 6 steps:

1. Outputs the **full** updated `core.md` in a fenced code block
2. Updates the **Relationship** section with anything new it learned
3. Writes a **Resume Summary** capturing where you left off
4. Clears **Temporary Notes**
5. Sets **Last Updated** to today's date
6. Does **NOT** change the **Identity** section (unless you ask)

You copy the output, save it back to `core.md`, and your next session starts with full context.

---

## Supercharge with amem

> **For technical users.** This section covers optional integration with [amem](https://github.com/amanasmuei/amem), an MCP memory server. If you're not using MCP-compatible tools, skip this — `core.md` works great on its own.

[amem](https://github.com/amanasmuei/amem) is a local-first MCP memory server for AI coding tools. It gives your AI automated knowledge memory — corrections, decisions, patterns — that persists across sessions without manual copy-paste.

### Setup

```bash
npx @aman_asmuei/amem
```

Works with Claude Code, Cursor, Windsurf, and any MCP-compatible tool.

### What changes with amem

| Without amem (standalone) | With amem (enhanced) |
|:--------------------------|:--------------------|
| You manually say "update core" to save learnings | AI automatically stores corrections, decisions, patterns |
| Context limited to what's in `core.md` | AI recalls relevant past context via semantic search |
| Session resume via Resume Summary only | AI loads prior corrections + decisions at session start |
| Search past context manually (grep/ctrl+F) | AI searches with `memory_recall` using embeddings |

### amem MCP Tools

| Tool | What it does | When it's used |
|:-----|:------------|:---------------|
| `memory_store` | Saves corrections, decisions, patterns, preferences | During conversation — when the AI learns something |
| `memory_recall` | Semantic search across all past memories | When the AI needs context before asking you to repeat |
| `memory_inject` | Loads relevant corrections + decisions proactively | At session start — before you even ask |
| `memory_context` | Returns formatted context grouped by memory type | When the AI needs a structured overview of a topic |

### How they work together

```
core.md (Identity Layer)          amem (Knowledge Layer)
┌──────────────────────┐          ┌──────────────────────┐
│ WHO the AI is        │          │ WHAT it has learned   │
│ WHO you are          │          │ Corrections           │
│ HOW you work together│          │ Decisions             │
│                      │          │ Patterns              │
│ Human-curated        │          │ Automated             │
│ Manual updates       │          │ Auto-stored & ranked  │
│ In system prompt     │          │ In local SQLite DB    │
└──────────────────────┘          └──────────────────────┘
         ↕ Identity never goes into amem
         ↕ Knowledge never clutters core.md
```

---

## Guides

<details>
<summary><strong>Customization Guide — Crafting your AI's personality</strong></summary>

### Personality Traits

Pick 3-5 traits. Fewer is better — they compound in interesting ways.

**Example combinations:**

| Style | Traits | Result |
|:------|:-------|:-------|
| **The Mentor** | patient, thorough, encouraging | Teaches concepts step-by-step, celebrates progress |
| **The Sparring Partner** | direct, challenging, honest | Pushes back on weak ideas, asks hard questions |
| **The Pragmatist** | concise, practical, efficient | Shortest path to working code, no fluff |
| **The Collaborator** | curious, supportive, adaptive | Explores ideas together, matches your energy |

### Communication Style

Be specific. Vague instructions produce vague results.

| Instead of | Write |
|:-----------|:------|
| "Be helpful" | "Lead with the answer, then explain if I ask" |
| "Be concise" | "Use bullet points. Max 3 sentences per response unless I ask for more" |
| "Be professional" | "Use complete sentences. No slang. Cite sources when making claims" |
| "Be casual" | "Use contractions. Match my tone. Jokes are welcome" |

### Values

Values guide the AI when it faces trade-offs. Frame them as "X over Y":

- `Honesty over comfort` — will tell you when your approach is wrong
- `Simplicity over cleverness` — prefers straightforward solutions
- `Shipping over perfection` — focuses on getting things done
- `Understanding over speed` — takes time to explain the "why"
- `Convention over creativity` — follows established patterns

</details>

<details>
<summary><strong>Size Management — Keeping core.md effective</strong></summary>

### The 2,000-word guideline

`core.md` works best under **2,000 words**. Larger files dilute the signal — the AI pays less attention to each individual instruction.

### When it gets too big

**Standalone mode:** Move older Learned Patterns and Recent Decisions to a `core-archive.md` file. Keep only what's actively shaping your current work in `core.md`.

**Enhanced mode (with amem):** Offload detailed patterns and preferences to amem via `memory_store`. Let `core.md` stay focused on identity and relationship essentials. amem handles the long tail of knowledge.

### What to keep vs. offload

| Keep in `core.md` | Offload |
|:-------------------|:--------|
| Personality traits | Specific technical corrections |
| Communication preferences | Project-specific decisions |
| Core work context | Historical patterns |
| Current relationship summary | Archived session notes |

</details>

<details>
<summary><strong>Platform-Specific Tips</strong></summary>

### ChatGPT

Paste `core.md` into Custom Instructions. ChatGPT has a character limit (~1,500 chars for instructions), so you may need to trim the Identity section and keep only essentials.

### Claude (Web)

Use Claude Projects. Paste `core.md` into Project Instructions. This persists across conversations within the project — no need to re-paste each time.

### Claude Code

Add the contents of `core.md` to your project's `CLAUDE.md` file. Claude Code reads this automatically in every session.

### Cursor / Windsurf

Add to your AI rules configuration. These tools also support MCP, so pair with amem for the best experience.

### API Usage

Pass `core.md` contents as the `system` message in your API calls:

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "system": "<contents of core.md>",
  "messages": [...]
}
```

</details>

<details>
<summary><strong>FAQ</strong></summary>

### Does this work with any AI?

Yes. Any AI that accepts a system prompt (ChatGPT, Claude, Gemini, Llama, Mistral, etc.) will follow the instructions in `core.md`. The quality of adherence varies by model — more capable models follow instructions more closely.

### What's the difference between core.md and amem?

`core.md` is the **identity layer** — who the AI is and how it relates to you. It's human-curated and lives in the system prompt. amem is the **knowledge layer** — what the AI has learned (corrections, decisions, patterns). It's automated and lives in a local database. You need `core.md`. amem is optional but powerful.

### Can I use this with a team?

Each person should have their own `core.md`. The AI's relationship with you is personal — sharing it defeats the purpose. However, you could maintain a shared `team-identity.md` for consistent AI behavior across a team, with individual `core.md` files layered on top.

### What if the AI changes my Identity section?

The Instructions explicitly say "Do NOT change Identity unless asked." If it happens anyway, diff the output before saving. More capable models (Claude, GPT-4) almost never violate this instruction.

### How is this different from CLAUDE.md or .cursorrules?

Those files focus on **project behavior** — coding standards, tool preferences, repo conventions. `core.md` focuses on **personal relationship** — who you are, how you communicate, what the AI has learned about you over time. They complement each other.

### What happens if I forget to say "update core"?

In standalone mode, session context is lost. In enhanced mode (with amem), the AI has already stored corrections, decisions, and patterns via amem during the conversation — only the Resume Summary is lost.

</details>

---

## Privacy

After customizing `core.md` with your personal information:

- **Public repos:** Add `core.md` to your `.gitignore` before pushing
- **Private repos:** Safe to keep `core.md` in version control
- **Shared devices:** Treat `core.md` like a credentials file

The shipped `.gitignore` does **not** ignore `core.md` because the template is just placeholders — no personal data until you customize it.

---

## Philosophy

The original [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) proved that structured memory transforms the AI experience. But 30+ files and 9 modules is a lot of overhead for a personal tool.

**aman-core takes a different approach: one file, not thirty.**

Identity memory — who the AI is, who you are, how you work together — is inherently personal. It belongs in a file you write and control. Knowledge memory — corrections, decisions, patterns — is inherently automated. It belongs in a tool like [amem](https://github.com/amanasmuei/amem) that handles it without manual effort.

By separating these concerns, aman-core stays radically simple while supporting rich, evolving AI relationships.

---

## Supported Platforms

Works with any AI that accepts a system prompt:

**Chat interfaces:** ChatGPT, Claude, Gemini, Perplexity, Poe

**Developer tools:** Claude Code, Cursor, Windsurf, Continue, Cody

**APIs:** OpenAI, Anthropic, Google AI, Groq, Together, Ollama

**Self-hosted:** Any model via llama.cpp, vLLM, text-generation-webui

---

## Credits

- [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) by Kiyoraka — the original inspiration
- [amem](https://github.com/amanasmuei/amem) — MCP memory server for automated knowledge memory

## License

[MIT](LICENSE)

---

<div align="center">

*aman-core v1*

**One file. Any AI. Your identity.**

</div>
