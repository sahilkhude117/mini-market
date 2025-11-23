import { MinimarketUiCard } from './minimarket-ui-card'
import { useMinimarketAccountsQuery } from '@/features/minimarket/data-access/use-minimarket-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function MinimarketUiList({ account }: { account: UiWalletAccount }) {
  const minimarketAccountsQuery = useMinimarketAccountsQuery()

  if (minimarketAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!minimarketAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {minimarketAccountsQuery.data?.map((minimarket) => (
        <MinimarketUiCard account={account} key={minimarket.address} minimarket={minimarket} />
      ))}
    </div>
  )
}
