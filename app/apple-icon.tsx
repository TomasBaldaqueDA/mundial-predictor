import { ImageResponse } from "next/og"
import { Wc26IconMark } from "@/lib/wc26-icon-og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(<Wc26IconMark size={180} />, { ...size })
}
