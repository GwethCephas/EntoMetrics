/**
 * Hardware specification table. Only enter values the client has confirmed;
 * everything else stays "TBC" (brief §5).
 */
export interface SpecRow {
  parameter: string;
  value: string;
  note?: string;
}

export const TBC = "TBC";

export const telemetrySpecs: SpecRow[] = [
  { parameter: "Measured variable", value: "Substrate temperature", note: "Per programme description" },
  { parameter: "Connectivity", value: "Low-bandwidth 2G (SMS)", note: "Per programme description" },
  { parameter: "Operating mode", value: "Offline-first", note: "Per programme description" },
  { parameter: "Sensor type", value: TBC },
  { parameter: "Measurement range", value: TBC },
  { parameter: "Accuracy", value: TBC },
  { parameter: "Sampling interval", value: TBC },
  { parameter: "Alert threshold", value: TBC, note: "Provisional until confirmed against the literature" },
  { parameter: "Power supply", value: TBC },
  { parameter: "Enclosure rating", value: TBC },
  { parameter: "Unit cost", value: TBC },
];

export const pipeline = [
  { id: "probe", label: "Probe in substrate", detail: "Measures substrate temperature in the rearing bed." },
  { id: "gateway", label: "2G SMS gateway", detail: "Sends an automated SMS over low-bandwidth 2G networks." },
  { id: "phone", label: "Operator phone", detail: "The facility operator receives the alert." },
  { id: "action", label: "Action", detail: "The operator adjusts aeration and ventilation." },
] as const;
