/**
 * MiniMarket Program - Type-safe exports and utilities
 * This provides a simplified interface for interacting with the minimarket program
 */

import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor'
import { PublicKey, Connection, Keypair } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import MinimarketIDL from '../target/idl/minimarket.json'

// Re-export the IDL
export { MinimarketIDL }

// Program constants
export const MINIMARKET_PROGRAM_ID = new PublicKey('2F4mpMnSUMDuhMwFnXAgz7xf7V2zYWPFzU12EAGxk8do')
// Alias for frontend compatibility (gill uses this naming convention)
export const MINIMARKET_PROGRAM_ADDRESS = MINIMARKET_PROGRAM_ID
export const GLOBAL_SEED = 'global_seed'
export const MARKET_SEED = 'market_seed'
export const MINT_SEED_A = 'mint_a_seed'
export const MINT_SEED_B = 'mint_b_seed'

// Token Metadata Program ID
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

/**
 * Get the global state PDA
 */
export function getGlobalPDA(programId: PublicKey = MINIMARKET_PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], programId)
}

/**
 * Get the market PDA for a given market ID
 */
export function getMarketPDA(marketId: string, programId: PublicKey = MINIMARKET_PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from(MARKET_SEED), Buffer.from(marketId)], programId)
}

/**
 * Get the YES token mint PDA for a market
 */
export function getTokenMintAPDA(marketPda: PublicKey, programId: PublicKey = MINIMARKET_PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from(MINT_SEED_A), marketPda.toBuffer()], programId)
}

/**
 * Get the NO token mint PDA for a market
 */
export function getTokenMintBPDA(marketPda: PublicKey, programId: PublicKey = MINIMARKET_PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from(MINT_SEED_B), marketPda.toBuffer()], programId)
}

/**
 * Get metadata PDA for a token mint
 */
export function getMetadataPDA(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  )
}

/**
 * Initialize a MiniMarket program instance
 */
export function getMinimarketProgram(provider: AnchorProvider): Program<any> {
  return new Program(MinimarketIDL as any, provider)
}

/**
 * Create a provider from connection and wallet
 */
export function createProvider(connection: Connection, wallet: Keypair): AnchorProvider {
  const walletWrapper = {
    publicKey: wallet.publicKey,
    signTransaction: async (tx: any) => {
      tx.partialSign(wallet)
      return tx
    },
    signAllTransactions: async (txs: any[]) => {
      return txs.map((tx) => {
        tx.partialSign(wallet)
        return tx
      })
    },
  }

  return new AnchorProvider(connection, walletWrapper as any, {
    commitment: 'confirmed',
  })
}

/**
 * Fetch global state account
 */
export async function fetchGlobal(program: Program<any>): Promise<any> {
  const [globalPda] = getGlobalPDA(program.programId)
  return await program.account.global.fetch(globalPda)
}

/**
 * Fetch market account
 */
export async function fetchMarket(program: Program<any>, marketId: string): Promise<any> {
  const [marketPda] = getMarketPDA(marketId, program.programId)
  return await program.account.market.fetch(marketPda)
}

/**
 * Get all markets for a program
 */
export async function getAllMarkets(program: Program<any>): Promise<any[]> {
  return await program.account.market.all()
}

/**
 * Helper to initialize the global state
 */
