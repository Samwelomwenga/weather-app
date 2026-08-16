export type DashboardNoticeVariant = "error" | "loading"

export type DashboardNoticeAction = {
  isLoading?: boolean
  label: string
  onClick: () => void
}

/**
 * View model for the inline banner shown above the forecast grid. The variant
 * stays semantic so the presentation layer owns icons and ARIA roles.
 */
export type DashboardNotice = {
  action?: DashboardNoticeAction
  message?: string
  title: string
  variant: DashboardNoticeVariant
}
