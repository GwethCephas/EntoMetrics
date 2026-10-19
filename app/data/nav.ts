export interface NavItem {
  label: string;
  to: string;
}

export const primaryNav: NavItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Research Hub", to: "/research" },
  { label: "Our Telemetry Tech", to: "/telemetry" },
  { label: "Contact", to: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Data and Ethics Statement", to: "/data-ethics" },
];
