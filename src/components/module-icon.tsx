import {
  Education,
  Laptop,
  Chat,
  Time,
  Collaborate,
  Events,
  GroupSecurity,
  Favorite,
  UserMultiple,
  ChartLine,
  DocumentAudio,
} from "@carbon/icons-react";
import type { ComponentType, SVGProps } from "react";

const REGISTRY: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Education,
  Laptop,
  Chat,
  Time,
  Collaborate,
  Events,
  GroupSecurity,
  Favorite,
  UserMultiple,
  ChartLine,
  DocumentAudio,
};

export function ModuleIcon({ name, size = 24 }: { name?: string | null; size?: number }) {
  const Icon = (name && REGISTRY[name]) || Education;
  return <Icon width={size} height={size} aria-hidden />;
}
