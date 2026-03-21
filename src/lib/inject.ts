import fs from "node:fs";

const MARKER_START = "<!-- acore:start -->";
const MARKER_END = "<!-- acore:end -->";

export function injectIntoFile(filePath: string, content: string): { created: boolean; updated: boolean } {
  const wrapped = `${MARKER_START}\n${content.trim()}\n${MARKER_END}`;

  if (!fs.existsSync(filePath)) {
    // Create new file with just acore content
    fs.writeFileSync(filePath, wrapped + "\n", "utf-8");
    return { created: true, updated: false };
  }

  const existing = fs.readFileSync(filePath, "utf-8");

  // Check if markers already exist
  const startIdx = existing.indexOf(MARKER_START);
  const endIdx = existing.indexOf(MARKER_END);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing acore section
    const before = existing.slice(0, startIdx);
    const after = existing.slice(endIdx + MARKER_END.length);
    const updated = before + wrapped + after;
    fs.writeFileSync(filePath, updated, "utf-8");
    return { created: false, updated: true };
  }

  // Append acore section
  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(filePath, existing + separator + wrapped + "\n", "utf-8");
  return { created: false, updated: true };
}

export function removeFromFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const existing = fs.readFileSync(filePath, "utf-8");
  const startIdx = existing.indexOf(MARKER_START);
  const endIdx = existing.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) return false;

  const before = existing.slice(0, startIdx);
  const after = existing.slice(endIdx + MARKER_END.length);
  const cleaned = (before + after).replace(/\n{3,}/g, "\n\n").trim();

  if (cleaned.length === 0) {
    fs.unlinkSync(filePath);
  } else {
    fs.writeFileSync(filePath, cleaned + "\n", "utf-8");
  }
  return true;
}

export function hasAcoreSection(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf-8");
  return content.includes(MARKER_START) && content.includes(MARKER_END);
}
