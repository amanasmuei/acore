# Multi-Project Support

Your identity is global. Your project context is local.

```
~/.acore/
  core.md              <- Who you are + who your AI is (shared everywhere)

~/project-a/
  .acore/context.md    <- Tech stack, session, project-specific patterns

~/project-b/
  .acore/context.md    <- Different stack, different session
```

Both files are automatically merged into one seamless prompt. The AI sees a unified identity — it doesn't know about the split.

| What | Where it lives | Changes when |
|:-----|:--------------|:-------------|
| AI personality, values, style | `~/.acore/core.md` | You evolve your AI's character |
| Your preferences, trust, dynamics | `~/.acore/core.md` | Your relationship deepens |
| Tech stack, domain, focus | `.acore/context.md` | You switch projects |
| Session state, active topics | `.acore/context.md` | Every session |

Splitting global identity from project context also helps keep each file small — well under the 2,000-token target.

## Setting Up a New Project

```bash
cd ~/my-other-project
npx @aman_asmuei/acore
```

Your identity carries over automatically. Only project-specific context is created.
