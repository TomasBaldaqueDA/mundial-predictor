import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase-server"

/**
 * POST /api/account/delete
 *
 * Deletes the currently authenticated user's account (auth row + profile).
 * Predictions/group_predictions/special_answers/five_a_side_picks reference
 * auth.users(id) with ON DELETE SET NULL or CASCADE; the cascade chain takes
 * care of cleanup. Service-role key is required to drop the auth row.
 */
export async function POST() {
  const ssr = await createClient()
  const {
    data: { user },
  } = await ssr.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const admin = supabaseAdmin
  if (!admin) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 503 })
  }

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Sign out client-side too — the cookie session is now orphaned.
  await ssr.auth.signOut()

  return NextResponse.json({ ok: true })
}
