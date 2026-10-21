import type { TeamMember } from "~/data/team";

/** Square portrait, or a visible placeholder until the client supplies one. */
export function TeamPhoto({ member, className = "" }: { member: TeamMember; className?: string }) {
  if (!member.photo) {
    return (
      <div
        role="img"
        aria-label={`Photo of ${member.name} to be supplied`}
        className={`flex aspect-square w-full items-center justify-center rounded-[var(--radius-card)] bg-ink-70 p-3 text-center font-mono text-[0.6875rem] text-paper ${className}`}
      >
        [PHOTO: {member.name}]
      </div>
    );
  }
  return (
    <picture>
      <source srcSet={member.photo.webp} type="image/webp" />
      <img
        src={member.photo.jpg}
        alt={`Portrait of ${member.name}`}
        width={480}
        height={480}
        loading="lazy"
        decoding="async"
        className={`aspect-square w-full rounded-[var(--radius-card)] bg-rule object-cover ${className}`}
      />
    </picture>
  );
}
