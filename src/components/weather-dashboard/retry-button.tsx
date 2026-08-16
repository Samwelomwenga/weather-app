import type { ComponentProps } from "react"
import RetryIcon from "@/assets/images/icon-retry.svg"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RetryButtonProps = {
  className?: string
  isRetrying?: boolean
  label?: string
  onClick: () => void
  size?: ComponentProps<typeof Button>["size"]
}

/** Retry affordance shared by the inline notice and the full-page error state. */
export function RetryButton({
  className,
  isRetrying = false,
  label = "Retry",
  onClick,
  size,
}: RetryButtonProps) {
  return (
    <Button
      variant="secondary"
      size={size}
      className={cn(
        "focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      disabled={isRetrying}
      onClick={onClick}
    >
      <img src={RetryIcon} alt="" className="h-4 w-4" />
      {isRetrying ? "Retrying..." : label}
    </Button>
  )
}
