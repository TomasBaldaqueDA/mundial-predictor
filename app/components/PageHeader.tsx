import Link from "next/link"

type Props = {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  badge?: React.ReactNode
}

export function PageHeader({ title, description, backHref, backLabel = "Back", children, badge }: Props) {
  return (
    <header className="page-header mb-8 sm:mb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          {backHref && (
            <Link href={backHref} className="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.832 10l2.948 2.948a.75.75 0 0 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06-.02Z" clipRule="evenodd" />
              </svg>
              {backLabel}
            </Link>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">{title}</h1>
            {badge}
          </div>
          {description && <p className="page-description">{description}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2 shrink-0">{children}</div>}
      </div>
    </header>
  )
}
