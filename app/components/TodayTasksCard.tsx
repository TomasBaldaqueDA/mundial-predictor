import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getTodayTasks } from "@/lib/today-tasks"

export async function TodayTasksCard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const tasks = await getTodayTasks(supabase, user.id)
  if (tasks.length === 0) return null

  return (
    <section
      className="glass rounded-2xl border border-wc-gold/25 p-5 mb-6"
      aria-labelledby="today-tasks-heading"
    >
      <h2 id="today-tasks-heading" className="text-sm font-bold text-wc-gold uppercase tracking-wider mb-3">
        Before kick-off
      </h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link
              href={task.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 hover:border-wc-gold/40 hover:bg-wc-gold/10 transition-colors"
            >
              <span>{task.label}</span>
              <span className="text-wc-gold shrink-0" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
