export interface AcoreIdentity {
  aiName: string;
  userName: string;
  userRole: string;
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
}
