# MCP Directory Listings

Draft submissions for amem and aman-mcp to MCP directories.

---

## Server Details

### amem — AI Memory Server

| Field | Value |
|-------|-------|
| Package | `@aman_asmuei/amem` |
| GitHub | https://github.com/amanasmuei/amem |
| Install | `npx @aman_asmuei/amem` |
| Category | Memory / Knowledge Management |
| Tools | `memory_store`, `memory_recall`, `memory_inject`, `memory_context` |
| Compatible with | Claude Code, Cursor, Windsurf, any MCP-compatible tool |

**Short description:** Local-first MCP memory server for AI coding tools. Gives your AI automated knowledge memory — corrections, decisions, patterns — that persists across sessions.

### aman-mcp — Unified AI Companion Server

| Field | Value |
|-------|-------|
| Package | `@aman_asmuei/aman-mcp` |
| GitHub | https://github.com/amanasmuei/aman-mcp |
| Install | `npx @aman_asmuei/aman-mcp` |
| Category | AI Agent / Identity / Productivity |
| Tools | `identity_read`, `identity_summary`, `identity_update_session`, `tools_list`, `tools_search`, `workflow_list`, `workflow_get`, `rules_list`, `rules_check`, `eval_status`, `eval_log` |
| Compatible with | Claude Code, Cursor, Windsurf, any MCP-compatible tool |
| Part of | aman ecosystem (acore + amem + akit + aflow + arules + aeval) |

**Short description:** MCP server for the aman AI companion ecosystem. Gives your AI access to its own identity, tools, workflows, guardrails, and evaluation — 11 tools across 5 layers.

---

## 1. mcp.so

### amem

- **Name:** amem
- **Description:** Local-first MCP memory server for AI coding tools. Automated knowledge memory (corrections, decisions, patterns) that persists across sessions.
- **Install:** `npx @aman_asmuei/amem`
- **GitHub:** https://github.com/amanasmuei/amem
- **Tools:**
  - `memory_store` — Save observations, decisions, and corrections
  - `memory_recall` — Retrieve relevant memories by topic
  - `memory_inject` — Inject context into the current session
  - `memory_context` — Get consolidation candidates for memory lifecycle management

### aman-mcp

- **Name:** aman-mcp
- **Description:** MCP server for the aman AI companion ecosystem. Identity, tools, workflows, guardrails, and evaluation — 11 tools across 5 layers.
- **Install:** `npx @aman_asmuei/aman-mcp`
- **GitHub:** https://github.com/amanasmuei/aman-mcp
- **Tools:**
  - `identity_read` — Read the AI companion's identity (core.md)
  - `identity_summary` — Get a summary of current identity state
  - `identity_update_session` — Update session data
  - `tools_list` — List available tools
  - `tools_search` — Search tools by keyword
  - `workflow_list` — List available workflows
  - `workflow_get` — Get a specific workflow
  - `rules_list` — List active guardrails
  - `rules_check` — Check if an action passes guardrails
  - `eval_status` — Get evaluation status
  - `eval_log` — Log an evaluation entry

---

## 2. awesome-mcp-servers (github.com/punkpeye/awesome-mcp-servers)

### PR Title

Add amem and aman-mcp servers

### PR Body

Add two MCP servers from the aman AI companion ecosystem.

#### Memory category

- [amem](https://github.com/amanasmuei/amem) - Local-first memory server for AI coding tools. Automated knowledge memory (corrections, decisions, patterns) that persists across sessions. `npx @aman_asmuei/amem`

#### AI / Agents category

- [aman-mcp](https://github.com/amanasmuei/aman-mcp) - MCP server for the aman AI companion ecosystem. Identity, tools, workflows, guardrails, and evaluation — 11 tools across 5 layers. `npx @aman_asmuei/aman-mcp`

### Entries to add (matching repo format)

Under **Memory** section:

```markdown
- [amem](https://github.com/amanasmuei/amem) - Local-first memory server for AI coding tools. Automated knowledge memory that persists across sessions.
```

Under **AI / Agents** or **Productivity** section (whichever fits best):

```markdown
- [aman-mcp](https://github.com/amanasmuei/aman-mcp) - AI companion ecosystem server providing identity, tools, workflows, guardrails, and evaluation via 11 tools.
```

---

## 3. glama.ai/mcp/servers

### amem

- **Name:** amem
- **One-liner:** Local-first MCP memory server for AI coding tools
- **Description:** Gives your AI automated knowledge memory — corrections, decisions, patterns — that persists across sessions. Stores memories locally. No cloud dependency.
- **Install command:** `npx @aman_asmuei/amem`
- **Repository:** https://github.com/amanasmuei/amem
- **npm package:** `@aman_asmuei/amem`
- **Category:** Memory / Knowledge Management
- **Tools (4):** `memory_store`, `memory_recall`, `memory_inject`, `memory_context`
- **Compatibility:** Claude Code, Cursor, Windsurf, any MCP-compatible client

### aman-mcp

- **Name:** aman-mcp
- **One-liner:** Unified AI companion server — identity, tools, workflows, guardrails, evaluation
- **Description:** MCP server for the aman AI companion ecosystem. 11 tools across 5 layers: identity management, tool discovery, workflow execution, guardrail enforcement, and self-evaluation.
- **Install command:** `npx @aman_asmuei/aman-mcp`
- **Repository:** https://github.com/amanasmuei/aman-mcp
- **npm package:** `@aman_asmuei/aman-mcp`
- **Category:** AI Agent / Productivity
- **Tools (11):** `identity_read`, `identity_summary`, `identity_update_session`, `tools_list`, `tools_search`, `workflow_list`, `workflow_get`, `rules_list`, `rules_check`, `eval_status`, `eval_log`
- **Compatibility:** Claude Code, Cursor, Windsurf, any MCP-compatible client

---

## 4. smithery.ai

### amem

- **Name:** amem
- **Author:** amanasmuei
- **Description:** Local-first MCP memory server for AI coding tools. Automated knowledge memory (corrections, decisions, patterns) that persists across sessions.
- **Repository:** https://github.com/amanasmuei/amem
- **Install:** `npx @aman_asmuei/amem`
- **Tags:** memory, knowledge-management, local-first, persistence
- **Tools:**
  - `memory_store` — Save an observation, decision, or correction to persistent memory
  - `memory_recall` — Retrieve relevant memories by topic or keyword
  - `memory_inject` — Inject stored context into the current session
  - `memory_context` — Get consolidation candidates for memory lifecycle management

### aman-mcp

- **Name:** aman-mcp
- **Author:** amanasmuei
- **Description:** MCP server for the aman AI companion ecosystem. Identity, tools, workflows, guardrails, and evaluation — 11 tools across 5 layers.
- **Repository:** https://github.com/amanasmuei/aman-mcp
- **Install:** `npx @aman_asmuei/aman-mcp`
- **Tags:** ai-agent, identity, workflow, guardrails, evaluation, productivity
- **Tools:**
  - `identity_read` — Read the AI companion's full identity file
  - `identity_summary` — Get a summary of current identity state
  - `identity_update_session` — Update session-level data in identity
  - `tools_list` — List all available tools in the ecosystem
  - `tools_search` — Search tools by keyword or capability
  - `workflow_list` — List available workflows
  - `workflow_get` — Retrieve a specific workflow definition
  - `rules_list` — List active guardrails and rules
  - `rules_check` — Check if a proposed action passes guardrails
  - `eval_status` — Get current evaluation status
  - `eval_log` — Log an evaluation entry
