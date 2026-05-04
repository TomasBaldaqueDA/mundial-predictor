import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/rules", "/login", "/register"],
        disallow: ["/api/", "/auth/", "/profile", "/predict"],
      },
    ],
  }
}
