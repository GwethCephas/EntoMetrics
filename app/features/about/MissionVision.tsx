import { mission, vision } from "~/data/home";

/** Full mission and vision statements, set as editorial pull statements (About page). */
export function MissionVision() {
  return (
    <section aria-label="Mission and vision" className="section">
      <div className="container-research">
        <div className="divide-y divide-ink/15 border-y border-ink/15">
        {[mission, vision].map((item) => (
          <div key={item.heading} className="grid gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-14">
            <h2 className="text-[1.375rem] md:col-span-4 md:text-[1.625rem]">{item.heading}</h2>
            <p className="max-w-[40ch] text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] font-medium leading-snug tracking-[-0.015em] text-ink md:col-span-8 md:col-start-5">
              {item.text}
            </p>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
