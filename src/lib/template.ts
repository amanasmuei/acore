import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getTemplatePath(name: string): string {
  // From dist/: ../template/
  const fromDist = path.join(__dirname, "..", "template", `${name}.md`);
  if (fs.existsSync(fromDist)) return fromDist;

  // From src/lib/: ../../template/
  const fromSrc = path.join(__dirname, "..", "..", "template", `${name}.md`);
  return fromSrc;
}

export function loadTemplate(name: "core" | "core-starter" | "context"): string {
  const templatePath = getTemplatePath(name);
  return fs.readFileSync(templatePath, "utf-8");
}

export function fillTemplate(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

/**
 * Build the Fundamental Truths markdown block for injection into a template.
 *
 * Returns an empty string when the archetype has no truths (the template
 * placeholder collapses cleanly). When truths are provided, returns a
 * self-contained markdown section including its trailing horizontal rule,
 * ready to drop in between the Identity and Relationship sections.
 */
export function renderFundamentalTruthsBlock(
  truths: readonly string[] | undefined
): string {
  if (!truths || truths.length === 0) return "";
  const bullets = truths.map((t) => `- ${t}`).join("\n");
  return `\n## Fundamental Truths\n\n> Re-read these at the start of each response to stay anchored.\n\n${bullets}\n\n---\n`;
}
