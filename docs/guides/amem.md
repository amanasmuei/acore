# Supercharge with amem

> **This section is optional.** `core.md` works perfectly on its own. amem adds automated knowledge memory for power users with MCP-compatible tools.

[**amem**](https://github.com/amanasmuei/amem) is a local-first MCP memory server for AI coding tools. It gives your AI automated knowledge memory — corrections, decisions, patterns — that persists across sessions without manual effort.

## Setup

```bash
npx @aman_asmuei/amem
```

> Works with **Claude Code**, **Cursor**, **Windsurf**, and any MCP-compatible tool.

## Without amem vs. With amem

| Without amem | With amem |
|:------------|:----------|
| You say "update core" to save learnings | AI **auto-updates** trust dynamics and emotional patterns |
| AI applies Memory Lifecycle rules when updating | AI **recalls** relevant past context via semantic search |
| Dynamics (trust, emotions) updated manually | AI **consolidates** memory using lifecycle rules |
| Context Modes work — just maintained by you | AI **overflows** history to amem with `[-> amem: topic]` pointers |

## amem MCP Tools

| Tool | What it does | When it's used |
|:-----|:------------|:---------------|
| `memory_store` | Saves corrections, decisions, patterns, preferences | During conversation — when the AI learns something |
| `memory_recall` | Semantic search across all past memories | When the AI needs context before asking you to repeat |
| `memory_inject` | Loads relevant corrections and decisions proactively | At session start — before you even ask |
| `memory_context` | Returns formatted context grouped by memory type | When the AI needs a structured overview of a topic |

## Architecture

```
  ~/.acore/core.md                     amem
  +---------------------+              +---------------------+
  |                     |              |                     |
  |  GLOBAL IDENTITY    |              |  KNOWLEDGE LAYER    |
  |                     |              |                     |
  |  > Who the AI is    |              |  > Corrections      |
  |  > Who you are      |              |  > Decisions        |
  |  > Trust & dynamics |<------------>|  > Patterns         |
  |  > Context modes    |  unified     |  > Overflow history |
  |  > Memory rules     |  ecosystem   |  > Consolidation    |
  |                     |              |                     |
  +---------------------+              |  Automated          |
  |  .acore/context.md  |              |  Local SQLite DB    |
  |  > Project stack    |              |                     |
  |  > Session state    |              +---------------------+
  |  > Local patterns   |
  |                     |
  +---------------------+
```
