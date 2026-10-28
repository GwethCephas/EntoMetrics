/**
 * Hardware specification table. Only enter values the client has confirmed;
 * everything else stays "TBC" (brief §5).
 */
export const SPEC_GROUPS = [
  { id: "stated", title: "Stated in the programme description" },
  { id: "planned", title: "Planned components" },
  { id: "pending", title: "To be confirmed" },
] as const;

export interface SpecRow {
  group: (typeof SPEC_GROUPS)[number]["id"];
  parameter: string;
  value: string;
  note?: string;
}

export const TBC = "TBC";

export const telemetrySpecs: SpecRow[] = [
  {
    group: "stated",
    parameter: "Measured variable",
    value: "Substrate temperature (the sensor also records humidity)",
    note: "Per programme description",
  },
  {
    group: "stated",
    parameter: "Connectivity",
    value: "SMS over low-bandwidth 2G, with dual-SIM failover and a 4G fallback",
    note: "Planned",
  },
  {
    group: "stated",
    parameter: "Operating mode",
    value: "Offline-first; readings stored on the device and sent when a signal returns",
    note: "Planned",
  },
  { group: "stated", parameter: "Local alarm", value: "Buzzer and light that work without any network", note: "Planned" },
  { group: "planned", parameter: "Sensor type", value: "SHT31-D with a PTFE membrane", note: "Planned" },
  { group: "planned", parameter: "Enclosure", value: "Grade-316 stainless-steel sleeve", note: "Planned" },
  { group: "planned", parameter: "Power supply", value: "Low-power electronics with battery backup", note: "Capacity TBC" },
  { group: "pending", parameter: "Measurement range", value: TBC },
  { group: "pending", parameter: "Accuracy", value: TBC },
  { group: "pending", parameter: "Sampling interval", value: TBC },
  {
    group: "pending",
    parameter: "Alert threshold",
    value: TBC,
    note: "Placeholder until the acute exposure-response work is done",
  },
  { group: "pending", parameter: "Unit cost", value: TBC },
];

export const pipeline = [
  { id: "probe", label: "Probe in substrate", detail: "Will measure substrate temperature in the rearing bed." },
  {
    id: "gateway",
    label: "SMS gateway",
    detail:
      "Will send an automated SMS over low-bandwidth 2G networks, with dual-SIM failover and a 4G fallback. Readings are stored on the device and sent when a signal returns.",
  },
  {
    id: "phone",
    label: "Operator phone",
    detail: "The facility operator and a named backup will receive the alert. Unanswered alerts escalate to the backup.",
  },
  {
    id: "action",
    label: "Action",
    detail:
      "The operator can then adjust aeration and ventilation. A local buzzer and light also alert staff on site without any network.",
  },
] as const;
