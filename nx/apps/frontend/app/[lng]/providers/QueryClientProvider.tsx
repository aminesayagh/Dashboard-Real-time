import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

type QueryClientProviderProps = {
    children: React.ReactNode;
}

const queryClient = new QueryClient()

function AppQuery({ children }: QueryClientProviderProps) {
    return <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
}

export default AppQuery