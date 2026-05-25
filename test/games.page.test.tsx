import { render, screen } from "@testing-library/react"
import { vi } from "vitest"

const orderMock = vi.fn()
const gamesListSpy = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: orderMock,
        eq: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
    })),
  })),
}))

vi.mock("@/app/components/TodayTasksCard", () => ({
  TodayTasksCard: () => null,
}))

vi.mock("@/app/games/GamesList", () => ({
  GamesList: (props: { upcoming: unknown[]; past: unknown[] }) => {
    gamesListSpy(props)
    return (
      <div>
        <span data-testid="upcoming-count">{props.upcoming.length}</span>
        <span data-testid="past-count">{props.past.length}</span>
      </div>
    )
  },
}))

import JogosPage from "@/app/games/page"

describe("Games page", () => {
  it("splits matches into upcoming and past", async () => {
    const now = Date.now()
    orderMock.mockResolvedValueOnce({
      data: [
        { id: 1, kickoff_time: new Date(now + 86_400_000).toISOString(), status: "scheduled" },
        { id: 2, kickoff_time: new Date(now - 86_400_000).toISOString(), status: "finished" },
      ],
    })

    const page = await JogosPage()
    render(page)

    expect(screen.getByRole("heading", { name: /games/i })).toBeInTheDocument()
    expect(screen.getByTestId("upcoming-count")).toHaveTextContent("1")
    expect(screen.getByTestId("past-count")).toHaveTextContent("1")
    expect(gamesListSpy).toHaveBeenCalledTimes(1)
  })
})
