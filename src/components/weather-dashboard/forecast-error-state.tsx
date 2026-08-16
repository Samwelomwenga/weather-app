import ErrorIcon from "@/assets/images/icon-error.svg"
import { RetryButton } from "@/components/weather-dashboard/retry-button"

type ForecastErrorStateProps = {
  isRetrying: boolean
  onRetry: () => void
}

/** Full-page fallback used when there is no forecast at all to display. */
export function ForecastErrorState({
  isRetrying,
  onRetry,
}: ForecastErrorStateProps) {
  return (
    <section
      className="mx-auto flex min-h-[34rem] max-w-[42rem] flex-col items-center justify-center text-center"
      role="alert"
      aria-live="assertive"
    >
      <img src={ErrorIcon} alt="" className="h-12 w-12" />
      <h1 className="mt-8 font-display text-4xl leading-tight font-bold text-balance sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-5 max-w-[36rem] text-lg font-medium text-muted-foreground">
        We couldn&apos;t connect to the server. Please try again in a few
        moments.
      </p>
      <RetryButton
        className="mt-8"
        isRetrying={isRetrying}
        onClick={onRetry}
      />
    </section>
  )
}
