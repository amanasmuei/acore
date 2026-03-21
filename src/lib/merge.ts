interface Section {
  heading: string;
  content: string;
}

function parseSections(markdown: string): Section[] {
  const lines = markdown.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { heading: line, content: "" };
    } else if (current) {
      current.content += line + "\n";
    } else {
      // Content before first ## (title line)
      if (!sections.length) {
        sections.push({ heading: "", content: line + "\n" });
      }
    }
  }
  if (current) sections.push(current);
  return sections;
}

function findSection(sections: Section[], name: string): Section | undefined {
  return sections.find((s) => s.heading.includes(name));
}

export function mergeConfigs(
  globalContent: string,
  localContent: string | null
): string {
  if (!localContent) return globalContent;

  const localSections = parseSections(localContent);
  const localWork = findSection(localSections, "Work");
  const localSession = findSection(localSections, "Session");
  const localPatterns = findSection(localSections, "Project Patterns");

  const lines = globalContent.split("\n");
  const result: string[] = [];
  let skipUntilNextSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      skipUntilNextSection = false;

      // Replace Work line in Relationship with local Work
      if (line.includes("Relationship") && localWork) {
        result.push(line);
        // Read Relationship content, replace Work line
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith("## ")) {
          const rl = lines[j];
          if (rl.startsWith("- Work:")) {
            // Replace with local work content
            const workLines = localWork.content.trim().split("\n");
            for (const wl of workLines) {
              result.push(wl);
            }
          } else {
            result.push(rl);
          }
          j++;
        }
        // Add project patterns after Relationship if exists
        if (localPatterns) {
          result.push("");
          result.push("### Project Patterns");
          result.push(localPatterns.content.trimEnd());
        }
        i = j - 1;
        continue;
      }

      // Replace Session with local Session
      if (line.includes("Session") && localSession) {
        result.push(localSession.heading || line);
        result.push(localSession.content.trimEnd());
        // Skip global Session content
        skipUntilNextSection = true;
        continue;
      }
    }

    if (skipUntilNextSection && !line.startsWith("## ")) {
      continue;
    }
    if (skipUntilNextSection && line.startsWith("## ")) {
      skipUntilNextSection = false;
    }

    result.push(line);
  }

  return result.join("\n");
}
