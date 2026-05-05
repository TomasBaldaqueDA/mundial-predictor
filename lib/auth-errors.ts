/**
 * Map raw Supabase Auth error messages (and our app's own DB errors) into
 * short, human-friendly copy. Falls through to the original message when no
 * mapping is known so we don't accidentally hide useful detail.
 */
export function friendlyAuthError(message: string | undefined | null): string {
  const m = (message ?? "").toLowerCase()
  if (!m) return "Something went wrong. Please try again."

  if (m.includes("invalid login credentials") || m.includes("invalid email or password")) {
    return "Wrong email or password."
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email — check your inbox for the link."
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "An account with this email already exists. Try logging in."
  }
  if (m.includes("password should be at least")) {
    return "Password must be at least 6 characters."
  }
  if (m.includes("rate limit") || m.includes("too many requests")) {
    return "Too many attempts — please wait a moment and try again."
  }
  if (m.includes("network") || m.includes("fetch failed")) {
    return "Network problem. Check your connection and try again."
  }
  if (m.includes("session_not_found") || m.includes("auth session missing")) {
    return "Your session expired. Please log in again."
  }
  if (m.includes("invalid email")) {
    return "That email address looks invalid."
  }
  if (m.includes("same password")) {
    return "Choose a different password from your current one."
  }
  if (m.includes("display_name") && m.includes("unique")) {
    return "This display name is already taken. Try another one."
  }
  return message || "Something went wrong. Please try again."
}
