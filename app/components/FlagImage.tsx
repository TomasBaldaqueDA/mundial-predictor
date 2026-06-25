type FlagImageProps = {
  src: string
  className?: string
  alt?: string
}

function getFlagDimensions(src: string): { width: number; height: number } {
  const match = src.match(/flagcdn\.com\/w(\d+)\//)
  if (match) {
    const width = Number(match[1])
    return { width, height: Math.round((width * 2) / 3) }
  }
  return { width: 80, height: 53 }
}

/** Renders team flags from flagcdn.com or inline SVG data URIs (England/Scotland). */
export function FlagImage({ src, className, alt = "" }: FlagImageProps) {
  const { width, height } = getFlagDimensions(src)
  return (
    // Native img avoids next/image wrapper sizing that blurs small flags when CSS-scaled.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      className={className}
    />
  )
}
