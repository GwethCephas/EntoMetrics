import { Reveal } from "~/components/Reveal";
import { mission, vision } from "~/data/home";

export function MissionVision() {
  return (
    <section aria-label="Mission and vision" className="section bg-paper">
      <Reveal className="container-research grid gap-12 md:grid-cols-12 md:gap-8">
        {[mission, vision].map((item, index) => (
          <div key={item.heading} className={index === 0 ? "md:col-span-5" : "md:col-span-5 md:col-start-8"}>
            <p className="label mb-4">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="text-[1.75rem] md:text-[2rem]">{item.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink">{item.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
