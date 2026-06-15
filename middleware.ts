import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/login",
    // Auth only on known app sections — unknown routes fall through to not-found.tsx.
    "/games/:path*",
    "/five-a-side",
    "/five-a-side/:path*",
    "/leagues/:path*",
    "/questions/:path*",
    "/ranking/:path*",
    "/profile/:path*",
    "/groups/:path*",
    "/match/:path*",
    "/player/:path*",
  ],
}
