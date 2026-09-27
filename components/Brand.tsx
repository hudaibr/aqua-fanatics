import Image from 'next/image';
import logo from '@/data/logo.png';

type BrandSize = 'sm' | 'md';

const markClasses: Record<BrandSize, string> = {
  sm: 'h-7 w-auto',
  md: 'h-9 w-auto',
};

interface BrandProps {
  size?: BrandSize;
  className?: string;
  /**
   * Copy shown beside the mark. The loading screen introduces the brand in a
   * full sentence; the nav keeps it short.
   */
  label?: string;
  /**
   * Preload the mark. Worth it only for the first paint on the loading
   * screen — the nav lockup is not visible until the user enters the market,
   * and both instances share the same asset.
   */
  priority?: boolean;
}

/**
 * The Aqua Fanatics lockup: the mark from `data/logo.png` beside the wordmark,
 * sized for the top-left corner. The mark is a portrait asset (139x167), so it
 * is sized by height and the width follows the intrinsic aspect ratio.
 *
 * Deliberately applies no typography of its own — the wordmark inherits
 * whatever casing/tracking/colour classes the parent already carries, so the
 * branding keeps the exact styling of the element it sits in.
 */
export function Brand({
  size = 'sm',
  className = '',
  label = 'Aqua Fanatics',
  priority = false,
}: BrandProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src={logo}
        alt=""
        width={139}
        height={167}
        priority={priority}
        className={`${markClasses[size]} shrink-0 object-contain`}
      />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}
