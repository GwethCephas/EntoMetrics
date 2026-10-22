import { LinkedInIcon } from "~/components/icons";
import { SectionHeader } from "~/components/ui";
import { governanceStatement, team, type TeamMember } from "~/data/team";
import { TeamPhoto } from "./TeamPhoto";

function TeamMemberEntry({ member }: { member: TeamMember }) {
  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-x-5 border-t border-rule pt-6 sm:grid-cols-[7rem_1fr] lg:block lg:border-t-0 lg:pt-0">
      <TeamPhoto member={member} />
      <div className="lg:mt-5">
        <h3>{member.name}</h3>
        <p className="mt-1 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.06em] text-ink-70">
          {member.role}
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">{member.responsibilities}</p>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-70">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em]">Background · </span>
          {member.bio}
        </p>
        <div className="mt-2">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex min-h-11 items-center gap-2 text-[0.875rem]"
            >
              <LinkedInIcon width={15} height={15} />
              LinkedIn
              <span className="sr-only">: {member.name} (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/** Full team section for the About page: photos, roles, responsibilities, bios, LinkedIn, governance. */
export function TeamGrid() {
  return (
    <section id="team" aria-labelledby="team-heading" className="section">
      <div className="container-research">
        <SectionHeader index="People" title="Team" id="team-heading" />
        <ul className="mt-10 grid gap-6 lg:grid-cols-4 lg:gap-8">
          {team.map((member) => (
            <TeamMemberEntry key={member.name} member={member} />
          ))}
        </ul>
        <figure className="mt-12 grid gap-4 border-t border-ink/15 pt-6 md:grid-cols-12 md:gap-8">
          <figcaption className="label md:col-span-4">Year 1 governance</figcaption>
          <blockquote className="measure text-lead text-ink md:col-span-7 md:col-start-6">{governanceStatement}</blockquote>
        </figure>
      </div>
    </section>
  );
}
