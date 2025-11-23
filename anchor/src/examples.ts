/**
 * MiniMarket SDK - Example Usage
 * 
 * This file demonstrates common usage patterns for the MiniMarket SDK
 */

import { 
  getMinimarketProgram,
  createProvider,
  initializeGlobal,
  createMarket,
  addLiquidity,
  createBet,
  fetchMarket,
  fetchGlobal,
  getAllMarkets,
  getMarketPDA,
  isMarketActive,
  isMarketResolved,
  MINIMARKET_PROGRAM_ID,
  type MarketState,
  type GlobalState
} from './index'

import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'

// ============================================================================
// Example 1: Setup and Initialize
// ============================================================================

async function example1_setup() {
  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
  
  // Load wallet (in production, use wallet adapter)
  const wallet = Keypair.generate()
  
  // Create provider and program
  const provider = createProvider(connection, wallet)
  const program = getMinimarketProgram(provider)
  
  console.log('Program ID:', program.programId.toString())
  
  return { connection, wallet, provider, program }
}

// ============================================================================
// Example 2: Initialize Global State (Admin only, once)
// ============================================================================

async function example2_initializeGlobal() {
  const { program, wallet } = await example1_setup()
  
  const feeAuthority = Keypair.generate()
  
  const signature = await initializeGlobal(program, wallet, {
    feeAuthority: feeAuthority.publicKey,
    creatorFeeAmount: new BN(1_000_000), // 0.001 SOL fee to create market
    marketCount: new BN(100_000_000), // 0.1 SOL minimum liquidity
    decimal: 9,
    bettingFeePercentage: 2.0, // 2% fee on bets
    fundFeePercentage: 1.0, // 1% fee on liquidity
  })
  
  console.log('Global initialized:', signature)
  
  // Fetch and verify
  const global = await fetchGlobal(program)
  console.log('Admin:', global.admin.toString())
  console.log('Fee Authority:', global.feeAuthority.toString())
  
  return { program, wallet, feeAuthority }
}

// ============================================================================
// Example 3: Create a Prediction Market
// ============================================================================

async function example3_createMarket() {
  const { program, wallet, feeAuthority } = await example2_initializeGlobal()
  
  const creator = wallet
  const feedAccount = Keypair.generate() // In production, use real Switchboard feed
  
  // Create a market: "Will BTC be above $50,000 by end of 2025?"
  const marketId = `btc-50k-${Date.now()}`
  
  const signature = await createMarket(program, creator, {
    marketId,
    value: 50000, // $50,000 BTC price
    range: 0, // 0 = greater than
    tokenAmount: new BN(1000000000), // 1000 tokens (with 6 decimals)
    tokenPrice: new BN(500000), // 0.5 SOL per token initially
    date: new BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60), // 1 year
    nameA: 'BTC Above 50K',
    symbolA: 'BTC50K-YES',
    urlA: 'https://example.com/btc-yes.png',
    nameB: 'BTC Below 50K',
    symbolB: 'BTC50K-NO',
    urlB: 'https://example.com/btc-no.png',
    feedAddress: feedAccount.publicKey,
    feeAuthority: feeAuthority.publicKey,
  })
  
  console.log('Market created:', signature)
  console.log('Market ID:', marketId)
  
  // Fetch market details
  const market = await fetchMarket(program, marketId)
  console.log('Market creator:', market.creator.toString())
  console.log('YES token mint:', market.tokenMintA.toString())
  console.log('NO token mint:', market.tokenMintB.toString())
  console.log('Market status:', market.marketStatus)
  
  return { program, wallet, feeAuthority, marketId, creator }
}

// ============================================================================
// Example 4: Add Liquidity to Market
// ============================================================================

async function example4_addLiquidity() {
  const { program, wallet, feeAuthority, marketId, creator } = await example3_createMarket()
  
  // Add 0.2 SOL liquidity (above 0.1 SOL minimum)
  const liquidityAmount = new BN(200_000_000) // 0.2 SOL
  
  const signature = await addLiquidity(
    program,
    creator,
    marketId,
    liquidityAmount,
    feeAuthority.publicKey
  )
  
  console.log('Liquidity added:', signature)
  
  // Check market status
  const market = await fetchMarket(program, marketId)
  console.log('Liquidity:', market.liquidity.toString(), 'lamports')
  console.log('Market active:', isMarketActive(market))
  
  return { program, wallet, feeAuthority, marketId, creator }
}

