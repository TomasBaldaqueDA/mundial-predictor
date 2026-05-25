import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import { NEEDS_DISPLAY_NAME_KEY } from "@/lib/auth-profile-setup"
import { NextResponse } from "next/server"

function escapeIlike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&")
}

export async function POST(request: Request) {
  const ssr = await createClient()
  const {
    data: { user },
  } = await ssr.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const admin = supabaseAdmin
  if (!admin) {
    return NextResponse.json(
      { error: "Profile save is temporarily unavailable. Please try again later." },
      { status: 503 }
    )
  }

  let body: { displayName?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const trimmedName = (body.displayName ?? "").trim()
  if (!trimmedName) {
    return NextResponse.json({ error: "Display name cannot be empty." }, { status: 400 })
  }
  if (trimmedName.length > 40) {
    return NextResponse.json({ error: "Display name must be 40 characters or fewer." }, { status: 400 })
  }

  const { data: taken, error: takenError } = await admin
    .from("profiles")
    .select("id")
    .ilike("display_name", escapeIlike(trimmedName))
    .neq("id", user.id)
    .limit(1)

  if (takenError) {
    return NextResponse.json({ error: "Could not verify display name." }, { status: 500 })
  }
  if (taken && taken.length > 0) {
    return NextResponse.json(
      { error: "This display name is already taken. Please choose another one." },
      { status: 409 }
    )
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    { id: user.id, display_name: trimmedName },
    { onConflict: "id" }
  )

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const { error: metaError } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      [NEEDS_DISPLAY_NAME_KEY]: false,
      display_name: trimmedName,
    },
  })

  if (metaError) {
    return NextResponse.json({ error: metaError.message }, { status: 500 })
  }

  return NextResponse.json({ displayName: trimmedName })
}
