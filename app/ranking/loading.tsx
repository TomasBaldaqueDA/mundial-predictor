import { ListSkeleton } from "@/app/components/Skeleton"
import { PageHeader } from "@/app/components/PageHeader"

export default function RankingLoading() {
  return (
    <main>
      <PageHeader title="Global ranking" description="All registered players by total points." />
      <ListSkeleton rows={12} />
    </main>
  )
}
