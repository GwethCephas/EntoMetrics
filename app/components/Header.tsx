import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { primaryNav } from "~/data/nav";
import { Logo } from "./Logo";

// Underline grows from the left on hover/focus; gold and full-width on the active route.
const desktopLink = (isActive: boolean) =>
  [
    "relative inline-flex items-center whitespace-nowrap py-2 text-[0.84375rem] font-medium transition-colors duration-150",
    "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:transition-transform after:duration-300 after:ease-[var(--ease-research)]",
    isActive
      ? "text-forest after:scale-x-100 after:bg-gold"
      : "text-ink hover:text-forest after:scale-x-0 after:bg-forest/40 hover:after:scale-x-100 focus-visible:after:scale-x-100",
  ].join(" ");

export function Header() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const location = useLocation();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu whenever the route changes.
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="container-research flex h-[4.25rem] items-center justify-between gap-6 sm:h-[4.5rem]">
        <Logo className="-ml-1 shrink-0 rounded-sm" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-9">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => desktopLink(isActive)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] border border-rule text-forest transition-colors duration-150 hover:border-rule-strong active:translate-y-px lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {/* Mobile panel: height and opacity transition; inert (unfocusable, hidden from AT) while closed. */}
      <div
        id={panelId}
        ref={panelRef}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-[var(--ease-research)] lg:hidden ${
          open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile" className="container-research border-t border-rule py-2">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.to} className="border-b border-rule last:border-b-0">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center justify-between py-3 text-base font-medium transition-colors duration-150 ${
                        isActive ? "text-forest" : "text-ink hover:text-forest"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive ? (
                          <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-ink-70">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                            Current
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
