import { LinkedInIcon } from "~/components/icons";
import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/ui";
import { governanceStatement, team, type TeamMember } from "~/data/team";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <li className="card flex h-full flex-col overflow-hidden">
      {member.photo ? (
        <picture>
          <source srcSet={member.photo.webp} type="image/webp" />
          <img
            src={member.photo.jpg}
            alt={`Portrait of ${member.name}`}
            width={480}
            height={480}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full bg-rule object-cover"
          />
        </picture>
      ) : (
        <div
          role="img"
          aria-label={`Photo of ${member.name} to be supplied`}
          className="flex aspect-square w-full items-center justify-center bg-ink-70 p-4 text-center font-mono text-[0.75rem] text-paper"
        >
          [PHOTO: {member.name}]
        </div>
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[1.0625rem] sm:text-lg">{member.name}</h3>
        <p className="mt-1 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-70">{member.role}</p>
        <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-ink sm:text-[0.9375rem]">{member.bio}</p>
        <div className="mt-4 border-t border-rule pt-3">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-forest hover:text-forest-deep"
            >
              <LinkedInIcon width={16} height={16} />
              <span className="sr-only">{member.name} on LinkedIn (opens in a new tab)</span>
            </a>
          ) : (
            <span className="placeholder inline-flex items-center gap-2 text-[0.6875rem]">
              <LinkedInIcon width={13} height={13} />
              [LINKEDIN: to be supplied]
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export function TeamGrid({ headingAs = "h2" }: { headingAs?: "h2" | "h1" }) {
  return (
    <section aria-labelledby="team-heading" className="section border-t border-rule">
      <div className="container-research">
        <SectionHeader eyebrow="People" title="Team" id="team-heading" as={headingAs} />
        <Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </ul>
          <p className="mt-8 max-w-4xl border-l-2 border-forest pl-4 text-[0.9375rem] italic text-ink-70">
            {governanceStatement}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
