import type { TeamMember } from "~/data/team";

/** Square portrait, or the person's initials if no photo is available. */
export function TeamPhoto({ member, className = "" }: { member: TeamMember; className?: string }) {
  if (!member.photo) {
    const initials = member.name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
    return (
      <div
        role="img"
        aria-label={member.name}
        className={`flex aspect-square w-full items-center justify-center rounded-[var(--radius-card)] bg-sunken text-2xl font-medium text-forest ${className}`}
      >
        {initials}
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
