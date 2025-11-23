// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Minimarket, MINIMARKET_DISCRIMINATOR, MINIMARKET_PROGRAM_ADDRESS, getMinimarketDecoder } from './client/js'
import MinimarketIDL from '../target/idl/minimarket.json'

export type MinimarketAccount = Account<Minimarket, string>

// Re-export the generated IDL and type
export { MinimarketIDL }

export * from './client/js'

export function getMinimarketProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getMinimarketDecoder(),
    filter: getBase58Decoder().decode(MINIMARKET_DISCRIMINATOR),
    programAddress: MINIMARKET_PROGRAM_ADDRESS,
  })
}
