import { CardSkeleton } from "@/app/components/Skeleton"
import { PageHeader } from "@/app/components/PageHeader"

export default function GamesLoading() {
  return (
    <main>
      <PageHeader
        title="Games"
        description="Every match of the 2026 World Cup — predict scores, MVPs and qualifiers before kickoff."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
