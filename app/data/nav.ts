export interface NavItem {
  label: string;
  to: string;
}

// Order requested by the client (differs from brief §3: About Us was first and Team was part of it).
export const primaryNav: NavItem[] = [
  { label: "Research Hub", to: "/research" },
  { label: "Our Telemetry Tech", to: "/telemetry" },
  { label: "About Us", to: "/about" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Data and Ethics Statement", to: "/data-ethics" },
];
