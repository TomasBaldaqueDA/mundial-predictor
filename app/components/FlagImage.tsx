import Image from "next/image"

type FlagImageProps = {
  src: string
  className?: string
  alt?: string
}

/** Renders team flags from flagcdn.com or inline SVG data URIs (England/Scotland). */
export function FlagImage({ src, className, alt = "" }: FlagImageProps) {
  if (src.startsWith("data:")) {
    return (
      // Data URIs for custom SVG flags — next/image does not optimize these.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={80}
      height={53}
      className={className}
      unoptimized
    />
  )
}
