import { render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { createSupabaseMock } from "./utils/supabaseMock"

const createClientMock = vi.fn()

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => createClientMock(),
}))

import FiveASidePage, { teamsUsedExceptSlot } from "@/app/five-a-side/page"

describe("5-A-SIDE", () => {
  it("renders main title and one-player-per-nation rule copy", async () => {
    createClientMock.mockReturnValue(
      createSupabaseMock({
        user: null,
        tables: {
          five_a_side_players: [],
          matches: [{ kickoff_time: "2099-01-01T00:00:00.000Z", status: "scheduled" }],
        },
      })
    )

    render(<FiveASidePage />)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /5-a-side/i })).toBeInTheDocument()
    })
    expect(screen.getByText(/max one player per nation/i)).toBeInTheDocument()
  })

  it("computes used teams excluding current slot", () => {
    const picks = {
      gk_player_id: "p1",
      df_player_id: "p2",
      md1_player_id: null,
      md2_player_id: null,
      st_player_id: null,
      submitted_at: null,
    }
    const players = [
      { id: "p1", name: "A", team: "Portugal", position: "gk", goals: 0, assists: 0, wins: 0, clean_sheets: 0, mvp: 0 },
      { id: "p2", name: "B", team: "Spain", position: "df", goals: 0, assists: 0, wins: 0, clean_sheets: 0, mvp: 0 },
      { id: "p3", name: "C", team: "France", position: "md", goals: 0, assists: 0, wins: 0, clean_sheets: 0, mvp: 0 },
    ]

    const used = teamsUsedExceptSlot("df", picks, players)

    expect(used.has("Portugal")).toBe(true)
    expect(used.has("Spain")).toBe(false)
  })
})
