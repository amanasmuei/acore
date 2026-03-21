import path from "node:path";
import os from "node:os";
import fs from "node:fs";

export function getGlobalDir(): string {
  return path.join(os.homedir(), ".acore");
}

export function getGlobalCorePath(): string {
  return path.join(getGlobalDir(), "core.md");
}

export function getLocalDir(): string {
  return path.join(process.cwd(), ".acore");
}

export function getLocalContextPath(): string {
  return path.join(getLocalDir(), "context.md");
}

export function globalConfigExists(dir?: string): boolean {
  const corePath = dir
    ? path.join(dir, "core.md")
    : getGlobalCorePath();
  return fs.existsSync(corePath);
}

export function localConfigExists(dir?: string): boolean {
  const contextPath = dir
    ? path.join(dir, "context.md")
    : getLocalContextPath();
  return fs.existsSync(contextPath);
}