// ============================================================================
// Example 5: Place Bets
// ============================================================================

async function example5_placeBets() {
  const { program, feeAuthority, marketId, creator } = await example4_addLiquidity()
  
  // Create user accounts
  const user1 = Keypair.generate()
  const user2 = Keypair.generate()
  
  // User 1 bets YES (0.05 SOL)
  const bet1Signature = await createBet(program, user1, {
    marketId,
    amount: new BN(50_000_000), // 0.05 SOL
    isYes: true,
    creator: creator.publicKey,
    feeAuthority: feeAuthority.publicKey,
  })
  
  console.log('User 1 bet YES:', bet1Signature)
  
  // User 2 bets NO (0.03 SOL)
  const bet2Signature = await createBet(program, user2, {
    marketId,
    amount: new BN(30_000_000), // 0.03 SOL
    isYes: false,
    creator: creator.publicKey,
    feeAuthority: feeAuthority.publicKey,
  })
  
  console.log('User 2 bet NO:', bet2Signature)
  
  // Check updated market state
  const market = await fetchMarket(program, marketId)
  console.log('YES amount:', market.yesAmount.toString())
  console.log('NO amount:', market.noAmount.toString())
  console.log('YES price:', market.yesPrice.toString())
  console.log('NO price:', market.noPrice.toString())
}

// ============================================================================
// Example 6: Query All Markets
// ============================================================================

async function example6_queryAllMarkets() {
  const { program } = await example1_setup()
  
  // Get all markets
  const markets = await getAllMarkets(program)
  
  console.log(`Found ${markets.length} markets`)
  
  markets.forEach((marketAccount) => {
    const market = marketAccount.account as MarketState
    console.log('\n---')
    console.log('Market ID:', market.marketId)
    console.log('Value:', market.value)
    console.log('Liquidity:', market.liquidity.toString())
    console.log('Active:', isMarketActive(market))
    console.log('Resolved:', isMarketResolved(market))
  })
}

// ============================================================================
// Example 7: Monitor Market Price Changes
// ============================================================================

async function example7_monitorPrices() {
  const { program, connection } = await example1_setup()
  const marketId = 'btc-50k-example'
  
  // Subscribe to market account changes
  const [marketPda] = getMarketPDA(marketId)
  
  connection.onAccountChange(marketPda, async (accountInfo) => {
    const market = await fetchMarket(program, marketId)
    
    console.log('Market updated!')
    console.log('YES price:', market.yesPrice.toString())
    console.log('NO price:', market.noPrice.toString())
    console.log('Total volume:', market.yesAmount.add(market.noAmount).toString())
  })
  
  console.log('Listening for market updates...')
}

// ============================================================================
// Example 8: Calculate Potential Returns
// ============================================================================

async function example8_calculateReturns() {
  const { program } = await example1_setup()
  const marketId = 'btc-50k-example'
  
  const market = await fetchMarket(program, marketId)
  
  const betAmount = new BN(10_000_000) // 0.01 SOL bet
  
  // Calculate how many YES tokens user would get
  // Using constant product formula: x * y = k
  const currentYesAmount = market.yesAmount
  const currentNoAmount = market.noAmount
  const k = currentYesAmount.mul(currentNoAmount)
  
  // After bet: (yesAmount - tokensOut) * (noAmount + betAmount) = k
  const newNoAmount = currentNoAmount.add(betAmount)
  const newYesAmount = k.div(newNoAmount)
  const tokensOut = currentYesAmount.sub(newYesAmount)
  
  console.log('Bet amount:', betAmount.toString(), 'lamports (0.01 SOL)')
  console.log('Tokens received:', tokensOut.toString())
  console.log('Effective price:', betAmount.div(tokensOut).toString(), 'lamports/token')
  
  // If market resolves YES, user gets their tokens redeemed at face value
  const potentialReturn = tokensOut.mul(market.tokenPrice)
  const profit = potentialReturn.sub(betAmount)
  const roi = profit.mul(new BN(100)).div(betAmount)
  
  console.log('Potential return:', potentialReturn.toString(), 'lamports')
  console.log('Profit:', profit.toString(), 'lamports')
  console.log('ROI:', roi.toString() + '%')
}

// ============================================================================
// Example 9: Error Handling
// ============================================================================

