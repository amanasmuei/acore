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
