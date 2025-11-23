import { MinimarketAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { MinimarketUiButtonClose } from './minimarket-ui-button-close'
import { MinimarketUiButtonDecrement } from './minimarket-ui-button-decrement'
import { MinimarketUiButtonIncrement } from './minimarket-ui-button-increment'
import { MinimarketUiButtonSet } from './minimarket-ui-button-set'

export function MinimarketUiCard({ account, minimarket }: { account: UiWalletAccount; minimarket: MinimarketAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minimarket: {minimarket.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={minimarket.address} label={ellipsify(minimarket.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <MinimarketUiButtonIncrement account={account} minimarket={minimarket} />
          <MinimarketUiButtonSet account={account} minimarket={minimarket} />
          <MinimarketUiButtonDecrement account={account} minimarket={minimarket} />
          <MinimarketUiButtonClose account={account} minimarket={minimarket} />
        </div>
      </CardContent>
    </Card>
  )
}
