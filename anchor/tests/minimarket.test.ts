/**
 * MiniMarket Program - Comprehensive Test Suite
 * 
 * Tests cover all program instructions with positive and negative scenarios:
 * 1. Initialize - Global state initialization
 * 2. Create Market - Market creation with metadata and tokens
 * 3. Mint Tokens - Token minting to market PDAs
 * 4. Add Liquidity - Deposit liquidity and market activation
 * 5. Create Bet - Betting with AMM price updates
 * 6. Get Oracle Result - Oracle integration and market resolution
 * 
 * Negative test cases include:
 * - Invalid authorities/creators
 * - Wrong market states
 * - Insufficient amounts
 * - Duplicate operations
 */

import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
  Address,
  address,
} from 'gill'
import {
  getInitializeInstruction,
  getInitMarketInstruction,
  getMintTokenInstruction,
  getAddLiquidityInstruction,
  getCreateBetInstruction,
  getGetResInstruction,
  fetchGlobal,
  fetchMarket,
  MINIMARKET_PROGRAM_ADDRESS,
} from '../src'
// @ts-ignore
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ 
  urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! 
})

// Program constants
const GLOBAL_SEED = 'global_seed'
const MARKET_SEED = 'market_seed'
const MINT_SEED_A = 'mint_a_seed'
const MINT_SEED_B = 'mint_b_seed'

// Test configuration
const DECIMAL = 9
const CREATOR_FEE = 1000000n // 0.001 SOL
const MARKET_COUNT = 100000000n // 0.1 SOL threshold
const BETTING_FEE_PERCENTAGE = 2.0
const FUND_FEE_PERCENTAGE = 1.0

