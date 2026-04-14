import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { createSupabaseMock } from "./utils/supabaseMock"

const createClientMock = vi.fn()

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => createClientMock(),
}))

import LeaguesPage from "@/app/leagues/page"

describe("Leagues page", () => {
  it("validates short league names before submit", async () => {
    createClientMock.mockReturnValue(
      createSupabaseMock({
        user: null,
      })
    )

    const user = userEvent.setup()
    render(<LeaguesPage />)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /^leagues$/i, level: 1 })).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText(/league name/i), "A")
    await user.click(screen.getByRole("button", { name: /^create$/i }))

    expect(screen.getByText("Name is too short.")).toBeInTheDocument()
  })
})
