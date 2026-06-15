import { describe, expect, it } from "vitest"
import { getFiveASideCardSrc, hasFiveASideCard } from "@/lib/five-a-side-images"

describe("five-a-side-images", () => {
  it("resolves known card by team and name", () => {
    expect(getFiveASideCardSrc("Spain", "Pedri")).toBe("/5aside_cards/Spain/Pedri.jpg")
    expect(getFiveASideCardSrc("Türkiye", "Arda Guler")).toBe("/5aside_cards/Türkiye/Arda Guler.jpg")
  })

  it("matches names regardless of accents", () => {
    expect(getFiveASideCardSrc("Spain", "Martín Zubimendi")).toBe("/5aside_cards/Spain/Martín Zubimendi.jpg")
    expect(getFiveASideCardSrc("Spain", "Pau Cubarsí")).toBe("/5aside_cards/Spain/Pau Cubarsí.jpg")
  })

  it("returns null for players without a card", () => {
    expect(getFiveASideCardSrc("Spain", "Rodri")).toBeNull()
    expect(hasFiveASideCard("Brazil", "Neymar")).toBe(false)
  })
})
