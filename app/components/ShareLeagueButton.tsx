"use client"

type Props = {
  leagueName: string
  inviteCode: string
}

export function ShareLeagueButton({ leagueName, inviteCode }: Props) {
  async function share() {
    const site = typeof window !== "undefined" ? window.location.origin : ""
    const text = `Join my WC26 league "${leagueName}" with code ${inviteCode}`
    const url = `${site}/leagues?join=${encodeURIComponent(inviteCode)}`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "WC26 Predictor", text, url })
        return
      } catch {
        /* fall through */
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert("Invite copied to clipboard.")
    } catch {
      alert(`Invite code: ${inviteCode}`)
    }
  }

  return (
    <button type="button" onClick={() => void share()} className="btn-secondary text-sm px-4 py-2">
      Share league
    </button>
  )
}
