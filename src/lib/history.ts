import { execFileSync } from "node:child_process";
import { getGlobalDir } from "./paths.js";

export function commitGlobalConfig(message: string): void {
  const dir = getGlobalDir();
  try {
    // Initialize git repo if needed (idempotent)
    execFileSync("git", ["init"], { cwd: dir, stdio: "ignore" });
    // Stage core.md
    execFileSync("git", ["add", "core.md"], { cwd: dir, stdio: "ignore" });
    // Check if there are changes to commit
    try {
      execFileSync("git", ["diff", "--cached", "--quiet"], {
        cwd: dir,
        stdio: "ignore",
      });
      // No changes, skip commit
      return;
    } catch {
      // There are changes, commit them
    }
    execFileSync("git", ["commit", "-m", message], {
      cwd: dir,
      stdio: "ignore",
    });
  } catch {
    // Git not available or failed — silently skip (non-critical feature)
  }
}
