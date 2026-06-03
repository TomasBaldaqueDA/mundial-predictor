type Props = {
  message?: string
}

export function TournamentLockedNotice({
  message = "Other players' picks are hidden until the start of the World Cup.",
}: Props) {
  return (
    <div className="glass rounded-2xl p-8 text-center border border-wc-gold/25">
      <p className="text-slate-200 font-medium">{message}</p>
    </div>
  )
}
