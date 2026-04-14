import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { createSupabaseMock } from "./utils/supabaseMock"

const createClientMock = vi.fn()

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => createClientMock(),
}))

import GroupsPage from "@/app/groups/page"

const GROUP_CODES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

function seedGroupTeams() {
  return GROUP_CODES.flatMap((code) =>
    [1, 2, 3, 4].map((n) => ({
      group_code: code,
      team_name: `${code}-Team-${n}`,
    }))
  )
}

describe("Groups page", () => {
  it("shows error when saving a group without all four positions", async () => {
    createClientMock.mockReturnValue(
      createSupabaseMock({
        user: { id: "u-1" },
        tables: {
          group_teams: seedGroupTeams(),
          group_predictions: [],
          group_actual_standings: [],
          group_actual_third_place: [],
          matches: [{ kickoff_time: "2099-01-01T00:00:00.000Z" }],
        },
      })
    )

    const user = userEvent.setup()
    render(<GroupsPage />)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /group predictions/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /save group a/i }))

    expect(screen.getByText(/Group A: select all 4 teams/i)).toBeInTheDocument()
  })
})
