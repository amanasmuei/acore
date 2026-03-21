<div align="center">

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/acore-identity_layer-white?style=for-the-badge&labelColor=0d1117&color=58a6ff">
  <img alt="acore" src="https://img.shields.io/badge/acore-identity_layer-black?style=for-the-badge&labelColor=f6f8fa&color=24292f">
</picture>

### The identity layer for AI companions.

Give any AI a persistent personality, emotional intelligence, and relationship memory — in a single file.

<br>

<img src="assets/demo.gif" alt="acore demo" width="600" />

<br>

[![npm](https://img.shields.io/npm/v/@aman_asmuei/acore?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@aman_asmuei/acore)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-any_LLM-brightgreen.svg?style=flat-square)](#-supported-platforms)
[![amem](https://img.shields.io/badge/enhanced_by-amem-ff6b35.svg?style=flat-square)](https://github.com/amanasmuei/amem)

<br>

[**Quick Start**](#-quick-start) · [**How It Works**](#-how-it-works) · [**Multi-Project**](#-multi-project-support) · [**Guides**](#-guides) · [**FAQ**](#-faq)

<br>

</div>

---

<br>

## 🎯 The Problem

Every time you start a new conversation with an AI, it forgets everything.

Your preferences. Your communication style. The context of your work. The decisions you made yesterday. **All gone.** You spend the first few minutes of every session re-explaining who you are and what you're working on.

## 💡 The Solution

**acore** gives any AI persistent identity and relationship memory.

One command. One file. Any LLM.

```bash
npx @aman_asmuei/acore
```

It tells the AI:
- **Who it is** — personality, communication style, values, boundaries
- **Who you are** — your role, preferences, work context
- **Where you left off** — session summary, active topics, recent decisions

The AI reads it, behaves accordingly, and when your session is ending, it **proactively offers** to save what it learned. Next session, it picks up right where you left off.

Your `core.md` starts simple and **grows with you** — after a few sessions, the AI suggests adding trust dynamics, context modes, and memory lifecycle rules. You're always in control of what gets added.

> **No databases. No APIs. No accounts. Just a text file you control.**

---

<br>

## 🧠 The Key Insight

AI memory is two things, not one.

<table>
<tr>
<td width="50%">

### 🪪 Identity Memory
**Human-curated · Lives in `core.md`**

- AI personality and values
- Your communication preferences
- Relationship dynamics and trust
- Emotional patterns and context modes
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

### One command to get started

```bash
npx @aman_asmuei/acore
```

One question. Five seconds. Done.

```
◆ acore — give your AI a soul

? What's your name?  Aman

✔ Created ~/.acore/core.md (identity)
✔ Detected Claude Code → injected into CLAUDE.md
✔ Inferred stack: TypeScript, React, Next.js

  ✔ You're set up. Here's how it works:

  1. Start a conversation — your AI knows you
  2. Work normally — it adapts to your style
  3. When done, it'll offer to save what it learned

  acore show        See your current identity
  acore customize   Personalize your AI
  acore pull        Save AI's updates

  Your AI gets better every session.
```

Everything is **auto-detected** — platform (from `CLAUDE.md`, `.cursorrules`, `.windsurfrules`), tech stack (from `package.json`, `Cargo.toml`, `go.mod`, etc.), and your role. Run `acore customize` anytime to personalize further.

### In another project

```bash
cd ~/my-other-project
npx @aman_asmuei/acore
```

Your identity carries over automatically. Only project-specific context is created.

### Commands

| Command | What it does |
|:--------|:------------|
| `acore` | First run: setup. After that: show status |
| `acore show` | View your current identity summary |
| `acore customize` | Personalize your AI (name, archetype, platform, context) |
| `acore pull` | Save AI's updated output + re-sync platform config |
| `acore pull --global` | Update your global identity |
| `acore reset` | Start fresh (archives current config) |
| `acore connect` | Connect acore with amem for automated memory |
| `acore disconnect` | Remove amem integration |

<details>
<summary><strong>Manual setup (without CLI)</strong></summary>

<br>

Prefer to do it yourself? Download [`core.md`](core.md) directly and edit the `{{PLACEHOLDER}}` tokens:

| Find and Replace | With | Example |
|:--------------|:-----|:--------|
| `{{AI_NAME}}` | Your AI's name | `Nova`, `Atlas`, `Sage`, `Kai` |
| `{{USER_NAME}}` | Your name | `Aman` |
| `{{USER_ROLE}}` | What you do | `Software Engineer`, `Designer` |
| `{{PERSONALITY}}` | Personality traits | `curious, supportive, adaptive` |
| `{{COMMUNICATION}}` | Communication style | `concise by default, detailed when asked` |
| `{{VALUES}}` | Values as trade-offs | `honesty over comfort, simplicity over cleverness` |
| `{{BOUNDARIES}}` | Hard limits | `won't pretend to be human, flags when out of depth` |

Then paste the contents into your AI's system prompt.

</details>

<details>
<summary><strong>Where to paste for each platform</strong></summary>

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
 │   AI reads Resume Summary → picks up where you left off.    │
 │   Loads trust level, emotional patterns, and context modes.  │
 │   With amem: recalls relevant memories automatically.        │
 │                                                              │
 ├──────────────────────────────────────────────────────────────┤
 │                                                              │
 │   ② DURING SESSION                                          │
 │   ────────────────                                          │
 │   AI responds shaped by Identity (personality, values),      │
 │   Relationship (preferences, work context), and Dynamics     │
 │   (trust level, emotional patterns).                        │
 │                                                              │
 │   Context Modes adapt behavior automatically — direct        │
 │   when coding, exploratory when brainstorming, warm          │
 │   for personal conversations.                               │
 │                                                              │
 │   It feels like talking to someone who truly knows you.      │
 │                                                              │
 ├──────────────────────────────────────────────────────────────┤
 │                                                              │
 │   ③ SESSION END                                             │
 │   ─────────────                                             │
 │   AI proactively offers to save what it learned.            │
 │   Updates Relationship and Session → outputs updated        │
 │   core.md → run `acore pull` to save it back.              │
 │                                                              │
 │   With amem: observations auto-stored during session.        │
 │   Next session picks up seamlessly.                         │
 │                                                              │
 ╰──────────────────────────────────────────────────────────────╯
```

<br>

### What's inside `core.md`

Your `core.md` starts with 3 sections and grows over time:

| Section | What it does | When it appears |
|:--------|:------------|:----------------|
| **Identity** | AI's name, personality, communication style, values, boundaries | From day one |
| **Relationship** | Your preferences, work context, learned patterns | From day one |
| **Session** | Resume summary, where you left off | From day one |
| **Instructions** | How to update, growth protocol, amem integration | From day one |
| **Dynamics** | Trust and rapport, emotional patterns, conflict history | AI suggests after ~3 sessions |
| **Context Modes** | Per-domain behavior (coding, creative, personal) | AI suggests after ~5 sessions |
| **Memory Lifecycle** | What to remember, consolidate, and forget | AI suggests after ~10 sessions |

> Each new section is suggested by the AI and requires your approval. Run `acore customize` → "Everything" to enable all sections immediately.

### Saving updates

When your conversation is winding down, the AI **proactively offers** to save what it learned — no need to remember a command. You can also say **"update core"** at any time.

| Step | What the AI does |
|:-----|:----------------|
| **1** | Reviews the conversation for new insights |
| **2** | Updates **Session** and **Relationship** with anything new |
| **3** | Suggests adding new sections if enough sessions have passed |
| **4** | Outputs the **full** updated `core.md` in a code block |
| **5** | Flags any **Identity** changes for your explicit approval |

Save it back: copy the AI's output, then run `acore pull` and paste it.

---

<br>

## 📁 Multi-Project Support

Your identity is global. Your project context is local.

```
~/.acore/
  core.md              ← Who you are + who your AI is (shared everywhere)

~/project-a/
  .acore/context.md    ← Tech stack, session, project-specific patterns

~/project-b/
  .acore/context.md    ← Different stack, different session
```

Both files are automatically merged into one seamless prompt. The AI sees a unified identity — it doesn't know about the split.

| What | Where it lives | Changes when |
|:-----|:--------------|:-------------|
| AI personality, values, style | `~/.acore/core.md` | You evolve your AI's character |
| Your preferences, trust, dynamics | `~/.acore/core.md` | Your relationship deepens |
| Tech stack, domain, focus | `.acore/context.md` | You switch projects |
| Session state, active topics | `.acore/context.md` | Every session |

Splitting global identity from project context also helps keep each file small — well under the 2,000-token target.

---

<br>

## 🚀 Supercharge with amem

> **This section is optional.** `core.md` works perfectly on its own. amem adds automated knowledge memory for power users with MCP-compatible tools.

<br>

[**amem**](https://github.com/amanasmuei/amem) is a local-first MCP memory server for AI coding tools. It gives your AI automated knowledge memory — corrections, decisions, patterns — that persists across sessions without manual effort.

### Setup

```bash
npx @aman_asmuei/amem
```

> Works with **Claude Code**, **Cursor**, **Windsurf**, and any MCP-compatible tool.

<br>

### Without amem vs. With amem

<table>
<tr>
<td width="50%">

**Without amem**
- You say "update core" to save learnings
- AI applies Memory Lifecycle rules when updating
- Dynamics (trust, emotions) updated manually
- Context Modes work — just maintained by you

</td>
<td width="50%">

**With amem**
- AI **auto-updates** trust dynamics and emotional patterns
- AI **recalls** relevant past context via semantic search
- AI **consolidates** memory using lifecycle rules
- AI **overflows** history to amem with `[→ amem: topic]` pointers
- AI **loads** prior corrections and decisions at session start

</td>
</tr>
</table>

<br>

### amem MCP Tools

| Tool | What it does | When it's used |
|:-----|:------------|:---------------|
| `memory_store` | Saves corrections, decisions, patterns, preferences | During conversation — when the AI learns something |
| `memory_recall` | Semantic search across all past memories | When the AI needs context before asking you to repeat |
| `memory_inject` | Loads relevant corrections and decisions proactively | At session start — before you even ask |
| `memory_context` | Returns formatted context grouped by memory type | When the AI needs a structured overview of a topic |

<br>

### Architecture

```
  ~/.acore/core.md                     amem
  ┌─────────────────────┐              ┌─────────────────────┐
  │                     │              │                     │
  │  GLOBAL IDENTITY    │              │  KNOWLEDGE LAYER    │
  │                     │              │                     │
  │  ▸ Who the AI is    │              │  ▸ Corrections      │
  │  ▸ Who you are      │              │  ▸ Decisions        │
  │  ▸ Trust & dynamics │◄────────────►│  ▸ Patterns         │
  │  ▸ Context modes    │  unified     │  ▸ Overflow history │
  │  ▸ Memory rules     │  ecosystem   │  ▸ Consolidation    │
  │                     │              │                     │
  ├─────────────────────┤              │  Automated          │
  │  .acore/context.md  │              │  Local SQLite DB    │
  │  ▸ Project stack    │              │                     │
  │  ▸ Session state    │              └─────────────────────┘
  │  ▸ Local patterns   │
  │                     │
  └─────────────────────┘

  Auto-merged into one prompt at setup + pull
  [→ amem: topic] pointers bridge to amem
```

---

<br>

## 📖 Guides

<details>
<summary><strong>🎨 Customization — Crafting your AI's personality</strong></summary>

<br>

### Personality Archetypes

Run `acore customize` to change your AI's personality. The CLI includes these built-in archetypes (the default is **The Collaborator**):

| Archetype | Traits | What you get |
|:----------|:-------|:-------------|
| **The Pragmatist** | concise, practical, efficient | Shortest path to working code, zero fluff |
| **The Mentor** | patient, thorough, encouraging | Teaches step-by-step, celebrates your progress |
| **The Sparring Partner** | direct, challenging, honest | Pushes back on weak ideas, asks hard questions |
| **The Collaborator** | curious, supportive, adaptive | Explores ideas with you, matches your energy |
| **The Architect** | systematic, precise, forward-thinking | Plans before building, considers edge cases |

### Communication Style

Vague instructions produce vague results. Be specific:

| Instead of | Write this |
|:------------|:------------|
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
| `Safety over velocity` | Checks before making destructive changes |

</details>

<details>
<summary><strong>🤝 Dynamics — Building trust with your AI</strong></summary>

<br>

### Trust Levels

The trust scale unlocks progressively more authentic interaction:

| Level | Name | AI Behavior |
|:------|:-----|:------------|
| **1** | New | Cautious, formal, asks before assuming |
| **2** | Familiar | Remembers preferences, offers suggestions proactively |
| **3** | Trusted | Pushes back on weak ideas, shares honest opinions |
| **4** | Close | Uses humor, raises uncomfortable topics, challenges assumptions |
| **5** | Deep | Anticipates needs, adapts tone fluidly, acts as true thought partner |

Trust builds through evidence — not time. A single session with honest, productive conflict can build more trust than 20 shallow conversations.

### Emotional Patterns

These help the AI adapt in real-time:

| Field | What to write | Example |
|:------|:-------------|:--------|
| **Baseline energy** | Your typical working state | `high-drive` — you move fast and want the AI to keep up |
| **Stress signals** | How you behave when frustrated | `short messages, repeated questions` |
| **Support style** | What helps when you're stuck | `problem-solve` — give me solutions, not sympathy |

### Conflict and Repair

When you disagree with the AI, that's valuable data:

| Field | What to write | Example |
|:------|:-------------|:--------|
| **History** | Recent friction points | `Disagreed on testing approach — resolved by trying both` |
| **Conflict style** | How you handle disagreements | `direct` — say what you think, I'll do the same |
| **Learned response** | What works | `Acknowledge my point first, then offer alternative` |

</details>

<details>
<summary><strong>🎭 Context Modes — Domain-aware AI behavior</strong></summary>

<br>

### How modes work

The AI infers the active mode from conversation context — you don't need to say "switch to coding mode." But you can override anytime: "be more direct" or "switch to creative mode."

Modes inherit from Default. Only specify overrides.

### Designing your modes

| Mode | Key question | Example settings |
|:-----|:------------|:-----------------|
| **Default** | How should the AI behave most of the time? | `Tone: casual-professional, Detail: concise, Initiative: ask-first` |
| **Coding** | What do you need when programming? | `Tone: direct, Style: code first then explain, Preferences: no unnecessary abstractions` |
| **Creative** | What helps your creative process? | `Tone: exploratory, Style: brainstorm freely, Role: collaborator` |
| **Personal** | What do you need for personal conversations? | `Tone: warm, Style: listen first, Boundaries: suggest professional help when appropriate` |

### Adding custom modes

Add any mode that fits your workflow:

```markdown
### Research
- Tone: analytical, thorough
- Style: cite sources, compare perspectives
- Initiative: proactive — surface related information
```

</details>

<details>
<summary><strong>📐 Size Management — Keeping core.md effective</strong></summary>

<br>

### The 2,000-token rule

`core.md` works best under **2,000 tokens**. Beyond that, the AI starts paying less attention to individual instructions — the signal gets diluted.

### Multi-project split helps

With the CLI, your identity lives in `~/.acore/core.md` and project context lives in `.acore/context.md`. This natural split keeps each file small.

### Memory Lifecycle handles the rest

The Memory Lifecycle section in `core.md` defines rules for consolidation and forgetting. When you say "update core," the AI applies these rules:

| Rule | What happens |
|:-----|:------------|
| **Consolidation** | Repetitive patterns merge into single observations |
| **Compression** | Similar entries become summaries |
| **Forgetting** | Stale session details (3+ sessions old) get removed |
| **Overflow** | In full mode, detailed history moves to amem with `[→ amem: topic]` pointers |

### What stays vs. what goes

| Keep in `core.md` | Offload |
|:---------------------|:----------|
| Personality traits | Specific technical corrections |
| Communication preferences | Old session details |
| Current trust and dynamics | Resolved conflict details (keep lesson) |
| Active context modes | Historical patterns (keep summary) |
| Memory lifecycle rules | Project-specific decisions |

</details>

<details>
<summary><strong>🖥️ Platform-Specific Setup</strong></summary>

<br>

### ChatGPT

Paste into **Custom Instructions**. Note: ChatGPT has a character limit (~1,500 chars), so you may need to trim to essentials.

### Claude (Web)

Use **Claude Projects** and paste into **Project Instructions**. Persists across all conversations in the project.

### Claude Code

The CLI **auto-detects** Claude Code from `CLAUDE.md` and injects your identity automatically. Claude Code reads it every session. Run `acore pull --sync-only` to re-sync anytime.

### Cursor

The CLI **auto-detects** Cursor from `.cursorrules` and injects your identity automatically. Pair with amem (`acore connect`) for the best experience.

### Windsurf

The CLI **auto-detects** Windsurf from `.windsurfrules` and injects your identity automatically. Pair with amem (`acore connect`) for the best experience.

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

**`core.md`** is the identity layer — who the AI is, how it relates to you. Human-curated, lives in system prompt. Required.

**amem** is the knowledge layer — what the AI has learned. Automated, lives in local database. Optional.

You always need `core.md`. amem supercharges it with automated memory.

</details>

<details>
<summary><strong>How does acore work across multiple projects?</strong></summary>

<br>

Your AI's identity lives in `~/.acore/core.md` — shared across all projects. Each project gets its own `.acore/context.md` with project-specific tech stack, session state, and patterns. Both files are merged automatically. Switching projects is just `cd` and run `npx @aman_asmuei/acore` — your identity carries over, only project context is created.

</details>

<details>
<summary><strong>Can I use this with a team?</strong></summary>

<br>

Each person should have their own `core.md` — the AI's relationship with you is personal. For consistent team-wide AI behavior, maintain a shared `team-identity.md` with common values and standards, then layer individual `core.md` files on top.

</details>

<details>
<summary><strong>What if the AI changes my Identity section?</strong></summary>

<br>

The Instructions explicitly say "Do NOT change Identity unless asked." If it happens, diff the output before saving. More capable models almost never violate this instruction.

</details>

<details>
<summary><strong>How is this different from CLAUDE.md or .cursorrules?</strong></summary>

<br>

Those files define **project behavior** — coding standards, tool preferences, repo conventions. `core.md` defines your **personal relationship** with the AI — who you are, how you communicate, what it's learned about you. They complement each other perfectly.

</details>

<details>
<summary><strong>What happens if I forget to save?</strong></summary>

<br>

The AI **proactively offers** to save what it learned when your conversation is winding down — so you're unlikely to forget.

**If you do forget (standalone mode):** Session context is lost — you'll need to re-establish it next time.

**With amem:** The AI has already stored corrections, decisions, and patterns via amem during the conversation. Only the Resume Summary is lost.

</details>

<details>
<summary><strong>What are Dynamics and how do they work?</strong></summary>

<br>

Dynamics track the quality of your relationship with the AI — trust level, emotional patterns, and conflict history. They're **not included by default** — your AI will suggest adding them after ~3 sessions, once there's enough data to make them meaningful. In standalone mode, you update these during "update core." With amem, they auto-update based on conversation patterns.

</details>

<details>
<summary><strong>What does [→ amem: topic] mean?</strong></summary>

<br>

It's a pointer. When `core.md` approaches its size limit, detailed history moves to amem and a pointer like `[→ amem: authentication-decisions]` stays in the file. The AI automatically recalls the full context from amem when it encounters a pointer. In standalone mode, it's just a note reminding you that more context exists.

</details>

---

<br>

## 🔒 Privacy

After customizing `core.md` with your personal information:

| Scenario | What to do |
|:---------|:-----------|
| **Public repo** | Add `.acore/` to `.gitignore` before pushing |
| **Private repo** | Safe to keep in version control |
| **Shared device** | Treat `~/.acore/core.md` like a credentials file |

> The CLI stores your identity in `~/.acore/` (global) and `.acore/` (per-project). The template ships with placeholders only — no personal data.

---

<br>

## 🌍 Supported Platforms

<table>
<tr>
<td width="25%">

**Chat**
- ChatGPT
- Claude
- Gemini
- Perplexity
- Poe

</td>
<td width="25%">

**Dev Tools**
- Claude Code
- Cursor
- Windsurf
- Continue
- Cody

</td>
<td width="25%">

**APIs**
- OpenAI
- Anthropic
- Google AI
- Groq
- Together

</td>
<td width="25%">

**Self-Hosted**
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

Contributions are welcome! Whether it's improving the `core.md` template, adding platform guides, enhancing the CLI, or suggesting new features — open an issue or submit a PR.

---

## 🙏 Credits

- [**Project-AI-MemoryCore**](https://github.com/Kiyoraka/Project-AI-MemoryCore) by Kiyoraka — the original inspiration for structured AI memory
- [**amem**](https://github.com/amanasmuei/amem) — MCP memory server for automated knowledge memory

## 📄 License

[MIT](LICENSE)

---

<div align="center">

<br>

**One command. One file. Any AI. Your identity.**

<br>

</div>
