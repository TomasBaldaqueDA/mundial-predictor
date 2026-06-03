import { ImageResponse } from "next/og"
import { Wc26IconMark } from "@/lib/wc26-icon-og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<Wc26IconMark size={32} />, { ...size })
}
