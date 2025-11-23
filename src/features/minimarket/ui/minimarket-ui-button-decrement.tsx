import { MinimarketAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useMinimarketDecrementMutation } from '../data-access/use-minimarket-decrement-mutation'

export function MinimarketUiButtonDecrement({ account, minimarket }: { account: UiWalletAccount; minimarket: MinimarketAccount }) {
  const decrementMutation = useMinimarketDecrementMutation({ account, minimarket })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
