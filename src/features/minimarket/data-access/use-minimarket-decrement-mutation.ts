import { MinimarketAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useMinimarketAccountsInvalidate } from './use-minimarket-accounts-invalidate'

export function useMinimarketDecrementMutation({
  account,
  minimarket,
}: {
  account: UiWalletAccount
  minimarket: MinimarketAccount
}) {
  const invalidateAccounts = useMinimarketAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ minimarket: minimarket.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
