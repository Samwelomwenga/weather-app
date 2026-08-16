import type { DashboardNotice, DashboardNoticeVariant } from "@/types/dashboard"
import ErrorIcon from "@/assets/images/icon-error.svg"
import LoadingIcon from "@/assets/images/icon-loading.svg"
import { RetryButton } from "@/components/weather-dashboard/retry-button"

const noticeIcons: Record<DashboardNoticeVariant, string> = {
  error: ErrorIcon,
  loading: LoadingIcon,
}

const noticeRoles = {
  error: "alert",
  loading: "status",
} as const satisfies Record<DashboardNoticeVariant, "alert" | "status">

type DashboardStateNoticeProps = {
  notice: DashboardNotice
}

/**
 * Inline banner for states the dashboard can recover from, shown while a stale
 * forecast stays on screen.
 */
export function DashboardStateNotice({ notice }: DashboardStateNoticeProps) {
  const role = noticeRoles[notice.variant]

  return (
    <section
      className="mx-auto flex w-full max-w-164 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left sm:flex-row sm:items-start"
      role={role}
      aria-live={role === "alert" ? "assertive" : "polite"}
    >
      <img
        src={noticeIcons[notice.variant]}
        alt=""
        className="mt-1 h-5 w-5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold">{notice.title}</h2>
        {notice.message && (
          <p className="mt-1 text-sm text-muted-foreground">
            {notice.message}
          </p>
        )}
      </div>
      {notice.action && (
        <RetryButton
          className="shrink-0 self-start"
          isRetrying={notice.action.isLoading}
          label={notice.action.label}
          size="sm"
          onClick={notice.action.onClick}
        />
      )}
    </section>
  )
}
