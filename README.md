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

</div>

---

## The Problem

Every AI conversation starts from zero. Your preferences, work context, decisions — all gone. You re-explain yourself every session.

## The Solution

**acore** gives any AI persistent identity and relationship memory. One command. One file. Any LLM.

```bash
npx @aman_asmuei/acore
```

```
◆ acore — give your AI a soul

✔ Created ~/.acore/core.md (identity)
✔ Detected Claude Code → injected into CLAUDE.md
✔ Inferred: Aman · Developer · TypeScript, React

  Your AI knows you now. Just start talking.

  acore show        See your identity
  acore customize   Change anything
```

Zero questions — your name, platform, and stack are auto-detected. Run `acore customize` to personalize further.

> **No databases. No APIs. No accounts. Just a text file you control.**

---

## How It Works

**Session start** — AI loads `core.md`, picks up where you left off, knows your preferences and trust level.

**During session** — AI responds shaped by your personality settings, communication style, and context mode (direct when coding, exploratory when brainstorming).

**Session end** — AI proactively offers to save what it learned. On dev tools (Claude Code, Cursor, Windsurf), it writes directly to your file. On other platforms, it outputs an update you can save.

Your `core.md` starts simple and **grows with you**:

| Section | What it does | When it appears |
|:--------|:------------|:----------------|
| **Identity** | AI personality, values, boundaries | From day one |
| **Relationship** | Your preferences, work context | From day one |
| **Session** | Resume summary, where you left off | From day one |
| **Dynamics** | Trust, emotional patterns, conflict history | AI suggests after ~3 sessions |
| **Context Modes** | Per-domain behavior (coding, creative, personal) | AI suggests after ~5 sessions |
| **Memory Lifecycle** | What to remember, consolidate, and forget | AI suggests after ~10 sessions |

---

## Commands

| Command | What it does |
|:--------|:------------|
| `acore` | First run: setup. After that: show status |
| `acore show` | View your current identity summary |
| `acore customize` | Personalize your AI (name, archetype, platform, context) |
| `acore pull` | Save AI's updated output + re-sync platform config |
| `acore upgrade` | Refresh templates with latest features |
| `acore export` | Generate a shareable link to your AI identity |
| `acore reset` | Start fresh (archives current config) |
| `acore connect` | Connect with [amem](https://github.com/amanasmuei/amem) for automated memory |

---

## Multi-Project

Your identity is global (`~/.acore/core.md`). Project context is local (`.acore/context.md`). Both merge automatically. [Learn more](docs/guides/multi-project.md)

```bash
cd ~/other-project && npx @aman_asmuei/acore
```

---

## Supercharge with amem

[**amem**](https://github.com/amanasmuei/amem) adds automated knowledge memory — corrections, decisions, patterns — without manual effort. Optional but powerful. [Learn more](docs/guides/amem.md)

```bash
npx @aman_asmuei/amem      # setup
acore connect               # link them
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

## Guides

- [Customization](docs/guides/customization.md) — personality archetypes, communication style, values
- [Dynamics & Trust](docs/guides/dynamics.md) — trust levels, emotional patterns, conflict repair
- [Context Modes](docs/guides/context-modes.md) — domain-aware AI behavior
- [Size Management](docs/guides/size-management.md) — keeping core.md under 2000 tokens
- [Platform Setup](docs/guides/platforms.md) — ChatGPT, Claude, Cursor, Windsurf, API
- [Multi-Project](docs/guides/multi-project.md) — global identity + local project context
- [amem Integration](docs/guides/amem.md) — automated knowledge memory
- [FAQ](docs/faq.md) — common questions

---

## Privacy

| Scenario | What to do |
|:---------|:-----------|
| **Public repo** | Add `.acore/` to `.gitignore` before pushing |
| **Private repo** | Safe to keep in version control |
| **Shared device** | Treat `~/.acore/core.md` like a credentials file |

---

## Contributing

Contributions welcome! Open an issue or submit a PR.

## Credits

- [**Project-AI-MemoryCore**](https://github.com/Kiyoraka/Project-AI-MemoryCore) by Kiyoraka — the original inspiration
- [**amem**](https://github.com/amanasmuei/amem) — MCP memory server for automated knowledge memory

## License

[MIT](LICENSE)

---

<div align="center">

**One command. One file. Any AI. Your identity.**

</div>
