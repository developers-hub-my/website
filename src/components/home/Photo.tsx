// A responsive photo from /images/home/: AVIF first, WebP as the <img>.
//
// Every variant is written by hand into public/images/home/<name>-<width>.{avif,webp},
// so `widths` must list exactly the files that exist. width/height are the
// intrinsic ratio of the source, which reserves the box before the bytes
// arrive (no layout shift).

interface PhotoProps {
  name: string;
  widths: readonly number[];
  /** Intrinsic size of the source photo, for the aspect ratio. */
  width: number;
  height: number;
  alt: string;
  sizes: string;
  className?: string;
  /** Classes for the <picture>, which is the box a grid or flex parent sees. */
  frameClassName?: string;
  /** The hero: fetched first and never lazy. */
  priority?: boolean;
}

const srcSet = (name: string, widths: readonly number[], ext: string) =>
  widths.map((w) => `/images/home/${name}-${w}.${ext} ${w}w`).join(', ');

const Photo = ({ name, widths, width, height, alt, sizes, className, frameClassName, priority = false }: PhotoProps) => (
  <picture className={frameClassName}>
    <source type="image/avif" srcSet={srcSet(name, widths, 'avif')} sizes={sizes} />
    <img
      src={`/images/home/${name}-${widths[widths.length - 1]}.webp`}
      srcSet={srcSet(name, widths, 'webp')}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
    />
  </picture>
);

export default Photo;
