/**
 * StellarPlan brand mark — an oblique "E" built from three right-leaning bars.
 *
 * Vector reconstruction of the project logo so it stays razor-sharp at every
 * size and needs no raster asset. Fill is `currentColor`; the mark defaults to
 * the brand emerald (`text-accent`) so it always renders green — matching the
 * favicon — and stays legible in both light and dark themes. Pass `className`
 * to recolor it for a specific surface.
 */

type LogoProps = {
  /** Rendered width & height in px. Defaults to 24. */
  size?: number;
  className?: string;
  /** Accessible label; omit (default) to mark it decorative. */
  title?: string;
};

export function Logo({ size = 24, className, title }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'text-accent'}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {/* Sheared about the vertical centre so the three bars lean uniformly. */}
      <g transform="translate(50 50) skewX(-14) translate(-50 -50)" fill="currentColor">
        <rect x="32" y="20" width="48" height="16" rx="5" />
        <rect x="36" y="42" width="30" height="16" rx="5" />
        <rect x="22" y="64" width="58" height="16" rx="5" />
      </g>
    </svg>
  );
}

export default Logo;