export async function initializeGlobal(
  program: Program<any>,
  payer: Keypair,
  params: {
    feeAuthority: PublicKey
    creatorFeeAmount: BN
    marketCount: BN
    decimal: number
    bettingFeePercentage: number
    fundFeePercentage: number
  }
): Promise<string> {
  const [globalPda] = getGlobalPDA(program.programId)

  return await program.methods
    .initialize(params)
    .accounts({
      payer: payer.publicKey,
      global: globalPda,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([payer])
    .rpc()
}

/**
 * Helper to create a new market
 */
export async function createMarket(
  program: Program<any>,
  creator: Keypair,
  params: {
    marketId: string
    value: number
    range: number
    tokenAmount: BN
    tokenPrice: BN
    date: BN
    nameA: string
    symbolA: string
    urlA: string
    nameB: string
    symbolB: string
    urlB: string
    feedAddress: PublicKey
    feeAuthority: PublicKey
  }
): Promise<string> {
  const [globalPda] = getGlobalPDA(program.programId)
  const [marketPda] = getMarketPDA(params.marketId, program.programId)
  const [tokenMintA] = getTokenMintAPDA(marketPda, program.programId)
  const [tokenMintB] = getTokenMintBPDA(marketPda, program.programId)
  const [metadataA] = getMetadataPDA(tokenMintA)
  const [metadataB] = getMetadataPDA(tokenMintB)

  return await program.methods
    .initMarket(params)
    .accounts({
      user: creator.publicKey,
      feeAuthority: params.feeAuthority,
      market: marketPda,
      globalPda: globalPda,
      feed: params.feedAddress,
      metadataA,
      metadataB,
      tokenMintA,
      tokenMintB,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([creator])
    .rpc()
}

/**
 * Helper to add liquidity to a market
 */
export async function addLiquidity(
  program: Program<any>,
  user: Keypair,
  marketId: string,
  amount: BN,
  feeAuthority: PublicKey
): Promise<string> {
  const [globalPda] = getGlobalPDA(program.programId)
  const [marketPda] = getMarketPDA(marketId, program.programId)

  return await program.methods
    .addLiquidity(amount)
    .accounts({
      user: user.publicKey,
      feeAuthority,
      market: marketPda,
      global: globalPda,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([user])
    .rpc()
}

/**
 * Helper to create a bet
 */
export async function createBet(
  program: Program<any>,
  user: Keypair,
  params: {
    marketId: string
    amount: BN
    isYes: boolean
    creator: PublicKey
    feeAuthority: PublicKey
  }
): Promise<string> {
  const [globalPda] = getGlobalPDA(program.programId)
  const [marketPda] = getMarketPDA(params.marketId, program.programId)
  const [tokenMintA] = getTokenMintAPDA(marketPda, program.programId)
  const [tokenMintB] = getTokenMintBPDA(marketPda, program.programId)

  const tokenMint = params.isYes ? tokenMintA : tokenMintB
  const pdaTokenAccount = await getAssociatedTokenAddress(tokenMint, marketPda, true)
  const userTokenAccount = await getAssociatedTokenAddress(tokenMint, user.publicKey)

  return await program.methods
    .createBet({
      marketId: params.marketId,
      amount: params.amount,
      isYes: params.isYes,
    })
    .accounts({
      user: user.publicKey,
      creator: params.creator,
      tokenMint,
      pdaTokenAccount,
      userTokenAccount,
      feeAuthority: params.feeAuthority,
      market: marketPda,
      global: globalPda,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([user])
    .rpc()
}

/**
 * Types exported from the IDL
 */
export type GlobalState = {
  admin: PublicKey
  feeAuthority: PublicKey
  creatorFeeAmount: BN
  decimal: number
  marketCount: BN
  bettingFeePercentage: number
  fundFeePercentage: number
}

export type MarketState = {
  marketId: string
  creator: PublicKey
  value: number
  range: number
  date: BN
  result: boolean
  liquidity: BN
  yesAmount: BN
  noAmount: BN
  yesPrice: BN
  noPrice: BN
  tokenMintA: PublicKey
  tokenMintB: PublicKey
  tokenAmount: BN
  tokenPrice: BN
  feed: PublicKey
  marketStatus: any // enum: Created, Prepare, Active, Resolved
}

export type MarketStatus = 
  | { created: {} }
  | { prepare: {} }
  | { active: {} }
  | { resolved: {} }

/**
 * Utility to check market status
 */
export function isMarketActive(market: MarketState): boolean {
  return 'active' in market.marketStatus
}

export function isMarketResolved(market: MarketState): boolean {
  return 'resolved' in market.marketStatus
}
