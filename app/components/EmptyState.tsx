import Link from "next/link"

type Props = {
  title: string
  description?: string
  action?: { href: string; label: string }
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="glass rounded-2xl p-8 text-center border border-white/10">
      <p className="text-slate-200 font-semibold">{title}</p>
      {description ? <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">{description}</p> : null}
      {action ? (
        <Link href={action.href} className="btn-primary inline-flex mt-5 px-5 py-2.5 text-sm">
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}
