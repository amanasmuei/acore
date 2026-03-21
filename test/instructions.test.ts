import { describe, it, expect } from "vitest";
import {
  FILE_BASED_INSTRUCTIONS,
  CLIPBOARD_INSTRUCTIONS,
  getUpdateInstructions,
} from "../src/lib/instructions.js";

describe("instructions", () => {
  it("FILE_BASED_INSTRUCTIONS contains direct write protocol", () => {
    expect(FILE_BASED_INSTRUCTIONS).toContain("Write updated version directly");
    expect(FILE_BASED_INSTRUCTIONS).toContain("~/.acore/core.md");
    expect(FILE_BASED_INSTRUCTIONS).toContain("Update Permissions");
    expect(FILE_BASED_INSTRUCTIONS).toContain("Session Awareness");
  });

  it("CLIPBOARD_INSTRUCTIONS contains output-based protocol", () => {
    expect(CLIPBOARD_INSTRUCTIONS).toContain("Output the complete updated core.md");
    expect(CLIPBOARD_INSTRUCTIONS).toContain("code block");
    expect(CLIPBOARD_INSTRUCTIONS).toContain("Update Permissions");
    expect(CLIPBOARD_INSTRUCTIONS).toContain("Session Awareness");
  });

  it("getUpdateInstructions returns file-based for claude-code", () => {
    expect(getUpdateInstructions("claude-code")).toBe(FILE_BASED_INSTRUCTIONS);
  });

  it("getUpdateInstructions returns file-based for cursor", () => {
    expect(getUpdateInstructions("cursor")).toBe(FILE_BASED_INSTRUCTIONS);
  });

  it("getUpdateInstructions returns file-based for windsurf", () => {
    expect(getUpdateInstructions("windsurf")).toBe(FILE_BASED_INSTRUCTIONS);
  });

  it("getUpdateInstructions returns clipboard for chatgpt", () => {
    expect(getUpdateInstructions("chatgpt")).toBe(CLIPBOARD_INSTRUCTIONS);
  });

  it("getUpdateInstructions returns clipboard for api", () => {
    expect(getUpdateInstructions("api")).toBe(CLIPBOARD_INSTRUCTIONS);
  });

  it("getUpdateInstructions returns clipboard for other", () => {
    expect(getUpdateInstructions("other")).toBe(CLIPBOARD_INSTRUCTIONS);
  });

  it("getUpdateInstructions returns clipboard for null", () => {
    expect(getUpdateInstructions(null)).toBe(CLIPBOARD_INSTRUCTIONS);
  });
});
