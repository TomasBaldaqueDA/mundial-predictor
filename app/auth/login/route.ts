import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { safeRedirectPath } from "@/lib/safe-redirect"

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; next?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const email = body.email?.trim() ?? ""
  const password = body.password ?? ""
  const destination = safeRedirectPath(body.next, "/")

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true, destination })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return response
}
