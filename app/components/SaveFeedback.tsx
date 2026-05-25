type Variant = "success" | "error" | "info"

const styles: Record<Variant, string> = {
  success: "border-emerald-400/35 bg-emerald-500/15 text-emerald-100",
  error: "border-red-400/35 bg-red-500/15 text-red-100",
  info: "border-sky-400/35 bg-sky-500/15 text-sky-100",
}

type Props = {
  message: string
  variant?: Variant
  className?: string
}

export function SaveFeedback({ message, variant = "success", className = "" }: Props) {
  if (!message) return null
  const role = variant === "error" ? "alert" : "status"
  return (
    <p
      role={role}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles[variant]} ${className}`}
    >
      {message}
    </p>
  )
}
