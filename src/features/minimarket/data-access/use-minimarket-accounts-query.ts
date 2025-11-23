import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getMinimarketProgramAccounts } from '@project/anchor'
import { useMinimarketAccountsQueryKey } from './use-minimarket-accounts-query-key'

export function useMinimarketAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useMinimarketAccountsQueryKey(),
    queryFn: async () => await getMinimarketProgramAccounts(client.rpc),
  })
}
