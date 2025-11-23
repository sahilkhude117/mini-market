import { useQueryClient } from '@tanstack/react-query'
import { useMinimarketAccountsQueryKey } from './use-minimarket-accounts-query-key'

export function useMinimarketAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useMinimarketAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
