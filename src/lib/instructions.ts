import type { InjectPlatform } from "./platform.js";

export const FILE_BASED_INSTRUCTIONS = `### Update Protocol
When user says "update core" OR when session is winding down:
1. Review conversation for new insights
2. Flag any Identity-level changes for explicit approval BEFORE proceeding
3. Read current ~/.acore/core.md
4. Write updated version directly to ~/.acore/core.md
5. Confirm what changed in 1-2 sentences

If file write fails for any reason, fall back to outputting the updated core.md in a code block.

### Update Permissions
- Auto-update (no approval needed): Session, Relationship.Work, Relationship.Learned patterns
- Approval required: Identity (any field), adding new sections
- Suggest only: structural changes to core.md

### Session Awareness
When the conversation is winding down:
- Proactively offer: "I noticed a few things this session. Want me to save them to your core?"
- If yes: follow Update Protocol (write directly)
- If no: respect it, don't ask again`;

export const CLIPBOARD_INSTRUCTIONS = `### Update Protocol
When user says "update core" OR when session is winding down:
1. Review conversation for new insights
2. Flag any Identity-level changes for explicit approval
3. Output the complete updated core.md in a code block
4. User saves manually (paste into acore pull or replace file directly)

### Update Permissions
- Auto-update (no approval needed): Session, Relationship.Work, Relationship.Learned patterns
- Approval required: Identity (any field), adding new sections
- Suggest only: structural changes to core.md

### Session Awareness
When the conversation is winding down:
- Proactively offer: "Want me to generate an updated core.md with what I learned this session?"
- If yes: follow Update Protocol
- If no: respect it, don't ask again`;

export function getUpdateInstructions(platform: InjectPlatform | null): string {
  if (platform === "claude-code" || platform === "cursor" || platform === "windsurf") {
    return FILE_BASED_INSTRUCTIONS;
  }
  return CLIPBOARD_INSTRUCTIONS;
}
