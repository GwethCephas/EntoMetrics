import clintonJpg from "~/assets/team/clinton-adoga.jpg";
import clintonWebp from "~/assets/team/clinton-adoga.webp";
import fernanJpg from "~/assets/team/fernan-gizzi.jpg";
import fernanWebp from "~/assets/team/fernan-gizzi.webp";

export interface TeamPhoto {
  webp: string;
  jpg: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** null until the client supplies an approved photo. */
  photo: TeamPhoto | null;
  /** null until the client supplies the person's own LinkedIn URL. */
  linkedin: string | null;
}

export const team: TeamMember[] = [
  {
    name: "Clinton Adoga",
    role: "Executive Director and Lead Founder",
    bio: "Founder and programme builder who has led national innovation programmes in Kenya and co-founded AgriGlow, acquired by KALRO.",
    photo: { webp: clintonWebp, jpg: clintonJpg },
    linkedin: null,
  },
  {
    name: "Paul Murani",
    role: "IoT and Systems Engineer",
    bio: "Systems and data engineer with 5+ years building field-telemetry and remote-endpoint data systems; BEng, Electrical and Electronics Engineering, University of Nairobi.",
    photo: null,
    linkedin: null,
  },
  {
    name: "Mary Wairimu",
    role: "Operations and Field Data Lead",
    bio: "Epidemiology graduate (Masinde Muliro University of Science and Technology) experienced in health-data collection, monitoring and reporting.",
    photo: null,
    linkedin: null,
  },
  {
    name: "Fernán Gizzi",
    role: "Independent Scientific and Data Advisor",
    bio: "PhD candidate in Biological Sciences (IBR, CONICET-UNR) and co-founder of Agrosintex. Advises independently; protocols are pre-specified and scoring is blinded.",
    photo: { webp: fernanWebp, jpg: fernanJpg },
    linkedin: null,
  },
];

export const governanceStatement =
  "In Year 1 the scientific advisor acts strictly independently. Assay protocols and the statistical analysis plan are pre-specified before data collection, video scoring is blinded, and the advisor reviews the final analysis.";
