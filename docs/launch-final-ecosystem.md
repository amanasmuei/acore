# aman — The Complete Portable AI Agent Ecosystem

## Full Ecosystem Summary

### 7 Configuration Layers

| Layer | Package | What it does | npm |
|:------|:--------|:-------------|:----|
| **Identity** | [acore](https://github.com/amanasmuei/acore) | Who your AI is — personality, values, trust, relationship memory. 12 CLI commands, web wizard, progressive growth. | `@aman_asmuei/acore` |
| **Memory** | [amem](https://github.com/amanasmuei/amem) | What your AI knows — automated knowledge storage via MCP. Corrections, decisions, patterns, semantic search. | `@aman_asmuei/amem` |
| **Tools** | [akit](https://github.com/amanasmuei/akit) | What your AI can do — 15 built-in tools (GitHub, databases, web search, etc). Auto-configures MCP on dev platforms, manual fallback everywhere else. | `@aman_asmuei/akit` |
| **Workflows** | [aflow](https://github.com/amanasmuei/aflow) | How your AI works — reusable step-by-step processes (code review, bug fix, feature build, daily standup). | `@aman_asmuei/aflow` |
| **Guardrails** | [arules](https://github.com/amanasmuei/arules) | What your AI won't do — safety boundaries, permissions, team rules. 6 categories, 24 starter rules. | `@aman_asmuei/arules` |
| **Evaluation** | [aeval](https://github.com/amanasmuei/aeval) | How good your AI is — session logging, trust tracking, relationship metrics, milestone recording. | `@aman_asmuei/aeval` |
| **Skills** | [askill](https://github.com/amanasmuei/askill) | What your AI can learn — 12 built-in skills (testing, API design, security, etc). Import your own, create custom, share with others. | `@aman_asmuei/askill` |

### 3 Integration Layers

| Integration | Package | What it does |
|:------------|:--------|:-------------|
| **Unified CLI** | [aman](https://github.com/amanasmuei/aman) | One command to set up the entire ecosystem. Status dashboard for all 7 layers. |
| **MCP Server** | [aman-mcp](https://github.com/amanasmuei/aman-mcp) | 11 MCP tools across all layers. Any MCP-compatible AI can read/write your identity, tools, workflows, rules, and evaluation. |
| **Claude Code Plugin** | [aman-plugin](https://github.com/amanasmuei/aman-plugin) | Auto-loads ecosystem every session. Slash commands: /identity, /tools, /workflows, /rules, /eval. Session-start hook. |

### 1 Runtime

| Runtime | Package | What it does |
|:--------|:--------|:-------------|
| **Agent** | [aman-agent](https://github.com/amanasmuei/aman-agent) | Your own AI companion running locally. Supports Claude and GPT. Streaming responses. Slash commands. No platform dependency. |

### By the Numbers

- **11 repositories**
- **7 configuration layers**
- **375+ tests**
- **15 built-in tools** (akit)
- **12 built-in skills** (askill)
- **4 starter workflows** (aflow)
- **24 starter guardrails** (arules)
- **11 MCP tools** (aman-mcp)
- **5 slash commands** (aman-plugin)
- **2 LLM backends** (Claude + GPT)
- **1 web wizard** (no CLI needed)
- **0 vendor lock-in**

---

## Launch Posts

---

### Twitter/X Thread (Viral Version)

**Tweet 1 (Hook)**

I built a complete AI agent ecosystem.

11 repos. 7 layers. One command.

Your AI gets identity, memory, tools, workflows, guardrails, skills, and evaluation.

Runs locally. Works with any LLM. No vendor lock-in.

Everything is a markdown file you own.

npx @aman_asmuei/aman-agent

**Tweet 2 (The problem)**

The problem with AI today:

ChatGPT doesn't know your name.
Claude forgets you every session.
Your tools don't transfer between platforms.
Your preferences are locked in one app.

You start over. Every. Single. Time.

**Tweet 3 (The stack)**

So I built 7 layers to fix every part of this:

acore — identity (who your AI IS)
amem — memory (what your AI KNOWS)
akit — tools (what your AI CAN DO)
aflow — workflows (HOW your AI works)
arules — guardrails (what your AI WON'T do)
aeval — evaluation (how GOOD your AI is)
askill — skills (what your AI CAN LEARN)

**Tweet 4 (The magic)**

The magic: everything is a markdown file.

core.md = personality
kit.md = tools
flow.md = workflows
rules.md = boundaries
skills.md = capabilities

Your AI reads them. Switch platforms? Bring your files. Done.

No databases. No cloud. No subscription.

**Tweet 5 (The runtime)**

But config files aren't enough.

So I built aman-agent — a local AI runtime that loads your entire ecosystem and gives you your own AI companion.

npx @aman_asmuei/aman-agent

Pick Claude or GPT. It streams responses, executes tools, follows your workflows, respects your rules.

Your AI. Your machine. Your data.

**Tweet 6 (Skills)**

The newest layer: askill.

Your AI can learn new skills:

askill add testing
askill add api-design
askill add security

12 built-in skills. Import your own. Create custom ones. Share with the community.

Your AI gets smarter every time you add a skill.

**Tweet 7 (The numbers)**

What shipped:

11 repos
7 layers
375+ tests
15 built-in tools
12 built-in skills
11 MCP tools
2 LLM backends (Claude + GPT)
1 web wizard
0 vendor lock-in

All open source. MIT licensed. Free forever.

**Tweet 8 (CTA)**

Try it:

Full setup:
npx @aman_asmuei/aman

Run your own agent:
npx @aman_asmuei/aman-agent

Web wizard (no CLI):
https://amanasmuei.github.io/acore/

GitHub:
https://github.com/amanasmuei/acore

Your AI should know who you are. And now it can.

---

### Reddit Post (r/artificial, r/LocalLLaMA, r/ChatGPT, r/ClaudeAI)

**Title:** I built a complete portable AI agent ecosystem — 11 repos, 7 layers, runs locally with Claude or GPT. Everything is markdown files you own.

**Body:**

I got tired of every AI conversation starting from zero. My AI doesn't know my name. My tools don't transfer between platforms. My preferences are locked in one app.

So I built **aman** — a complete AI companion ecosystem. 7 layers, each solving a different problem, each a simple markdown file:

**The 7 layers:**

1. **acore** (identity) — Who your AI is. Personality, values, communication style. It grows with you: trust dynamics after 3 sessions, context modes after 5, memory lifecycle after 10.

2. **amem** (memory) — What your AI knows. An MCP server that stores corrections, decisions, and patterns automatically. Semantic search across everything it's learned.

3. **akit** (tools) — What your AI can do. 15 built-in tools (GitHub, PostgreSQL, web search, Slack, etc). On Claude Code/Cursor — installs real MCP servers. On ChatGPT — guides you through manual steps.

4. **aflow** (workflows) — How your AI works. Define step-by-step processes: code review, bug fix, feature build, daily standup. AI follows them automatically.

5. **arules** (guardrails) — What your AI won't do. "Never push to main without approval." "Always ask before deleting." Safety in a readable file.

6. **aeval** (evaluation) — How good your AI is. Log sessions, track trust trajectory, record milestones. Data-driven relationship improvement.

7. **askill** (skills) — What your AI can learn. 12 built-in skills (testing, API design, security, debugging...). Import your own, create custom ones.

**The integrations:**

- **aman** — one command to set up everything: `npx @aman_asmuei/aman`
- **aman-mcp** — 11 MCP tools so any agent can read/write your ecosystem
- **aman-plugin** — Claude Code plugin with auto-loading and slash commands
- **aman-agent** — YOUR OWN LOCAL AI AGENT. Runs in terminal. Streams responses. Uses Claude or GPT.

**The key principle:** everything is a markdown file. `core.md`, `kit.md`, `flow.md`, `rules.md`, `skills.md`. Your AI reads these and behaves accordingly. Switch from Claude to GPT? Bring your files. No migration. No lock-in.

**Run your own agent:**

```
$ npx @aman_asmuei/aman-agent

Arienz is ready.

You > Review the latest PR
Arienz > Following the code-review workflow...
```

**Not a developer?** Web wizard at https://amanasmuei.github.io/acore/ — generate your identity in 60 seconds, paste into ChatGPT.

11 repos. 375+ tests. MIT licensed. Free forever.

Links:
- Main: https://github.com/amanasmuei/acore
- Agent runtime: https://github.com/amanasmuei/aman-agent
- All repos: aman, acore, amem, akit, aflow, arules, aeval, askill, aman-mcp, aman-plugin, aman-agent (all under github.com/amanasmuei)
- Web wizard: https://amanasmuei.github.io/acore/

Happy to answer questions.

---

### Facebook Post

Nak share something...

Ingat post masa Raya tu? Yang cerita pasal acore + amem — identity + memory untuk AI.

Lepas tu sambung bina. Dari 2 layer jadi 7. Dari config files jadi full agent runtime.

Sekarang the complete **aman** ecosystem:

1. **acore** — identity. Siapa AI kita, siapa kita.
2. **amem** — memory. Apa AI dah belajar.
3. **akit** — tools. 15 tools (GitHub, database, web search).
4. **aflow** — workflows. Step-by-step macam code review, bug fix.
5. **arules** — guardrails. Apa AI tak boleh buat.
6. **aeval** — evaluation. Track relationship quality.
7. **askill** — skills. 12 built-in skills. AI boleh belajar benda baru.

Dan yang paling best...

**aman-agent** — run your own AI companion locally.

```
npx @aman_asmuei/aman-agent
```

Pilih Claude atau GPT. AI tu load semua — identity, memory, tools, workflows, rules, skills. Terus boleh chat. Streaming. Real-time.

Takde platform lock-in. Takde subscription. Takde cloud.
AI kita. Machine kita. Data kita.

Semua guna markdown files. Readable. Portable. Yours.

11 repos. 375+ tests. Open source. Free forever.

Bukan developer? Ada web wizard — 60 saat je:
https://amanasmuei.github.io/acore/

GitHub: https://github.com/amanasmuei/acore

Kenapa nama **aman**? Sebab tu yang kita nak — rasa aman bila guna AI.

InsyaAllah bermanfaat.

---

### Threads Posts

**Post 1**

I built a complete AI agent ecosystem.

7 layers. 11 repos. Runs locally.

Your AI gets: identity, memory, tools, workflows, guardrails, skills, and evaluation.

Everything is a markdown file you own. Zero lock-in.

npx @aman_asmuei/aman-agent

https://github.com/amanasmuei/acore

**Post 2**

The layers:

acore — who your AI IS
amem — what your AI KNOWS
akit — what your AI CAN DO
aflow — HOW your AI works
arules — what your AI WON'T do
aeval — how GOOD your AI is
askill — what your AI CAN LEARN

7 layers. All markdown files. All portable.

**Post 3**

The killer feature: aman-agent.

Run your own AI companion locally. Pick Claude or GPT. It loads your entire identity, tools, workflows, skills — everything.

Your AI. Your machine. No subscription. No platform lock-in.

npx @aman_asmuei/aman-agent

**Post 4**

375+ tests. 12 built-in skills. 15 built-in tools. 11 MCP tools. Web wizard for non-developers.

Open source. MIT. Free forever.

Your AI should know who you are.

---

### Hacker News

**Title:** Aman: A portable AI agent ecosystem — identity, memory, tools, workflows, guardrails, skills, all as markdown files

---

### LinkedIn

I'm sharing the biggest project I've ever built: **aman** — a complete, portable AI agent ecosystem.

The problem is simple: every AI conversation starts from zero. Your AI doesn't know you. Your tools don't transfer between platforms. Your preferences are locked in one app.

My solution: 7 layers, each a markdown file you control.

1. Identity (acore) — who your AI is, how it relates to you
2. Memory (amem) — automated knowledge that persists
3. Tools (akit) — 15 portable capabilities
4. Workflows (aflow) — reusable AI processes
5. Guardrails (arules) — safety boundaries
6. Evaluation (aeval) — relationship metrics
7. Skills (askill) — teachable capabilities (12 built-in)

Plus integrations: an MCP server (11 tools), a Claude Code plugin, and a local agent runtime that lets you run your own AI companion with Claude or GPT.

The key: everything is a text file. No databases. No cloud. No vendor lock-in. Switch platforms — bring your files.

11 repositories. 375+ tests. MIT licensed.

Try it: `npx @aman_asmuei/aman-agent`

GitHub: https://github.com/amanasmuei/acore
Web wizard: https://amanasmuei.github.io/acore/

I'd genuinely love your feedback. What would you add? What's missing?

---

### Product Hunt (if submitting)

**Tagline:** The complete portable AI agent ecosystem — 7 layers, runs locally, zero lock-in

**Description:** aman gives any AI persistent identity, memory, tools, workflows, guardrails, skills, and evaluation. Everything is a markdown file you own. Run your own AI agent locally with Claude or GPT. 11 repos, 375+ tests, MIT licensed.

**Maker Comment:** I built this because I was tired of starting every AI conversation from zero. aman is the AI companion that knows you, remembers you, has tools, follows your workflows, respects your boundaries, learns new skills, and runs on your machine. No cloud, no subscription, no lock-in — just text files you control.
