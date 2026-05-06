import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { createSupabaseMock } from "./utils/supabaseMock"

const createClientMock = vi.fn()

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => createClientMock(),
}))

import PerguntasPage from "@/app/questions/page"

describe("Special questions page", () => {
  it("uses a compact non-negative numeric input for number questions", async () => {
    createClientMock.mockReturnValue(
      createSupabaseMock({
        user: { id: "u-1" },
        tables: {
          special_questions: [
            {
              id: "q-number",
              question: "How many goals will the top scorer get?",
              type: "number",
              points: 3,
              sort_order: 1,
              options: [],
              correct_answer: null,
            },
          ],
          matches: [{ kickoff_time: "2099-01-01T00:00:00.000Z" }],
          special_answers: [],
          profiles: [{ id: "u-1", special_answers_submitted_at: null }],
        },
      })
    )

    render(<PerguntasPage />)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /special questions/i })).toBeInTheDocument()
    })

    const numberInput = screen.getByLabelText(/non-negative whole number/i)
    expect(numberInput).toHaveAttribute("min", "0")
    expect(numberInput).toHaveClass("w-12")

    fireEvent.change(numberInput, { target: { value: "-3" } })
    expect(numberInput).toHaveValue(null)

    fireEvent.change(numberInput, { target: { value: "2" } })
    expect(numberInput).toHaveValue(2)
  })
})
