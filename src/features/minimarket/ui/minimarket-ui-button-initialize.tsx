import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useMinimarketInitializeMutation } from '@/features/minimarket/data-access/use-minimarket-initialize-mutation'

export function MinimarketUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useMinimarketInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Minimarket {mutationInitialize.isPending && '...'}
    </Button>
  )
}
