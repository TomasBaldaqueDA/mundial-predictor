import { createServerClient } from "@supabase/ssr"
import { hasCompletedDisplayNameSetup } from "@/lib/auth-profile-setup"
import { NextResponse, type NextRequest } from "next/server"

async function userMustCompleteProfileSetup(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle()
  if (!profile) return true
  return !hasCompletedDisplayNameSetup(profile.display_name)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const PUBLIC_ROUTES = new Set<string>(["/", "/login", "/register", "/rules"])
  const isPublic =
    PUBLIC_ROUTES.has(pathname) ||
    pathname.startsWith("/auth/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"

  if (!user && !isPublic) {
    const url = new URL("/login", request.url)
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (
    user &&
    (await userMustCompleteProfileSetup(supabase, user.id)) &&
    pathname !== "/profile" &&
    !pathname.startsWith("/auth/") &&
    !pathname.startsWith("/api/")
  ) {
    const url = new URL("/profile", request.url)
    url.searchParams.set("setup", "1")
    if (pathname !== "/") url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
