import { useSolana } from '@/components/solana/use-solana'

export function useMinimarketAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['minimarket', 'accounts', { cluster }]
}