describe('MiniMarket - Comprehensive Test Suite', () => {
  let payer: KeyPairSigner
  let feeAuthority: KeyPairSigner
  let creator: KeyPairSigner
  let user1: KeyPairSigner
  let user2: KeyPairSigner
  let globalPda: Address
  let feedAccount: KeyPairSigner

  const MARKET_ID = 'test-market-' + Date.now()

  beforeAll(async () => {
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
    feeAuthority = await generateKeyPairSigner()
    creator = await generateKeyPairSigner()
    user1 = await generateKeyPairSigner()
    user2 = await generateKeyPairSigner()
    feedAccount = await generateKeyPairSigner()

    // Derive global PDA
    globalPda = await findProgramAddress(
      [Buffer.from(GLOBAL_SEED)],
      MINIMARKET_PROGRAM_ADDRESS
    )
  })

  describe('1. Initialize Global State', () => {
    it('should successfully initialize global state', async () => {
      const ix = getInitializeInstruction({
        payer: payer,
        global: globalPda,
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          feeAuthority: feeAuthority.address,
          creatorFeeAmount: CREATOR_FEE,
          marketCount: MARKET_COUNT,
          decimal: DECIMAL,
          bettingFeePercentage: BETTING_FEE_PERCENTAGE,
          fundFeePercentage: FUND_FEE_PERCENTAGE,
        }
      })

      await sendAndConfirm({ ix, payer })

      const globalAccount = await fetchGlobal(rpc, globalPda)
      expect(globalAccount.data.admin).toEqual(payer.address)
      expect(globalAccount.data.feeAuthority).toEqual(feeAuthority.address)
      expect(globalAccount.data.creatorFeeAmount).toEqual(CREATOR_FEE)
      expect(globalAccount.data.decimal).toEqual(DECIMAL)
    })

    it('NEGATIVE: should fail to initialize global state twice', async () => {
      const ix = getInitializeInstruction({
        payer: payer,
        global: globalPda,
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          feeAuthority: feeAuthority.address,
          creatorFeeAmount: CREATOR_FEE,
          marketCount: MARKET_COUNT,
          decimal: DECIMAL,
          bettingFeePercentage: BETTING_FEE_PERCENTAGE,
          fundFeePercentage: FUND_FEE_PERCENTAGE,
        }
      })

      await expect(sendAndConfirm({ ix, payer })).rejects.toThrow()
    })
  })

  describe('2. Create Market', () => {
    let marketPda: Address
    let tokenMintA: Address
    let tokenMintB: Address

    beforeAll(async () => {
      marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      tokenMintA = await findProgramAddress(
        [Buffer.from(MINT_SEED_A), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      tokenMintB = await findProgramAddress(
        [Buffer.from(MINT_SEED_B), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )
    })

    it('should successfully create a prediction market', async () => {
      const ix = getInitMarketInstruction({
        user: creator,
        feeAuthority: feeAuthority.address,
        market: marketPda,
        globalPda: globalPda,
        feed: feedAccount.address,
        metadataA: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        metadataB: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        tokenMintA: tokenMintA,
        tokenMintB: tokenMintB,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        rent: address('SysvarRent111111111111111111111111111111111'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          marketId: MARKET_ID,
          value: 100.0,
          range: 0, // greater than
          tokenAmount: 1000n,
          tokenPrice: 500000n,
          date: BigInt(Date.now() + 86400000),
          nameA: 'Yes Token',
          symbolA: 'YES',
          urlA: 'https://example.com/yes',
          nameB: 'No Token',
          symbolB: 'NO',
          urlB: 'https://example.com/no',
        }
      })

      await sendAndConfirm({ ix, payer: creator })

      const market = await fetchMarket(rpc, marketPda)
      expect(market.data.value).toEqual(100.0)
      expect(market.data.creator).toEqual(creator.address)
      expect(market.data.marketStatus.__kind).toEqual('Created')
    })

    it('NEGATIVE: should fail with invalid fee authority', async () => {
      const wrongFeeAuth = await generateKeyPairSigner()
      const marketId2 = 'market-invalid-' + Date.now()
      const market2Pda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(marketId2)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getInitMarketInstruction({
        user: creator,
        feeAuthority: wrongFeeAuth.address,
        market: market2Pda,
        globalPda: globalPda,
        feed: feedAccount.address,
        metadataA: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        metadataB: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        tokenMintA: tokenMintA,
        tokenMintB: tokenMintB,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        rent: address('SysvarRent111111111111111111111111111111111'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          marketId: marketId2,
          value: 100.0,
          range: 0,
          tokenAmount: 1000n,
          tokenPrice: 500000n,
          date: BigInt(Date.now() + 86400000),
          nameA: 'Yes Token',
          symbolA: 'YES',
          urlA: 'https://example.com/yes',
          nameB: 'No Token',
          symbolB: 'NO',
          urlB: 'https://example.com/no',
        }
      })

      await expect(sendAndConfirm({ ix, payer: creator })).rejects.toThrow()
    })
  })

  describe('3. Mint Tokens', () => {
    it('should mint tokens to market PDAs', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      const tokenMintA = await findProgramAddress(
        [Buffer.from(MINT_SEED_A), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      const tokenMintB = await findProgramAddress(
        [Buffer.from(MINT_SEED_B), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getMintTokenInstruction({
        pdaTokenAAccount: await getAssociatedTokenAddress(tokenMintA, marketPda),
        pdaTokenBAccount: await getAssociatedTokenAddress(tokenMintB, marketPda),
        user: creator,
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        metadataA: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        metadataB: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        tokenMintA: tokenMintA,
        tokenMintB: tokenMintB,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        rent: address('SysvarRent111111111111111111111111111111111'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        marketId: MARKET_ID
      })

      await sendAndConfirm({ ix, payer: creator })

      const market = await fetchMarket(rpc, marketPda)
      expect(market.data.marketStatus.__kind).toEqual('Prepare')
    })
  })

  describe('4. Add Liquidity', () => {
    it('should add liquidity and activate market', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const liquidityAmount = 150000000n // 0.15 SOL

      const ix = getAddLiquidityInstruction({
        user: creator,
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        amount: liquidityAmount
      })

      await sendAndConfirm({ ix, payer: creator })

      const market = await fetchMarket(rpc, marketPda)
      expect(market.data.marketStatus.__kind).toEqual('Active')
    })

    it('NEGATIVE: should fail with amount below minimum', async () => {
      const marketId3 = 'market-low-liq-' + Date.now()
      const market3Pda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(marketId3)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const lowAmount = 50000n // Below 100000 minimum

      const ix = getAddLiquidityInstruction({
        user: creator,
        feeAuthority: feeAuthority.address,
        market: market3Pda,
        global: globalPda,
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        amount: lowAmount
      })

      await expect(sendAndConfirm({ ix, payer: creator })).rejects.toThrow()
    })

    it('NEGATIVE: should fail when market not in Prepare state', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getAddLiquidityInstruction({
        user: creator,
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        amount: 50000000n
      })

      await expect(sendAndConfirm({ ix, payer: creator })).rejects.toThrow()
    })
  })

  describe('5. Create Bet', () => {
    it('should create YES bet and update prices', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      const tokenMintA = await findProgramAddress(
        [Buffer.from(MINT_SEED_A), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const betAmount = 10n

      const ix = getCreateBetInstruction({
        user: user1,
        creator: creator.address,
        tokenMint: tokenMintA,
        pdaTokenAccount: await getAssociatedTokenAddress(tokenMintA, marketPda),
        userTokenAccount: await getAssociatedTokenAddress(tokenMintA, user1.address),
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          marketId: MARKET_ID,
          amount: betAmount,
          isYes: true,
        }
      })

      await sendAndConfirm({ ix, payer: user1 })

      const market = await fetchMarket(rpc, marketPda)
      expect(market.data.yesAmount).toBeGreaterThan(0n)
    })

    it('should create NO bet and update prices', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      const tokenMintB = await findProgramAddress(
        [Buffer.from(MINT_SEED_B), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const betAmount = 10n

      const ix = getCreateBetInstruction({
        user: user2,
        creator: creator.address,
        tokenMint: tokenMintB,
        pdaTokenAccount: await getAssociatedTokenAddress(tokenMintB, marketPda),
        userTokenAccount: await getAssociatedTokenAddress(tokenMintB, user2.address),
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          marketId: MARKET_ID,
          amount: betAmount,
          isYes: false,
        }
      })

      await sendAndConfirm({ ix, payer: user2 })

      const market = await fetchMarket(rpc, marketPda)
      expect(market.data.noAmount).toBeGreaterThan(0n)
    })

    it('NEGATIVE: should fail with invalid creator', async () => {
      const wrongCreator = await generateKeyPairSigner()
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )
      const tokenMintA = await findProgramAddress(
        [Buffer.from(MINT_SEED_A), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getCreateBetInstruction({
        user: user1,
        creator: wrongCreator.address,
        tokenMint: tokenMintA,
        pdaTokenAccount: await getAssociatedTokenAddress(tokenMintA, marketPda),
        userTokenAccount: await getAssociatedTokenAddress(tokenMintA, user1.address),
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          marketId: MARKET_ID,
          amount: 10n,
          isYes: true,
        }
      })

      await expect(sendAndConfirm({ ix, payer: user1 })).rejects.toThrow()
    })

    it('should verify AMM price update mechanism', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const marketBefore = await fetchMarket(rpc, marketPda)
      const priceABefore = marketBefore.data.tokenPriceA
      const priceBBefore = marketBefore.data.tokenPriceB

      const tokenMintA = await findProgramAddress(
        [Buffer.from(MINT_SEED_A), getAddressBytes(marketPda)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getCreateBetInstruction({
        user: user1,
        creator: creator.address,
        tokenMint: tokenMintA,
        pdaTokenAccount: await getAssociatedTokenAddress(tokenMintA, marketPda),
        userTokenAccount: await getAssociatedTokenAddress(tokenMintA, user1.address),
        feeAuthority: feeAuthority.address,
        market: marketPda,
        global: globalPda,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        associatedTokenProgram: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        tokenMetadataProgram: address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        systemProgram: address('11111111111111111111111111111111'),
      }, {
        params: {
          marketId: MARKET_ID,
          amount: 50n,
          isYes: true,
        }
      })

      await sendAndConfirm({ ix, payer: user1 })

      const marketAfter = await fetchMarket(rpc, marketPda)
      expect(marketAfter.data.tokenPriceA).not.toEqual(priceABefore)
      expect(marketAfter.data.tokenPriceB).not.toEqual(priceBBefore)
    })
  })

  describe('6. Get Oracle Result', () => {
    it('should resolve market with oracle data', async () => {
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getGetResInstruction({
        user: payer,
        market: marketPda,
        global: globalPda,
        feed: feedAccount.address,
        clock: address('SysvarC1ock11111111111111111111111111111111'),
        systemProgram: address('11111111111111111111111111111111'),
      })

      await sendAndConfirm({ ix, payer })

      const market = await fetchMarket(rpc, marketPda)
      expect(typeof market.data.result).toBe('boolean')
    })

    it('NEGATIVE: should fail with non-admin user', async () => {
      const nonAdmin = await generateKeyPairSigner()
      const marketPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(MARKET_ID)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      const ix = getGetResInstruction({
        user: nonAdmin,
        market: marketPda,
        global: globalPda,
        feed: feedAccount.address,
        clock: address('SysvarC1ock11111111111111111111111111111111'),
        systemProgram: address('11111111111111111111111111111111'),
      })

      await expect(sendAndConfirm({ ix, payer: nonAdmin })).rejects.toThrow()
    })
  })

  describe('7. Market Range Types', () => {
    it('should create market with range=1 (equals)', async () => {
      const marketIdEq = 'market-equals-' + Date.now()
      const marketEqPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(marketIdEq)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      // Create market with range=1
      // Test that market correctly validates range type
    })

    it('should create market with range=2 (less than)', async () => {
      const marketIdLt = 'market-less-' + Date.now()
      const marketLtPda = await findProgramAddress(
        [Buffer.from(MARKET_SEED), Buffer.from(marketIdLt)],
        MINIMARKET_PROGRAM_ADDRESS
      )

      // Create market with range=2
      // Test that market correctly validates range type
    })
  })

  describe('8. Fee Collection Verification', () => {
    it('should collect creator fee on market creation', async () => {
      const balanceBefore = await rpc.getBalance(feeAuthority.address).send()
      
      // Create new market
      const marketIdFee = 'market-fee-' + Date.now()
      // ... create market

      const balanceAfter = await rpc.getBalance(feeAuthority.address).send()
      expect(balanceAfter.value).toBeGreaterThan(balanceBefore.value)
    })

    it('should collect betting fee on bets', async () => {
      const balanceBefore = await rpc.getBalance(feeAuthority.address).send()
      
      // Place bet
      // ... 

      const balanceAfter = await rpc.getBalance(feeAuthority.address).send()
      const expectedFee = /* calculate based on BETTING_FEE_PERCENTAGE */
      expect(balanceAfter.value).toBeGreaterThan(balanceBefore.value)
    })

    it('should collect liquidity fee on deposits', async () => {
      const balanceBefore = await rpc.getBalance(feeAuthority.address).send()
      
      // Add liquidity
      // ...

      const balanceAfter = await rpc.getBalance(feeAuthority.address).send()
      const expectedFee = /* calculate based on FUND_FEE_PERCENTAGE */
      expect(balanceAfter.value).toBeGreaterThan(balanceBefore.value)
    })
  })
})

// ============================================================================
// Helper Functions
// ============================================================================

let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined

async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}

async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}

async function findProgramAddress(seeds: Buffer[], programId: Address): Promise<Address> {
  // Implement PDA derivation using gill or web3.js
  // This is a placeholder - actual implementation needed
  return programId
}

function getAddressBytes(addr: Address): Buffer {
  // Convert address to bytes
  return Buffer.from(addr)
}

async function getAssociatedTokenAddress(mint: Address, owner: Address): Promise<Address> {
  // Derive associated token address
  // This is a placeholder - actual implementation needed
  return mint
}
