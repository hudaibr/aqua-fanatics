import Image from 'next/image';
import logo from '@/data/logo.png';

type BrandSize = 'sm' | 'md' | 'lg';

const markClasses: Record<BrandSize, string> = {
  sm: 'h-7 w-auto',
  md: 'h-9 w-auto',
  lg: 'h-24 w-auto',
};

interface BrandProps {
  size?: BrandSize;
  className?: string;
  /**
   * Preload the mark. Worth it only for the first paint on the loading
   * screen — the nav mark is not visible until the user enters the market,
   * and both instances share the same asset.
   */
  priority?: boolean;
}

/**
 * The Aqua Fanatics mark from `data/logo.png`, for the top-left corner.
 *
 * The asset is portrait (139x167), so it is sized by height and the width
 * follows the intrinsic aspect ratio. The mark carries the wordmark itself,
 * so no text is rendered alongside it. Alt text is empty because the
 * surrounding copy already names the brand.
 */
export function Brand({
  size = 'sm',
  className = '',
  priority = false,
}: BrandProps) {
  return (
    <Image
      src={logo}
      alt=""
      width={139}
      height={167}
      priority={priority}
      className={`${markClasses[size]} shrink-0 object-contain ${className}`}
    />
  );
}