async function example9_errorHandling() {
  const { program, wallet, feeAuthority } = await example2_initializeGlobal()
  
  try {
    // Try to create market with wrong fee authority
    await createMarket(program, wallet, {
      marketId: 'test-market',
      value: 100,
      range: 0,
      tokenAmount: new BN(1000),
      tokenPrice: new BN(500000),
      date: new BN(Date.now() / 1000 + 86400),
      nameA: 'Yes',
      symbolA: 'YES',
      urlA: 'https://example.com/yes.png',
      nameB: 'No',
      symbolB: 'NO',
      urlB: 'https://example.com/no.png',
      feedAddress: Keypair.generate().publicKey,
      feeAuthority: Keypair.generate().publicKey, // Wrong authority!
    })
  } catch (error: any) {
    console.error('Expected error caught:', error.message)
    
    if (error.message.includes('InvalidFeeAuthority')) {
      console.log('✓ Fee authority validation working')
    }
  }
  
  try {
    // Try to bet on non-existent market
    await createBet(program, wallet, {
      marketId: 'non-existent',
      amount: new BN(1000000),
      isYes: true,
      creator: wallet.publicKey,
      feeAuthority: feeAuthority.publicKey,
    })
  } catch (error: any) {
    console.error('Expected error caught:', error.message)
    
    if (error.message.includes('AccountNotInitialized')) {
      console.log('✓ Market validation working')
    }
  }
}

// ============================================================================
// Example 10: Full Market Lifecycle
// ============================================================================

async function example10_fullLifecycle() {
  console.log('=== MiniMarket Full Lifecycle Example ===\n')
  
  // 1. Setup
  console.log('1. Setting up connection and program...')
  const { program, wallet } = await example1_setup()
  
  // 2. Initialize (admin)
  console.log('\n2. Initializing global state...')
  const feeAuthority = Keypair.generate()
  await initializeGlobal(program, wallet, {
    feeAuthority: feeAuthority.publicKey,
    creatorFeeAmount: new BN(1_000_000),
    marketCount: new BN(100_000_000),
    decimal: 9,
    bettingFeePercentage: 2.0,
    fundFeePercentage: 1.0,
  })
  
  // 3. Create market
  console.log('\n3. Creating market...')
  const marketId = `eth-2500-${Date.now()}`
  const feedAccount = Keypair.generate()
  
  await createMarket(program, wallet, {
    marketId,
    value: 2500,
    range: 0,
    tokenAmount: new BN(1000000000),
    tokenPrice: new BN(500000),
    date: new BN(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days
    nameA: 'ETH > $2500',
    symbolA: 'ETH2500-YES',
    urlA: 'https://example.com/eth-yes.png',
    nameB: 'ETH < $2500',
    symbolB: 'ETH2500-NO',
    urlB: 'https://example.com/eth-no.png',
    feedAddress: feedAccount.publicKey,
    feeAuthority: feeAuthority.publicKey,
  })
  
  // 4. Add liquidity
  console.log('\n4. Adding liquidity...')
  await addLiquidity(program, wallet, marketId, new BN(150_000_000), feeAuthority.publicKey)
  
  // 5. Place bets
  console.log('\n5. Placing bets...')
  const user1 = Keypair.generate()
  await createBet(program, user1, {
    marketId,
    amount: new BN(20_000_000),
    isYes: true,
    creator: wallet.publicKey,
    feeAuthority: feeAuthority.publicKey,
  })
  
  // 6. Check final state
  console.log('\n6. Final market state:')
  const market = await fetchMarket(program, marketId)
  console.log('   Market ID:', market.marketId)
  console.log('   Status:', isMarketActive(market) ? 'ACTIVE' : 'INACTIVE')
  console.log('   Liquidity:', (market.liquidity.toNumber() / 1e9).toFixed(3), 'SOL')
  console.log('   YES bets:', (market.yesAmount.toNumber() / 1e9).toFixed(3), 'SOL')
  console.log('   NO bets:', (market.noAmount.toNumber() / 1e9).toFixed(3), 'SOL')
  
  console.log('\n✓ Full lifecycle complete!')
}

// Run examples
if (require.main === module) {
  example10_fullLifecycle()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export {
  example1_setup,
  example2_initializeGlobal,
  example3_createMarket,
  example4_addLiquidity,
  example5_placeBets,
  example6_queryAllMarkets,
  example7_monitorPrices,
  example8_calculateReturns,
  example9_errorHandling,
  example10_fullLifecycle,
}
