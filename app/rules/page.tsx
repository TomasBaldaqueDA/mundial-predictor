import { PageHeader } from "@/app/components/PageHeader"

export const metadata = {
  title: "Rules & scoring",
  description: "How predictions, deadlines and points work in WC26 Predictor.",
}

export default function RulesPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="Rules & scoring"
        description="Deadlines, scoring and how each section earns points."
        backHref="/"
        backLabel="Home"
      />

      <section className="glass rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-wc-green-dark">1. Access & deadlines</h2>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>
            You must be <span className="font-semibold">logged in</span> to make or edit predictions.
          </li>
          <li>
            <span className="font-semibold">Match predictions</span> are locked at{" "}
            <span className="font-semibold">kickoff time</span> of each game.
          </li>
          <li>
            <span className="font-semibold">Special questions</span>,{" "}
            <span className="font-semibold">5-A-SIDE team</span> and{" "}
            <span className="font-semibold">group predictions</span> are locked at kickoff of the{" "}
            <span className="font-semibold">first match of the World Cup</span>.
          </li>
          <li>
            Before a prediction is locked you can change it as many times as you want; the{" "}
            <span className="font-semibold">last saved version</span> is the one that counts.
          </li>
        </ul>
      </section>

      <section className="glass rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-wc-green-dark">2. Match predictions</h2>
        <p className="text-sm text-slate-300 mb-1">
          For each match you predict the final score (90 minutes) and the MVP of the match.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>
            <span className="font-semibold">Exact score</span>: 3 pts
          </li>
          <li>
            <span className="font-semibold">Correct winner / draw</span>: 1 pt (if you did not hit the exact score but
            predicted the right outcome)
          </li>
          <li>
            <span className="font-semibold">Correct MVP</span>: 1 pt
          </li>
          <li>
            <span className="font-semibold">Combo bonus</span> (exact score + correct MVP): +1 pt
          </li>
          <li>
            <span className="font-semibold">×2 Power-up</span>: you receive{" "}
            <span className="font-semibold">one ×2 token per round</span>. Activate it on any single match within
            that round before kick-off to <span className="font-semibold">double all points</span> earned from that
            match (score + MVP + combo). You can move the token to a different match in the same round at any time
            before it kicks off. The rounds are:{" "}
            <span className="font-semibold">
              1st Round, 2nd Round, 3rd Round, Round of 32, Round of 16, Quarter-final, Semi-final,
              and Play-off for third place + Final
            </span>.
          </li>
          <li>
            <span className="font-semibold">Correct qualifier</span> (knockout matches only): +1 pt if you correctly
            pick which team advances after 90 minutes.
          </li>
        </ul>
        <p className="text-xs text-slate-400">
          The qualifying team pick is only available in knockout matches (Round of 32 onwards).
        </p>
      </section>

      <section className="glass rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-wc-green-dark">3. Group predictions</h2>
        <p className="text-sm text-slate-300">
          You predict the <span className="font-semibold">final order (1st–4th)</span> in each group and which{" "}
          <span className="font-semibold">8 third-place teams</span> advance.
        </p>
        <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 space-y-2">
          <h3 className="text-sm font-semibold text-emerald-300">Qualification rules</h3>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            <li>
              <span className="font-semibold">1st and 2nd</span> in each group (12+12) advance to the next round.
            </li>
            <li>
              Of the <span className="font-semibold">12 third-place</span> teams, only the{" "}
              <span className="font-semibold">best 8</span> advance; four third-place teams are eliminated.
            </li>
            <li>
              <span className="font-semibold">4th place</span> in each group is eliminated.
            </li>
          </ul>
        </div>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>
            <span className="font-semibold">Per group</span>: 1 pt for each team in the correct position (max 4 pts per
            group).
          </li>
          <li>
            <span className="font-semibold">Group perfect bonus</span>: +1 pt when you get all 4 positions right in a
            group.
          </li>
          <li>
            <span className="font-semibold">All 32 qualified bonus</span>: +10 pts if the set of teams you mark as
            qualifying (1st, 2nd, and chosen third-place advancers) matches exactly the 32 teams that actually qualify.
          </li>
          <li>
            <span className="font-semibold">Third-place groups bonus</span>: +5 pts if you correctly identify the 8
            groups whose 3rd place advances.
          </li>
        </ul>
        <p className="text-xs text-slate-400">
          All group-related points are shown in the <span className="font-semibold">“Groups”</span> column of the
          ranking.
        </p>
      </section>

      <section className="glass rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-wc-green-dark">4. Special questions</h2>
        <p className="text-sm text-slate-300">
          Before the World Cup starts you answer a set of{" "}
          <span className="font-semibold">special questions</span> (for example: top scorer, number of goals, etc.).
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>
            Each question has its own <span className="font-semibold">points value</span>.
          </li>
          <li>
            If your answer matches the official correct answer, you get those points; otherwise you get 0 for that
            question.
          </li>
        </ul>
        <p className="text-xs text-slate-400">
          Points from special questions appear in the <span className="font-semibold">“Questions”</span> column in the
          ranking.
        </p>
      </section>

      <section className="glass rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-wc-green-dark">5. 5-A-SIDE fantasy team</h2>
        <p className="text-sm text-slate-300">
          You pick a fixed team of <span className="font-semibold">5 players</span> for the whole tournament:
          1&nbsp;Goalkeeper, 1&nbsp;Defender, 2&nbsp;Midfielders and 1&nbsp;Forward. The team locks at the kickoff of
          the first match (or when you save after that deadline in test environments).
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>
            <span className="font-semibold">Goal</span>: 4 pts
          </li>
          <li>
            <span className="font-semibold">Assist</span>: 3 pts
          </li>
          <li>
            <span className="font-semibold">MVP</span>: 3 pts per match where the player is named MVP
          </li>
          <li>
            <span className="font-semibold">Win</span>: 2 pts for each win by the player&apos;s national team
            (including wins after extra time or on penalties) in matches where the player plays
          </li>
          <li>
            <span className="font-semibold">Clean sheet</span>: 4 pts for goalkeepers and defenders when their team
            concedes 0 goals in a match where the player plays. Minutes played do not matter
          </li>
        </ul>
        <p className="text-xs text-slate-400">
          The 5-A-SIDE total appears in the <span className="font-semibold">“5-A-SIDE”</span> column of the ranking.
        </p>
        <h3 className="text-sm font-semibold text-wc-green-dark pt-1">Power-ups</h3>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>
            <span className="font-semibold">Captain</span>: choose one of your five players. That player&apos;s
            fantasy points count <span className="font-semibold">double (×2)</span> for the whole tournament. You can
            change or remove the captain until the first match kickoff; after that it is locked.
          </li>
          <li>
            <span className="font-semibold">Supersub</span>: one substitution for the whole tournament, available only
            between the end of the group stage (3rd round) and the start of the Round of 32. Replace one player with
            another from the same position (still max one player per nation). Points from the player who leaves only
            count up to the moment of the swap; the incoming player&apos;s points count from that moment onward.
          </li>
        </ul>
      </section>

      <section className="glass rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-wc-green-dark">6. Ranking summary</h2>
        <p className="text-sm text-slate-300">
          Your <span className="font-semibold">total points</span> in the ranking are the sum of:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>Games (match predictions: score, MVP, combo; one ×2 power-up per round doubles that match’s points)</li>
          <li>Questions (special questions)</li>
          <li>Groups (group standings + qualified + bonuses)</li>
          <li>5-A-SIDE (fantasy team points)</li>
        </ul>
        <p className="text-xs text-slate-400">
          If rules change during development or testing, this page will be updated to reflect the latest logic.
        </p>
      </section>
    </main>
  )
}

