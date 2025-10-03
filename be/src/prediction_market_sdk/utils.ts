import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, type Connection, type TransactionInstruction } from "@solana/web3.js";

export const getOrCreateATAInstruction = async (
    tokenMint: PublicKey,
    owner: PublicKey,
    connection: Connection,
    payer?: PublicKey,
): Promise<[PublicKey, TransactionInstruction?]> => {
    try {
        let toAccount = getAssociatedTokenAddressSync(tokenMint, owner);

        const account = await connection.getAccountInfo(toAccount);

        if (!account) {
            const ix = createAssociatedTokenAccountInstruction(
                payer || owner,
                toAccount,
                owner,
                tokenMint,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID,
            );
            return [toAccount, ix];
        }

        return [toAccount, undefined];
    } catch (e) {
        console.error('Error::getOrCreateATAInstruction', e);
          throw e;
    }
}

export const getAssociatedTokenAccount = async (
    ownerPubkey: PublicKey,
    mintPk: PublicKey
): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = PublicKey.findProgramAddressSync(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];

    return associatedTokenAccountPubkey;
};

import { config } from "./config";

import { geyserClient as jitoGeyserClient } from "jito-ts";

import { SearcherClient, searcherClient as jitoSearcherClient } from "jito-ts/dist/sdk/block-engine/searcher.js";

const BLOCK_ENGINE_URLS = config.get("block_engine_urls");

const GEYSER_URL = config.get("geyser_url");
const GEYSER_ACCESS_TOKEN = config.get("geyser_access_token");

const searcherclients: SearcherClient[] = [];

for (const url of BLOCK_ENGINE_URLS) {
    const client = jitoSearcherClient(url);
    searcherclients.push(client);
}

const geyserClient = jitoGeyserClient(GEYSER_URL, GEYSER_ACCESS_TOKEN, {
    "grpc.keepalive_timeout_ms": 4000,
})

// all bundles sent get automatically forwarded to the other regions.
// assuming the first block engine in the array in the closest one
const searcherClient = searcherclients[0];

export { searcherClient, searcherclients, geyserClient };