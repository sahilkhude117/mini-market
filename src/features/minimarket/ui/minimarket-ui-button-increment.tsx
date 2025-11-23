import { MinimarketAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useMinimarketIncrementMutation } from '../data-access/use-minimarket-increment-mutation'

export function MinimarketUiButtonIncrement({ account, minimarket }: { account: UiWalletAccount; minimarket: MinimarketAccount }) {
  const incrementMutation = useMinimarketIncrementMutation({ account, minimarket })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
