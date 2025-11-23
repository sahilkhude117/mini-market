import { MINIMARKET_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function MinimarketUiProgramExplorerLink() {
  return <AppExplorerLink address={MINIMARKET_PROGRAM_ADDRESS} label={ellipsify(MINIMARKET_PROGRAM_ADDRESS)} />
}
