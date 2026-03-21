<div align="center">

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/acore-identity_layer-white?style=for-the-badge&labelColor=0d1117&color=58a6ff">
  <img alt="acore" src="https://img.shields.io/badge/acore-identity_layer-black?style=for-the-badge&labelColor=f6f8fa&color=24292f">
</picture>

### The identity layer for AI companions.

Give any AI a persistent personality, emotional intelligence, and relationship memory — in a single file.

<br>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-any_LLM-brightgreen.svg?style=flat-square)](#-supported-platforms)
[![amem](https://img.shields.io/badge/enhanced_by-amem-ff6b35.svg?style=flat-square)](https://github.com/amanasmuei/amem)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#-contributing)

<br>

[**Get Started**](#-quick-start) · [**How It Works**](#-how-it-works) · [**amem Integration**](#-supercharge-with-amem) · [**Guides**](#-guides) · [**FAQ**](#-faq)

<br>

</div>

---

<br>

## 🎯 The Problem

Every time you start a new conversation with an AI, it forgets everything.

Your preferences. Your communication style. The context of your work. The decisions you made yesterday. **All gone.** You spend the first few minutes of every session re-explaining who you are and what you're working on.

## 💡 The Solution

**acore** is one markdown file — `core.md` — that you paste into any AI's system prompt.

It tells the AI:
- **Who it is** — personality, communication style, values, boundaries
- **Who you are** — your role, preferences, work context
- **Where you left off** — session summary, active topics, recent decisions
- **How your relationship works** — trust level, emotional patterns, conflict history
- **How to adapt** — context-aware behavior modes for coding, creative work, and personal conversations
- **What to remember and forget** — intelligent memory lifecycle with importance scoring

The AI reads it, behaves accordingly, and at the end of your session, you ask it to update the file. Next session, it picks up right where you left off.

> **No databases. No APIs. No accounts. Just a text file you control.**

---

<br>

## 🧠 The Key Insight

acore is built on one idea: **AI memory is two things, not one.**

<table>
<tr>
<td width="50%">

### 🪪 Identity Memory
**Human-curated · Lives in `core.md`**

- AI personality and values
- Your communication preferences
- Relationship dynamics & trust
- Emotional patterns & context modes
- Memory lifecycle rules
- Session continuity

*You write it. You own it.*
*The AI helps maintain it over time.*

</td>
<td width="50%">

### 🧬 Knowledge Memory
**Automated · Lives in [amem](https://github.com/amanasmuei/amem)**

- Corrections you've given
- Decisions you've made
- Patterns the AI noticed
- Project-specific facts

*The AI stores it automatically.*
*Searchable. Ranked. Evolving.*

</td>
</tr>
</table>

<br>

> **`core.md` works standalone.** amem is optional — but together they're powerful.

---

<br>

## ⚡ Quick Start

<table>
<tr>
<td>

### 1️⃣ &nbsp; Get the file

```bash
git clone https://github.com/amanasmuei/acore.git
cd acore
```

Or just [**download `core.md` directly**](core.md) — it's the only file you need.

</td>
</tr>
<tr>
<td>

### 2️⃣ &nbsp; Make it yours

Open `core.md` and replace the placeholders:

| Find & Replace | With | Example |
|:--------------|:-----|:--------|
| `[AI-NAME]` | Your AI's name | `Nova`, `Atlas`, `Sage`, `Kai` |
| `[USER-NAME]` | Your name | `Aman` |
| `[USER-ROLE]` | What you do | `Software Engineer`, `Designer` |

Then fill in the profile fields:

| Field | What to write | Tips |
|:------|:-------------|:-----|
| **Personality** | 3-5 character traits | Less is more — they compound. Try: `curious, direct, pragmatic` |
| **Communication** | How the AI should talk to you | Be specific: `concise by default, detailed when asked` |
| **Values** | What the AI prioritizes | Frame as trade-offs: `honesty over comfort` |
| **Boundaries** | Hard limits for the AI | `won't pretend to be human, flags when out of depth` |
| **Communication** (Relationship) | How you like to communicate | `prefers direct feedback, likes bullet points` |
| **Detail level** | How much detail you want | `concise`, `balanced`, or `thorough` |
| **Work** | Your tech stack and domain | `TypeScript, React, building SaaS` |
| **Personal** | Your goals and interests | `Learning Rust, interested in AI tooling` |
| **Learned patterns** | *Leave empty* | The AI fills this in over time |

</td>
</tr>
<tr>
<td>

### 3️⃣ &nbsp; Paste and go

Copy the contents of `core.md` into your AI's system prompt. That's it.

<details>
<summary>📋 <strong>Where to paste for each platform</strong></summary>

<br>

| Platform | Where to paste |
|:---------|:--------------|
| **ChatGPT** | Settings → Personalization → Custom Instructions |
| **Claude** (web) | Project → Project Instructions |
| **Claude Code** | Add to your project's `CLAUDE.md` |
| **Cursor** | Settings → Rules for AI, or `.cursorrules` |
| **Windsurf** | Settings → AI Rules |
| **Gemini** | Gems → Create a new Gem → Instructions |
| **Any LLM API** | Pass as the `system` message |

</details>

</td>
</tr>
</table>

---

<br>

## 🔄 How It Works

Every session follows a **3-phase lifecycle**:

<br>

```
 ╭──────────────────────────────────────────────────────────────╮
 │                                                              │
 │   ① SESSION START                                           │
 │   ──────────────                                            │
 │   Load core.md into system prompt.                          │
 │   AI reads the Resume Summary → picks up where you          │
 │   left off. Knows your name, preferences, and context.      │
 │                                                              │
 ├──────────────────────────────────────────────────────────────┤
 │                                                              │
 │   ② DURING SESSION                                          │
 │   ────────────────                                          │
 │   AI responds shaped by Identity (personality, style,       │
 │   values) and Relationship (your preferences, work          │
 │   context, learned patterns).                               │
 │                                                              │
 │   It feels like talking to the same AI every time.          │
 │                                                              │
 ├──────────────────────────────────────────────────────────────┤
 │                                                              │
 │   ③ SESSION END                                             │
 │   ─────────────                                             │
 │   Say "update core" → AI outputs full updated core.md       │
 │   in a code block → Copy it → Save it back.                │
 │                                                              │
 │   Next session picks up seamlessly.                         │
 │                                                              │
 ╰──────────────────────────────────────────────────────────────╯
```

<br>

### What's inside `core.md`

| Section | What it does | How often it changes |
|:--------|:------------|:--------------------|
| **Identity** | AI's name, personality, communication style, values, boundaries | Rarely — you set it once and refine over time |
| **Relationship** | Your preferences, work context, learned patterns | Grows as the AI learns about you |
| **Session** | Resume summary, active topics, temporary notes | Every session — this is your continuity layer |
| **Dynamics** | Trust & rapport, emotional patterns, conflict & repair history | Evolves over many sessions — the relationship deepens |
| **Context Modes** | Per-domain behavior (coding, creative, personal) | Set once, refined as AI learns your preferences per mode |
| **Memory Lifecycle** | What to remember, consolidate, and forget | Rarely — these are the operating rules for memory |
| **Instructions** | How to update, permission model, amem integration | Never — these are the system rules |

### The `update core` command

At the end of any session, say **"update core"**. The AI follows these steps:

| Step | What the AI does |
|:-----|:----------------|
| **1** | Reviews the conversation for new insights |
| **2** | Updates **Session** (resume summary, active topics, decisions) |
| **3** | Updates **Relationship** with anything new it learned about you |
| **4** | Updates **Dynamics** (trust, emotional patterns, conflict data) |
| **5** | Runs **Memory Lifecycle** rules (consolidate, compress, forget) |
| **6** | Outputs the **full** updated `core.md` in a code block |
| **7** | Flags any **Identity** changes for your explicit approval |

Copy the output → save it back to `core.md` → done.

---

<br>

## 🚀 Supercharge with amem

> 💡 **This section is optional.** `core.md` works perfectly on its own. amem adds automated knowledge memory for power users with MCP-compatible tools.

<br>

[**amem**](https://github.com/amanasmuei/amem) is a local-first MCP memory server for AI coding tools. It gives your AI automated knowledge memory — corrections, decisions, patterns — that persists across sessions without manual effort.

### Setup

```bash
npx @aman_asmuei/amem
```

> Works with **Claude Code**, **Cursor**, **Windsurf**, and any MCP-compatible tool.

<br>

### Before & After

<table>
<tr>
<td width="50%">

#### Without amem
- You say "update core" to save learnings
- Context limited to what's in `core.md`
- Resume via Summary only
- Search past context with grep

</td>
<td width="50%">

#### With amem ✨
- AI **auto-stores** corrections, decisions, patterns
- AI **recalls** relevant past context via semantic search
- AI **loads** prior corrections + decisions at session start
- AI **searches** with embeddings — no manual effort

</td>
</tr>
</table>

<br>

### amem MCP Tools

| Tool | What it does | When it's used |
|:-----|:------------|:---------------|
| `memory_store` | Saves corrections, decisions, patterns, preferences | During conversation — when the AI learns something |
| `memory_recall` | Semantic search across all past memories | When the AI needs context before asking you to repeat |
| `memory_inject` | Loads relevant corrections + decisions proactively | At session start — before you even ask |
| `memory_context` | Returns formatted context grouped by memory type | When the AI needs a structured overview of a topic |

<br>

### Architecture

```
  core.md                              amem
  ┌─────────────────────┐              ┌─────────────────────┐
  │                     │              │                     │
  │  IDENTITY LAYER     │              │  KNOWLEDGE LAYER    │
  │                     │              │                     │
  │  ▸ Who the AI is    │              │  ▸ Corrections      │
  │  ▸ Who you are      │◄────────────►│  ▸ Decisions        │
  │  ▸ How you work     │  complement  │  ▸ Patterns         │
  │    together         │  each other  │  ▸ Preferences      │
  │                     │              │                     │
  │  Human-curated      │              │  Automated          │
  │  System prompt      │              │  Local SQLite DB    │
  │                     │              │                     │
  └─────────────────────┘              └─────────────────────┘

  Identity stays in core.md — never stored in amem
  Knowledge stays in amem — never clutters core.md
```

---

<br>

## 📖 Guides

<details>
<summary><strong>🎨 Customization — Crafting your AI's personality</strong></summary>

<br>

### Personality Archetypes

Pick 3-5 traits. They compound — fewer is better.

| Archetype | Traits | What you get |
|:----------|:-------|:-------------|
| **The Mentor** | patient, thorough, encouraging | Teaches step-by-step, celebrates your progress |
| **The Sparring Partner** | direct, challenging, honest | Pushes back on weak ideas, asks hard questions |
| **The Pragmatist** | concise, practical, efficient | Shortest path to working code, zero fluff |
| **The Collaborator** | curious, supportive, adaptive | Explores ideas with you, matches your energy |
| **The Architect** | systematic, precise, forward-thinking | Plans before building, considers edge cases |

### Communication Style

Vague instructions → vague results. Be specific:

| ❌ Instead of | ✅ Write this |
|:-------------|:-------------|
| "Be helpful" | "Lead with the answer, then explain if I ask" |
| "Be concise" | "Max 3 sentences per response unless I ask for more" |
| "Be professional" | "Complete sentences. No slang. Cite sources." |
| "Be casual" | "Use contractions. Match my tone. Jokes welcome." |
| "Be thorough" | "Cover edge cases. Show me what could go wrong." |

### Values

Frame as trade-offs — the AI uses these when making judgment calls:

| Value | What it means in practice |
|:------|:------------------------|
| `Honesty over comfort` | Will tell you when your approach is wrong |
| `Simplicity over cleverness` | Prefers straightforward solutions |
| `Shipping over perfection` | Focuses on getting things done |
| `Understanding over speed` | Takes time to explain the "why" |
| `Convention over creativity` | Follows established patterns |
| `Safety over velocity` | Checks before making destructive changes |

</details>

<details>
<summary><strong>📐 Size Management — Keeping core.md effective</strong></summary>

<br>

### The 2,000-word rule

`core.md` works best under **2,000 words**. Beyond that, the AI starts paying less attention to individual instructions — the signal gets diluted.

### When it grows too big

| Mode | Strategy |
|:-----|:---------|
| **Standalone** | Move older Learned Patterns and Recent Decisions to `core-archive.md`. Keep only what's actively relevant. |
| **Enhanced (amem)** | Offload patterns and preferences to amem via `memory_store`. Let `core.md` focus on identity essentials. |

### What stays vs. what goes

| ✅ Keep in `core.md` | ➡️ Offload |
|:---------------------|:----------|
| Personality traits | Specific technical corrections |
| Communication preferences | Project-specific decisions |
| Core work context | Historical patterns |
| Current relationship summary | Old session notes |

</details>

<details>
<summary><strong>🖥️ Platform-Specific Setup</strong></summary>

<br>

### ChatGPT

Paste into **Custom Instructions**. Note: ChatGPT has a character limit (~1,500 chars), so you may need to trim to essentials.

### Claude (Web)

Use **Claude Projects** → paste into **Project Instructions**. Persists across all conversations in the project.

### Claude Code

Add contents to your project's **`CLAUDE.md`** file. Claude Code reads it automatically every session.

### Cursor / Windsurf

Add to **AI rules configuration**. Both support MCP — pair with amem for the best experience.

### API Usage

Pass as the `system` message:

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "system": "<contents of core.md>",
  "messages": [...]
}
```

</details>

---

<br>

## ❓ FAQ

<details>
<summary><strong>Does this work with any AI?</strong></summary>

<br>

Yes. Any AI that accepts a system prompt — ChatGPT, Claude, Gemini, Llama, Mistral, and more. The quality of adherence varies by model. More capable models follow instructions more closely.

</details>

<details>
<summary><strong>What's the difference between core.md and amem?</strong></summary>

<br>

**`core.md`** = identity layer (who the AI is, how it relates to you). Human-curated, lives in system prompt. **Required.**

**amem** = knowledge layer (what the AI has learned). Automated, lives in local database. **Optional.**

You always need `core.md`. amem supercharges it with automated memory.

</details>

<details>
<summary><strong>Can I use this with a team?</strong></summary>

<br>

Each person should have their own `core.md` — the AI's relationship with you is personal. For consistent team-wide AI behavior, maintain a shared `team-identity.md` with common values and standards, then layer individual `core.md` files on top.

</details>

<details>
<summary><strong>What if the AI changes my Identity section?</strong></summary>

<br>

The Instructions explicitly say "Do NOT change Identity unless asked." If it happens, diff the output before saving. More capable models (Claude, GPT-4) almost never violate this instruction.

</details>

<details>
<summary><strong>How is this different from CLAUDE.md or .cursorrules?</strong></summary>

<br>

Those files define **project behavior** — coding standards, tool preferences, repo conventions. `core.md` defines your **personal relationship** with the AI — who you are, how you communicate, what it's learned about you. They complement each other perfectly.

</details>

<details>
<summary><strong>What happens if I forget to say "update core"?</strong></summary>

<br>

**Standalone mode:** Session context is lost — you'll need to re-establish it next time.

**Enhanced mode (with amem):** The AI has already stored corrections, decisions, and patterns via amem during the conversation. Only the Resume Summary is lost.

</details>

<details>
<summary><strong>Can I version control my core.md?</strong></summary>

<br>

Yes — and you should! Git history gives you a timeline of how your AI relationship evolves. Just make sure it's in a **private repo** since it contains personal information after customization.

</details>

---

<br>

## 🔒 Privacy

After customizing `core.md` with your personal information:

| Scenario | What to do |
|:---------|:-----------|
| **Public repo** | Add `core.md` to `.gitignore` before pushing |
| **Private repo** | Safe to keep in version control |
| **Shared device** | Treat `core.md` like a credentials file |

> The shipped `.gitignore` does **not** ignore `core.md` — the template is just placeholders with no personal data. Once you fill in your details, managing privacy is your responsibility.

---

<br>

## 🌍 Supported Platforms

<table>
<tr>
<td width="25%">

**💬 Chat**
- ChatGPT
- Claude
- Gemini
- Perplexity
- Poe

</td>
<td width="25%">

**🛠️ Dev Tools**
- Claude Code
- Cursor
- Windsurf
- Continue
- Cody

</td>
<td width="25%">

**⚡ APIs**
- OpenAI
- Anthropic
- Google AI
- Groq
- Together

</td>
<td width="25%">

**🏠 Self-Hosted**
- Ollama
- llama.cpp
- vLLM
- text-gen-webui
- LM Studio

</td>
</tr>
</table>

---

<br>

## 💭 Philosophy

The original [Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) proved that structured memory transforms the AI experience. But complex multi-file systems are a lot of overhead for a personal tool.

**acore takes a different approach: one file, not thirty.**

Identity memory — who the AI is, who you are, how you work together — is inherently personal. It belongs in a file you write and control. Knowledge memory — corrections, decisions, patterns — is inherently automated. It belongs in a tool like [amem](https://github.com/amanasmuei/amem) that handles it without manual effort.

By separating these concerns, acore stays radically simple while supporting rich, evolving AI relationships.

---

<br>

## 🤝 Contributing

Contributions are welcome! Whether it's improving the `core.md` template, adding platform guides, or suggesting new features — open an issue or submit a PR.

---

## 🙏 Credits

- [**Project-AI-MemoryCore**](https://github.com/Kiyoraka/Project-AI-MemoryCore) by Kiyoraka — the original inspiration for structured AI memory
- [**amem**](https://github.com/amanasmuei/amem) — MCP memory server for automated knowledge memory

## 📄 License

[MIT](LICENSE)

---

<div align="center">

<br>

*acore v1*

**One file. Any AI. Your identity.**

<br>

</div>
