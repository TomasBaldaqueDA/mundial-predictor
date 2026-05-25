import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

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
    return NextResponse.json(
      { error: "Account deletion is unavailable. Please contact support." },
      { status: 503 }
    )
  }

  const userId = user.id
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: stillExists } = await admin.auth.admin.getUserById(userId)
  if (stillExists?.user) {
    return NextResponse.json(
      { error: "Account could not be fully removed. Please try again." },
      { status: 500 }
    )
  }

  await ssr.auth.signOut({ scope: "global" })

  return NextResponse.json({ ok: true })
}
