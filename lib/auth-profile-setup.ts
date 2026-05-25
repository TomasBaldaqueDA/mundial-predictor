export const NEEDS_DISPLAY_NAME_KEY = "needs_display_name"

export type UserLike = {
  created_at?: string
  last_sign_in_at?: string
  user_metadata?: Record<string, unknown>
  identities?: { provider: string }[]
}

export function isGoogleAuthUser(user: UserLike | null | undefined): boolean {
  if (!user) return false
  if (user.identities?.some((i) => i.provider === "google")) return true
  return user.user_metadata?.provider === "google"
}

export function userNeedsDisplayName(user: UserLike | null | undefined): boolean {
  return user?.user_metadata?.[NEEDS_DISPLAY_NAME_KEY] === true
}

/** First sign-in right after account creation (e.g. re-register after delete). */
export function isNewAuthUser(user: UserLike | null | undefined): boolean {
  if (!user?.created_at || !user.last_sign_in_at) return false
  const created = new Date(user.created_at).getTime()
  const lastSignIn = new Date(user.last_sign_in_at).getTime()
  return Math.abs(lastSignIn - created) < 60_000
}

export function googleUserNeedsProfileSetup(
  user: UserLike | null | undefined,
  options?: { signupFlow?: boolean; hasProfile?: boolean }
): boolean {
  if (!isGoogleAuthUser(user)) return false
  if (options?.signupFlow) return true
  if (options?.hasProfile === false) return true
  if (isNewAuthUser(user)) return true
  return user?.user_metadata?.[NEEDS_DISPLAY_NAME_KEY] !== false
}