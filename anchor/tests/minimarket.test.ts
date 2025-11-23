import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchMinimarket,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('minimarket', () => {
  let payer: KeyPairSigner
  let minimarket: KeyPairSigner

  beforeAll(async () => {
    minimarket = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Minimarket', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, minimarket: minimarket })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentMinimarket = await fetchMinimarket(rpc, minimarket.address)
    expect(currentMinimarket.data.count).toEqual(0)
  })

  it('Increment Minimarket', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      minimarket: minimarket.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchMinimarket(rpc, minimarket.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Minimarket Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ minimarket: minimarket.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchMinimarket(rpc, minimarket.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Minimarket', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      minimarket: minimarket.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchMinimarket(rpc, minimarket.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set minimarket value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ minimarket: minimarket.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchMinimarket(rpc, minimarket.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the minimarket account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      minimarket: minimarket.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchMinimarket(rpc, minimarket.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${minimarket.address}`)
    }
  })
})

// Helper function to keep the tests DRY
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
