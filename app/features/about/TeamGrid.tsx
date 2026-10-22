import { LinkedInIcon } from "~/components/icons";
import { team, type TeamMember } from "~/data/team";
import { TeamPhoto } from "./TeamPhoto";

function TeamMemberEntry({ member }: { member: TeamMember }) {
  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-x-5 border-t border-rule pt-6 sm:grid-cols-[7rem_1fr] lg:block lg:border-t-0 lg:pt-0">
      <TeamPhoto member={member} />
      <div className="lg:mt-5">
        <h2 className="text-[1.125rem] !text-ink sm:text-[1.25rem]">{member.name}</h2>
        <p className="mt-1 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.06em] text-ink-70">
          {member.role}
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">{member.responsibilities}</p>
        {member.linkedin ? (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link mt-2 inline-flex min-h-11 items-center gap-2 text-[0.875rem]"
          >
            <LinkedInIcon width={15} height={15} />
            LinkedIn
            <span className="sr-only">: {member.name} (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </li>
  );
}

/** The team: photo, name, role, what they do, LinkedIn (Team page). */
export function TeamGrid() {
  return (
    <ul className="grid gap-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
      {team.map((member) => (
        <TeamMemberEntry key={member.name} member={member} />
      ))}
    </ul>
  );
}
