import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { primaryNav } from "~/data/nav";
import { Logo } from "./Logo";

const linkBase =
  "relative inline-flex items-center py-2 text-[0.9375rem] font-medium text-ink transition-colors hover:text-forest";

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
      <div className="container-research flex h-[4.5rem] items-center justify-between gap-6">
        <Logo height={48} className="-ml-1 shrink-0 rounded-sm" />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 lg:gap-9">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? "text-forest after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:bg-gold"
                        : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] border border-rule text-forest md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="border-t border-rule bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="container-research py-3">
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.to} className="border-b border-rule last:border-b-0">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center justify-between py-3 text-base font-medium ${
                      isActive ? "text-forest" : "text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
