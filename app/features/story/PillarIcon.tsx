import { FileCheck, FlaskConical, Radio, type LucideProps } from "lucide-react";
import type { PillarIcon as PillarIconName } from "~/data/story";

const icons = {
  flask: FlaskConical,
  sensor: Radio,
  document: FileCheck,
} as const;

export function PillarIcon({ name, ...props }: { name: PillarIconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden strokeWidth={1.5} {...props} />;
}
