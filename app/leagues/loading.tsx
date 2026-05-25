import { ListSkeleton } from "@/app/components/Skeleton"
import { PageHeader } from "@/app/components/PageHeader"

export default function LeaguesLoading() {
  return (
    <main>
      <PageHeader title="Private leagues" description="Create or join a league and compete with friends." />
      <ListSkeleton rows={6} />
    </main>
  )
}
