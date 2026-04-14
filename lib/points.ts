export type MatchLike = {
  score1: number | null
  score2: number | null
  mvp: string | null
  qualifier?: string | null
}

export type PredictionLike = {
  pred_score1: number
  pred_score2: number
  pred_mvp: string
  pred_qualifier?: string | null
}

export type PointsOptions = {
  /** 1 or 2 — doubles total match-day points when result is known */
  points_multiplier?: number
}

export function calculateMatchPoints(
  match: MatchLike,
  prediction: PredictionLike,
  options?: PointsOptions
): number {
  if (match.score1 === null || match.score2 === null) {
    return 0
  }

  const exact = prediction.pred_score1 === match.score1 && prediction.pred_score2 === match.score2

  const matchWinner =
    match.score1 > match.score2 ? 1 :
    match.score1 < match.score2 ? 2 :
    0

  const predWinner =
    prediction.pred_score1 > prediction.pred_score2 ? 1 :
    prediction.pred_score1 < prediction.pred_score2 ? 2 :
    0

  const correctWinner = !exact && matchWinner === predWinner

  const mvpCorrect =
    Boolean(match.mvp) &&
    match.mvp!.trim().toLowerCase() === prediction.pred_mvp.trim().toLowerCase()

  const exactPts = exact ? 3 : 0
  const winnerPts = correctWinner ? 1 : 0
  const mvpPts = mvpCorrect ? 1 : 0
  const comboPts = exact && mvpCorrect ? 1 : 0

  const mult = options?.points_multiplier === 2 ? 2 : 1
  return (exactPts + winnerPts + mvpPts + comboPts) * mult
}
