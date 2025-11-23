import { MinimarketAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useMinimarketSetMutation } from '@/features/minimarket/data-access/use-minimarket-set-mutation'

export function MinimarketUiButtonSet({ account, minimarket }: { account: UiWalletAccount; minimarket: MinimarketAccount }) {
  const setMutation = useMinimarketSetMutation({ account, minimarket })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', minimarket.data.count.toString() ?? '0')
        if (!value || parseInt(value) === minimarket.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
