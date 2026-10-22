# EntoMetrics Africa

**Live site: [entometrics.com](https://entometrics.com)**

The website of EntoMetrics Africa, an independent research organisation in Nairobi, Kenya, working on Black Soldier Fly welfare science, micro-climate telemetry and humane rearing protocols in the Global South.

## What the website does

- **Home:** a short overview of the organisation. An animated, scroll-triggered story explains why the work matters: demand for insect protein is scaling, welfare is a blind spot, and EntoMetrics Africa's approach. Previews link on to each section of the site.
- **About Us:** mission and vision, the three pillars of the work, governance, team profiles and legal status.
- **Research Hub:** the three research programmes, each with its current status, a status timeline and the organisation's Theory of Change. Each programme has its own page covering the research question, method and planned outputs.
- **Our Telemetry Tech:** how the planned low-cost substrate probes are designed to send SMS alerts to farm operators over 2G networks, with a system diagram and the hardware specification as it is confirmed.
- **Contact:** a collaboration enquiry form, plus email, location, LinkedIn and Instagram.
- **Privacy Policy** and **Data and Ethics Statement.**

The site is built to be accessible (checked against WCAG 2.1 AA), responsive from small phones to large desktops, and fast. Its animations respect the visitor's reduced-motion setting. Illustrative graphics are clearly labelled as not being field data.

## Built with

| | |
| --- | --- |
| Framework | [React 19](https://react.dev), [React Router 8](https://reactrouter.com) (server rendering), TypeScript |
| Build tooling | [Vite](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com), with Inter and Roboto Mono fonts |
| Animation | [Motion for React](https://motion.dev) and SVG |
| Icons | [Lucide](https://lucide.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) and [Zod](https://zod.dev) validation, delivered by [Formspree](https://formspree.io) |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com) |
| Testing | [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com), [Playwright](https://playwright.dev) and [axe-core](https://github.com/dequelabs/axe-core) |

Developer notes are in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

© 2026 EntoMetrics Africa. All rights reserved.
