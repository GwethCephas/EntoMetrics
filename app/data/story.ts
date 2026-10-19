export type PillarIcon = "flask" | "sensor" | "document";

export interface Pillar {
  title: string;
  description: string;
  icon: PillarIcon;
}

export const storyBeats = {
  demand: {
    title: "Demand is scaling.",
    text: "Demand for alternative proteins is scaling rapidly across Africa as producers look to replace expensive soy and fishmeal in animal feed.",
  },
  blindSpot: {
    title: "A critical blind spot.",
    text: "Industrial rearing practices overwhelmingly treat insects purely as mechanical waste-conversion units. This rapid expansion creates a critical empirical and ethical blind spot.",
  },
  approach: {
    title: "Our approach.",
    text: "EntoMetrics Africa fills this gap by bridging biological research with low-cost hardware engineering, ensuring that alternative protein production across developing agricultural systems is scientifically grounded, resource-efficient and ethically responsible.",
  },
} as const;

export const pillars: Pillar[] = [
  {
    title: "Insect welfare science",
    description: "Empirical research on how larvae experience heat, handling and slaughter.",
    icon: "flask",
  },
  {
    title: "Micro-climate telemetry",
    description: "Low-cost, offline-capable substrate monitoring for tropical farms.",
    icon: "sensor",
  },
  {
    title: "Humane production standards",
    description: "Evidence to inform practical rules for producers and standard-setters.",
    icon: "document",
  },
];
