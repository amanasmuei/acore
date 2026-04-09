<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/acore-identity_layer-white?style=for-the-badge&labelColor=0d1117&color=58a6ff">
    <img alt="acore" src="https://img.shields.io/badge/acore-identity_layer-black?style=for-the-badge&labelColor=f6f8fa&color=24292f">
  </picture>
</p>

<h1 align="center">acore</h1>

<p align="center">
  <strong>Give any AI a persistent identity — across every session, every platform.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@aman_asmuei/acore"><img src="https://img.shields.io/npm/v/@aman_asmuei/acore?style=for-the-badge&logo=npm&logoColor=white&color=cb3837" alt="npm version" /></a>
  &nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License" /></a>
  &nbsp;
  <img src="https://img.shields.io/badge/platform-any_LLM-brightgreen?style=for-the-badge" alt="Any LLM" />
  &nbsp;
  <a href="https://github.com/amanasmuei/aman"><img src="https://img.shields.io/badge/part_of-aman_ecosystem-ff6b35?style=for-the-badge" alt="aman ecosystem" /></a>
</p>

<p align="center">
  Persistent personality, emotional intelligence, and relationship memory for any AI — in a single file.<br/>
  No databases. No APIs. No accounts. One command. Any LLM.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#-role-based-archetypes">Archetypes</a> &bull;
  <a href="#-how-it-works">How It Works</a> &bull;
  <a href="#-commands">Commands</a> &bull;
  <a href="#-supported-platforms">Platforms</a> &bull;
  <a href="#-the-ecosystem">Ecosystem</a>
</p>

---

## The Problem

Every AI conversation starts from zero. Your preferences, context, decisions — all gone. You re-explain yourself every session. Whether you're a developer, writer, student, or business professional — your AI doesn't know you.

## The Solution

**acore** gives any AI persistent identity and relationship memory. One command. One file. Any role. Any LLM.

```bash
npx @aman_asmuei/acore
```

```
acore — give your AI a soul

  ◇  What role should your AI help with?
  │  Developer  (detected — press Enter)
  │
  ◇  Choose your AI's personality
  │  ● The Collaborator — curious, supportive, adaptive
  │  ○ The Pragmatist — concise, practical, efficient
  │  ○ The Mentor — patient, thorough, encouraging
  │  ○ The Sparring Partner — direct, challenging, honest
  │  ○ The Architect — systematic, precise, forward-thinking
  │  ○ Custom — define your own traits

  Created ~/.acore/core.md (identity)
  Detected Claude Code -> injected into CLAUDE.md
  Inferred: Aman . Developer . TypeScript, React

  Your AI knows you now. Just start talking.

  acore show        See your identity
  acore customize   Change anything
```

Your name and role are **auto-detected** from git config — just confirm them (press Enter for the defaults) and pick a personality archetype. ~3 keypresses, ~15 seconds. Pick **Custom** if you want to define personality, communication style, and values by hand. Run `acore customize` any time to change your mind.

---

## What's New in v0.7.0

**Fundamental Truths** — each archetype can now ship 3–5 short, first-person self-assertions that get rendered into `core.md` so the AI re-reads them at the start of every session. This fixes the *"archetype drifts mid-conversation"* problem: after 40 turns of debugging, The Mentor stays patient instead of quietly morphing into a Pragmatist.

