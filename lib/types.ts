export type ComponentCategory = "client" | "compute" | "data" | "network";

export interface ComponentType {
  id: string;
  label: string;
  glyph: string;
  category: ComponentCategory;
  hint: string;
}

export interface NodeData {
  id: string;
  typeId: string;
  label: string;
  x: number;
  y: number;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  label: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  match: string[];
}

export interface Challenge {
  id: string;
  title: string;
  brief: string;
  constraints: string[];
  checklist: ChecklistItem[];
}

export const NODE_WIDTH = 148;
export const NODE_HEIGHT = 64;
