'use client'
import { useState } from 'react'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

type QueryClientProviderProps = {
  children: React.ReactNode
}

function AppQuery({ children }: QueryClientProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 60 * 1000,

      },
    },
  }))
  if (!queryClient) {
    throw new Error('No query client found')
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  )
}

export default AppQuery