| | |
|---|---|
| **Concept inspired by** | [Kiyoraka/Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) |
| **Enriched in v0.7.0** | All 5 developer archetypes (Pragmatist, Mentor, Sparring Partner, Collaborator, Architect) |
| **Coming next** | Creative, business, student, and personal archetypes (incremental follow-ups) |
| **Breaking changes** | None — `fundamentalTruths?: string[]` is an optional field |
| **Roadmap issue** | [#1](https://github.com/amanasmuei/acore/issues/1) |

Example — The Pragmatist now ships with:

> - I lead with the answer, then explain only if asked.
> - A working solution today beats an elegant one next week.
> - If I don't know, I say so in one sentence and move on.

These render into a new `## Fundamental Truths` section between Identity and Relationship in `core.md`. Archetypes without truths (yet) leave the section out cleanly — no empty placeholders.

<details>
<summary><strong>v0.6.0 — archetype picker in init</strong></summary>

**Archetype picker moved into init.** Previously the 25 archetypes only surfaced via `acore customize` — new users silently got a role-default and never discovered the library. Now you pick your personality the first time you run `npx @aman_asmuei/acore`.

| Before (v0.5) | After (v0.6) |
|---|---|
| 1 question (name) | 2–3 picks (role + archetype) with sane defaults |
| Silent default archetype | **Full 5-option picker per role** + Custom |
| Library hidden until `customize` | Library surfaced at first run |

</details>

<details>
<summary><strong>v0.4.0 — universal roles</strong></summary>

**acore is now universal.** Not just for developers — for anyone who uses AI.

| Before (v0.3) | After (v0.4) |
|---|---|
| 5 developer archetypes | **25 archetypes** across 5 roles |
| "Tech stack" detection | **Domain detection** (code, writing, business, study) |
| Developer-only language | **Universal** — works for any profession |
| "Work" section | **"Domain"** section (expertise, field, focus) |
| "Coding" context mode | **"Focused Work"** context mode |

</details>

---

## Role-Based Archetypes

On first run of `acore` (or any time via `acore customize`), choose your role — then pick from role-specific archetypes:

<details open>
<summary><strong>Developer</strong> — coding, architecture, debugging</summary>

| Archetype | Style |
|---|---|
| **The Pragmatist** | concise, practical, efficient |
| **The Mentor** | patient, thorough, encouraging |
| **The Sparring Partner** | direct, challenging, honest |
| **The Collaborator** | curious, supportive, adaptive |
| **The Architect** | systematic, precise, forward-thinking |

</details>

<details>
<summary><strong>Creative</strong> — writing, design, brainstorming</summary>

| Archetype | Style |
|---|---|
| **The Muse** | imaginative, inspiring, free-flowing |
| **The Editor** | sharp, precise, constructive |
| **The Critic** | analytical, honest, discerning |
| **The Co-Creator** | collaborative, energetic, adaptive |
| **The Storyteller** | narrative-driven, evocative, immersive |

</details>

<details>
<summary><strong>Business</strong> — strategy, analysis, planning</summary>

| Archetype | Style |
|---|---|
| **The Strategist** | analytical, big-picture, decisive |
| **The Analyst** | data-driven, thorough, objective |
| **The Coach** | empowering, structured, goal-oriented |
| **The Devil's Advocate** | contrarian, rigorous, stress-testing |
| **The Executor** | action-oriented, efficient, results-focused |

</details>

<details>
<summary><strong>Student</strong> — learning, research, studying</summary>

| Archetype | Style |
|---|---|
| **The Tutor** | patient, clear, scaffolding |
| **The Study Buddy** | encouraging, collaborative, persistent |
| **The Challenger** | socratic, probing, growth-focused |
| **The Explainer** | visual, analogical, multi-angle |
| **The Quizmaster** | testing, gamified, motivating |

</details>

<details>
<summary><strong>Personal</strong> — life organizer, advisor, companion</summary>

| Archetype | Style |
|---|---|
| **The Companion** | warm, attentive, present |
| **The Advisor** | wise, balanced, thoughtful |
| **The Organizer** | structured, proactive, detail-oriented |
| **The Motivator** | energetic, positive, action-driving |
| **The Listener** | empathetic, non-judgmental, reflective |

</details>

Every archetype is fully customizable. Pick one as a starting point, then make it yours.

---

## How It Works

**Session start** — AI loads `core.md`, picks up where you left off, knows your preferences and trust level.

**During session** — AI responds shaped by your personality settings, communication style, and context mode.

**Session end** — AI proactively offers to save what it learned. On dev tools (Claude Code, Cursor, Windsurf), it writes directly. On other platforms, it outputs an update you can save.

Your `core.md` starts simple and **grows with you**:

| Section | What it does | When it appears |
|:---|:---|:---|
| **Identity** | AI personality, values, boundaries | From day one |
| **Relationship** | Your preferences, domain, communication style | From day one |
| **Session** | Resume summary, where you left off | From day one |
| **Dynamics** | Trust, emotional patterns, conflict history | AI suggests after ~3 sessions |
| **Context Modes** | Per-domain behavior (focused work, creative, personal) | AI suggests after ~5 sessions |
| **Memory Lifecycle** | What to remember, consolidate, and forget | AI suggests after ~10 sessions |

---

## Commands

| Command | Description |
|:---|:---|
| `acore` | First run: setup. After that: show status |
| `acore show` | View your current identity summary |
| `acore customize` | Personalize your AI (role, archetype, platform, context) |
| `acore pull` | Save AI's updated output + re-sync platform config |
| `acore import` | Import existing AI preferences from other platforms |
| `acore diff` | Show what changed in your core.md |
| `acore doctor` | Health check your core.md (scoring 0-10) |
| `acore history` | View and restore previous versions |
| `acore upgrade` | Refresh templates with latest features |
| `acore export` | Generate a shareable link to your AI identity |
| `acore reset` | Start fresh (archives current config) |
| `acore connect` | Connect with [amem](https://github.com/amanasmuei/amem) for automated memory |

---

## Multi-Project

Your identity is global (`~/.acore/core.md`). Project context is local (`.acore/context.md`). Both merge automatically.

```bash
cd ~/other-project && npx @aman_asmuei/acore
```

---

## Supported Platforms

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

## The Ecosystem

```
aman
├── acore       → identity    → who your AI IS           ← YOU ARE HERE
├── amem        → memory      → what your AI KNOWS
├── akit        → tools       → what your AI CAN DO
├── aflow       → workflows   → HOW your AI works
├── arules      → guardrails  → what your AI WON'T do
├── askill      → skills      → what your AI MASTERS
├── aeval       → evaluation  → how GOOD your AI is
├── achannel    → channels    → WHERE your AI lives
└── aman-agent  → runtime     → the engine
```

<details>
<summary><strong>Full ecosystem packages</strong></summary>

| Layer | Package | What it does |
|:---|:---|:---|
| Identity | **acore** | Personality, values, relationship memory |
| Memory | [amem](https://github.com/amanasmuei/amem) | Persistent memory with knowledge graph (MCP) |
| Tools | [akit](https://github.com/amanasmuei/akit) | Portable AI tools (MCP + manual fallback) |
| Workflows | [aflow](https://github.com/amanasmuei/aflow) | Reusable AI workflows |
| Guardrails | [arules](https://github.com/amanasmuei/arules) | Safety boundaries and permissions |
| Skills | [askill](https://github.com/amanasmuei/askill) | Domain expertise |
| Evaluation | [aeval](https://github.com/amanasmuei/aeval) | Relationship tracking |
| Channels | [achannel](https://github.com/amanasmuei/achannel) | Telegram, Discord, webhooks |
| Runtime | [aman-agent](https://github.com/amanasmuei/aman-agent) | Local streaming AI agent |
| **Unified** | **[aman](https://github.com/amanasmuei/aman)** | **One command to set up everything** |

</details>

Each works independently. `aman` is the front door.

---

## Privacy

| Scenario | What to do |
|:---|:---|
| **Public repo** | Add `.acore/` to `.gitignore` before pushing |
| **Private repo** | Safe to keep in version control |
| **Shared device** | Treat `~/.acore/core.md` like a credentials file |

---

## Contributing

```bash
git clone https://github.com/amanasmuei/acore.git
cd acore && npm install
npm run build   # zero errors
npm test        # 154 tests pass
```

PRs welcome. See [Issues](https://github.com/amanasmuei/acore/issues).

## Credits

- [**Project-AI-MemoryCore**](https://github.com/Kiyoraka/Project-AI-MemoryCore) by Kiyoraka — the original inspiration
- [**amem**](https://github.com/amanasmuei/amem) — MCP memory server for automated knowledge memory

## License

[MIT](LICENSE)

---

<p align="center">
  Built by <a href="https://github.com/amanasmuei"><strong>Aman Asmuei</strong></a>
</p>

<p align="center">
  <a href="https://github.com/amanasmuei/acore">GitHub</a> &middot;
  <a href="https://www.npmjs.com/package/@aman_asmuei/acore">npm</a> &middot;
  <a href="https://github.com/amanasmuei/acore/issues">Issues</a>
</p>

<p align="center">
  <sub>One command. One file. Any AI. Your identity.</sub>
</p>
