export type PanelStatus = "loading" | "error" | "empty" | "results"

type PanelStatusInput = {
  isError: boolean
  isPending: boolean
  resultCount: number
}

/**
 * Collapses the query result into the one state the panel should render.
 * Derived rather than stored so it can never drift from the query.
 */
export function getPanelStatus({
  isError,
  isPending,
  resultCount,
}: PanelStatusInput): PanelStatus {
  if (isError) {
    return "error"
  }

  if (isPending) {
    return "loading"
  }

  return resultCount === 0 ? "empty" : "results"
}
