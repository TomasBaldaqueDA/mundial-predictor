import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/rules", "/login", "/register"],
        disallow: ["/api/", "/auth/", "/profile", "/games", "/groups", "/questions", "/five-a-side", "/leagues", "/ranking", "/match/", "/player/"],
      },
    ],
  }
}
