import clintonJpg from "~/assets/team/clinton-adoga.jpg";
import clintonWebp from "~/assets/team/clinton-adoga.webp";
import fernanJpg from "~/assets/team/fernan-gizzi.jpg";
import fernanWebp from "~/assets/team/fernan-gizzi.webp";
import maryJpg from "~/assets/team/mary-wairimu.jpg";
import maryWebp from "~/assets/team/mary-wairimu.webp";
import paulJpg from "~/assets/team/paul-murani.jpg";
import paulWebp from "~/assets/team/paul-murani.webp";

export interface TeamPhoto {
  webp: string;
  jpg: string;
}

export interface TeamMember {
  name: string;
  role: string;
  /** What the person does at EntoMetrics Africa (supplied by the client). */
  responsibilities: string;
  /** Background and credentials, if supplied. */
  bio?: string;
  /** null until the client supplies an approved photo. */
  photo: TeamPhoto | null;
  /** Personal LinkedIn profile, or null if not supplied. */
  linkedin: string | null;
}

export const team: TeamMember[] = [
  {
    name: "Clinton Adoga",
    role: "Executive Director and Lead Founder",
    responsibilities:
      "Leads overall strategy, funder and partner relationships, and programme coordination across EntoMetrics Africa’s research pillars.",
    bio: "Founder and programme builder who has led national innovation programmes in Kenya and co-founded AgriGlow, acquired by KALRO.",
    photo: { webp: clintonWebp, jpg: clintonJpg },
    linkedin: "https://www.linkedin.com/in/clinton-adoga-92627a265",
  },
  {
    name: "Paul Murani",
    role: "IoT and Systems Engineer",
    responsibilities:
      "Handles hardware assembly, sensor deployment, probe calibration, and the 2G SMS gateway firmware that gets telemetry data out of off-grid facilities.",
    bio: "Systems and data engineer with 5+ years building field-telemetry and remote-endpoint data systems; BEng, Electrical and Electronics Engineering, University of Nairobi.",
    photo: { webp: paulWebp, jpg: paulJpg },
    linkedin: "https://www.linkedin.com/in/paul-murani",
  },
  {
    name: "Mary Wairimu",
    role: "Operations and Field Data Lead",
    responsibilities:
      "Runs facility audits and day-to-day field data collection in Kenya, manages farmer communications, and validates data pipelines before they’re passed on for analysis.",
    bio: "Epidemiology graduate (Masinde Muliro University of Science and Technology) experienced in health-data collection, monitoring and reporting.",
    photo: { webp: maryWebp, jpg: maryJpg },
    linkedin: "https://www.linkedin.com/in/mary-wairimu-3b34543b0",
  },
  {
    name: "Cephas Gweth",
    role: "Data Platform Engineer",
    responsibilities:
      "Builds the software layer that turns raw sensor readings into usable data: data pipelines, dashboards, alerts, and the web and mobile tools facility operators use.",
    photo: null, // photo to be supplied
    linkedin: "https://www.linkedin.com/in/cephas-gweth",
  },
  {
    name: "Fernán Gizzi",
    role: "Independent Scientific and Data Advisor",
    responsibilities:
      "Advises on research design and data analysis for the welfare science underpinning the telemetry work.",
    bio: "PhD candidate in Biological Sciences (IBR, CONICET-UNR) and co-founder of Agrosintex. Advises independently; protocols are pre-specified and scoring is blinded.",
    photo: { webp: fernanWebp, jpg: fernanJpg },
    linkedin: "https://www.linkedin.com/in/fernan-oscar-gizzi",
  },
];

export const governanceStatement =
  "In Year 1 the scientific advisor acts strictly independently. Assay protocols and the statistical analysis plan are pre-specified before data collection, video scoring is blinded, and the advisor reviews the final analysis.";
