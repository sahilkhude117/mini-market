import { MinimarketAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useMinimarketCloseMutation } from '@/features/minimarket/data-access/use-minimarket-close-mutation'

export function MinimarketUiButtonClose({ account, minimarket }: { account: UiWalletAccount; minimarket: MinimarketAccount }) {
  const closeMutation = useMinimarketCloseMutation({ account, minimarket })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
