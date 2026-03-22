# Size Management — Keeping core.md Effective

## The 2,000-Token Rule

`core.md` works best under **2,000 tokens**. Beyond that, the AI starts paying less attention to individual instructions — the signal gets diluted.

## Multi-Project Split Helps

With the CLI, your identity lives in `~/.acore/core.md` and project context lives in `.acore/context.md`. This natural split keeps each file small.

## Memory Lifecycle Handles the Rest

The Memory Lifecycle section in `core.md` defines rules for consolidation and forgetting. When you say "update core," the AI applies these rules:

| Rule | What happens |
|:-----|:------------|
| **Consolidation** | Repetitive patterns merge into single observations |
| **Compression** | Similar entries become summaries |
| **Forgetting** | Stale session details (3+ sessions old) get removed |
| **Overflow** | In full mode, detailed history moves to amem with `[→ amem: topic]` pointers |

## What Stays vs. What Goes

| Keep in `core.md` | Offload |
|:---------------------|:----------|
| Personality traits | Specific technical corrections |
| Communication preferences | Old session details |
| Current trust and dynamics | Resolved conflict details (keep lesson) |
| Active context modes | Historical patterns (keep summary) |
| Memory lifecycle rules | Project-specific decisions |
