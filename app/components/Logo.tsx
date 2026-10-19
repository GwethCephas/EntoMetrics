import { Link } from "react-router";
import logoHorizontal from "~/assets/logo/logo-horizontal.svg";

interface LogoProps {
  className?: string;
  /** Rendered height in px; width follows the artwork's aspect ratio. */
  height?: number;
}

// Aspect ratio of logo-horizontal.svg (viewBox 0 0 588.12 178).
const RATIO = 588.12 / 178;

export function Logo({ className, height = 44 }: LogoProps) {
  return (
    <Link to="/" className={className} aria-label="EntoMetrics Africa, home">
      <img
        src={logoHorizontal}
        alt=""
        width={Math.round(height * RATIO)}
        height={height}
        style={{ height, width: "auto" }}
        decoding="async"
      />
    </Link>
  );
}
