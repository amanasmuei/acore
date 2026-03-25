export type UserRole = "developer" | "creative" | "business" | "student" | "personal" | "custom";

export const USER_ROLES: { value: UserRole; label: string; hint: string }[] = [
  { value: "developer", label: "Developer", hint: "coding, architecture, debugging" },
  { value: "creative", label: "Creative", hint: "writing, design, brainstorming" },
  { value: "business", label: "Business", hint: "strategy, analysis, planning" },
  { value: "student", label: "Student", hint: "learning, research, studying" },
  { value: "personal", label: "Personal", hint: "life organizer, advisor, companion" },
  { value: "custom", label: "Custom", hint: "define your own role" },
];

export interface AcoreIdentity {
  aiName: string;
  userName: string;
  userRole: string;
  role: UserRole;
  personality: string;
  communication: string;
  values: string[];
  boundaries: string;
}

export interface AcoreContext {
  stack: string;
  domain: string;
  focus: string;
}

export interface Archetype {
  name: string;
  label: string;
  description: string;
  personality: string;
  communication: string;
  values: string[];
  role: UserRole;
}
