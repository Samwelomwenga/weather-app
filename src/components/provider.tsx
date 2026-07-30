import type { PropsWithChildren } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NuqsAdapter } from "nuqs/adapters/react"
import { useState } from "react"

export default function Provider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  )
}
