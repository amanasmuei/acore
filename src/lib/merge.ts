export interface ParsedSection {
  name: string;
  heading: string;
  content: string;
}

export interface ParsedMarkdown {
  preamble: string;
  sections: ParsedSection[];
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const lines = markdown.split("\n");
  const result: ParsedMarkdown = { preamble: "", sections: [] };
  let current: ParsedSection | null = null;
  let preambleLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) result.sections.push(current);
      const name = line.slice(3).trim();
      current = { name, heading: line, content: "" };
    } else if (current) {
      current.content += line + "\n";
    } else {
      preambleLines.push(line);
    }
  }
  if (current) result.sections.push(current);
  result.preamble = preambleLines.join("\n");
  return result;
}

export function findSection(parsed: ParsedMarkdown, name: string): ParsedSection | undefined {
  return parsed.sections.find((s) => s.name === name);
}

export function reassemble(parsed: ParsedMarkdown): string {
  let result = parsed.preamble;
  for (const section of parsed.sections) {
    result += "\n" + section.heading + "\n" + section.content;
  }
  return result.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function mergeConfigs(globalContent: string, localContent: string | null): string {
  if (!localContent) return globalContent;

  const global = parseMarkdown(globalContent);
  const local = parseMarkdown(localContent);

  const localWork = findSection(local, "Domain") || findSection(local, "Work");
  const localSession = findSection(local, "Session");
  const localPatterns = findSection(local, "Project Patterns");

  // Build merged sections
  const merged: ParsedMarkdown = { preamble: global.preamble, sections: [] };

  for (const section of global.sections) {
    if (section.name === "Relationship" && localWork) {
      // Inject local Work content into Relationship
      let content = section.content;
      // Replace the "- Work:" or "- Domain:" line with local domain content
      const workLineRegex = /^- (?:Work|Domain):.*$/m;
      if (workLineRegex.test(content)) {
        const workContent = localWork.content.trim().split("\n").map(l => l).join("\n");
        content = content.replace(workLineRegex, workContent);
      } else {
        // No Work line found, append work content
        content = content.trimEnd() + "\n" + localWork.content;
      }
      // Append project patterns if they exist
      if (localPatterns) {
        content = content.trimEnd() + "\n\n### Project Patterns\n" + localPatterns.content;
      }
      merged.sections.push({ ...section, content });
    } else if (section.name === "Session" && localSession) {
      // Replace global Session with local Session
      merged.sections.push({ ...localSession, heading: section.heading });
    } else {
      merged.sections.push(section);
    }
  }

  return reassemble(merged);
}
