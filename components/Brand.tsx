import Image from 'next/image';
import logo from '@/data/logo.png';

export const BRAND_NAME = 'Aqua Fanatics';

type BrandSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<BrandSize, { mark: string; text: string }> = {
  sm: { mark: 'h-7 w-auto', text: 'text-[11px] tracking-[0.3em]' },
  md: { mark: 'h-9 w-auto', text: 'text-xs tracking-[0.3em]' },
  lg: { mark: 'h-20 w-auto sm:h-24', text: 'text-2xl tracking-[0.35em] sm:text-3xl' },
};

interface BrandProps {
  size?: BrandSize;
  className?: string;
  /** Invert the mark and wordmark for dark backdrops. */
  tone?: 'light' | 'muted';
  /**
   * Preload the mark. Only worth it for the first paint on the loading
   * screen — the nav lockup is not visible until the user enters the market,
   * and several instances share the same asset.
   */
  priority?: boolean;
}

/**
 * The Aqua Fanatics lockup: the logo mark from `data/logo.png` beside the
 * wordmark. The mark is a portrait asset (139x167) so it is sized by height
 * and the width is left to follow the intrinsic aspect ratio.
 */
export function Brand({
  size = 'md',
  className = '',
  tone = 'light',
  priority = false,
}: BrandProps) {
  const classes = sizeClasses[size];
  const textColor = tone === 'light' ? 'text-[#F5F2EA]' : 'text-[#F5F2EA]/70';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src={logo}
        alt=""
        width={139}
        height={167}
        priority={priority}
        className={`${classes.mark} shrink-0 object-contain`}
      />
      <span
        className={`${classes.text} ${textColor} whitespace-nowrap font-medium uppercase leading-none`}
      >
        {BRAND_NAME}
      </span>
    </span>
  );
}
