import { PublicKey } from "@solana/web3.js";

// Mini-market program constants
export const GLOBAL_SEED = "global_seed";
export const MARKET_SEED = "market_seed";
export const MINT_SEED_A = "mint_a_seed";
export const MINT_SEED_B = "mint_b_seed";

// Mini-market program ID (devnet)
export const PREDICTION_ID = new PublicKey(
  "2F4mpMnSUMDuhMwFnXAgz7xf7V2zYWPFzU12EAGxk8do"
);

export const SOL_USDC_FEED = "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR";
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Fee authority - update this with your fee authority public key
export const feeAuthority = new PublicKey(
  "GdCJ8rM2cbdKXZMBH5H4EmvLinQSp78Xg1stHoh4nUpr"
);
export const METADATA_SEED = "metadata";

export const tokenAAmount = 10000000;
export const tokenBAmount = 10000000;
