import { categoryIconSrc } from '@/lib/format';

interface Props {
  category: string;
  /** Rendered pixel size of the icon image. */
  size?: number;
  className?: string;
}

/**
 * Renders the bundled PNG icon for a plan category (rent, electricity, …).
 * Falls back to a neutral icon for unknown categories. Uses a plain <img> so it
 * works identically in server and client components without image-loader config.
 */
export function CategoryIcon({ category, size = 26, className }: Props) {
  return (
    <img
      src={categoryIconSrc(category)}
      alt={`${category} icon`}
      width={size}
      height={size}
      className={className ? `category-icon ${className}` : 'category-icon'}
      style={{ width: size, height: size, objectFit: 'contain' }}
      draggable={false}
    />
  );
}

export default CategoryIcon;
