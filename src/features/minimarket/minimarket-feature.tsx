import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { MinimarketUiButtonInitialize } from './ui/minimarket-ui-button-initialize'
import { MinimarketUiList } from './ui/minimarket-ui-list'
import { MinimarketUiProgramExplorerLink } from './ui/minimarket-ui-program-explorer-link'
import { MinimarketUiProgramGuard } from './ui/minimarket-ui-program-guard'

export default function MinimarketFeature() {
  const { account } = useSolana()

  return (
    <MinimarketUiProgramGuard>
      <AppHero
        title="Minimarket"
        subtitle={
          account
            ? "Initialize a new minimarket onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <MinimarketUiProgramExplorerLink />
        </p>
        {account ? (
          <MinimarketUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <MinimarketUiList account={account} /> : null}
    </MinimarketUiProgramGuard>
  )
}
