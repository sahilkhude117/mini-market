import { 
    CrossbarClient,
    OracleJob
  } from "@switchboard-xyz/common";
import {
    PullFeed,
    getDefaultQueue,
} from "@switchboard-xyz/on-demand";
import { Transaction, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { RegistType } from "../../types/type";


export const customizeFeed = async (param: RegistType) => {
    console.log("🚀 customizeFeed STARTED");
    try {
        console.log("📡 customizeFeed called with:", {
            url: param.url,
            task: param.task,
            name: param.name,
            cluster: param.cluster,
            hasWallet: !!param.wallet,
            walletPublicKey: param.wallet?.publicKey?.toBase58()
        });

    const jobs: OracleJob[] = [
        OracleJob.create({
            tasks: [
            {
                httpTask: {
                    url: param.url as string,
                }
            },
            {
                jsonParseTask: {
                    path: param.task  as string
                }
            }
            ],
        }),
    ];
    // Print the jobs that are being run.
    const jobJson = JSON.stringify({ jobs: jobs.map((job) => job.toJSON()) });
    console.log("job object:", jobJson);
    console.log();
    
    // Serialize the jobs to base64 strings.
    const serializedJobs = jobs.map((oracleJob) => {
        const encoded = OracleJob.encodeDelimited(oracleJob).finish();
        const base64 = Buffer.from(encoded).toString("base64");
        return base64;
    });
    
    // Call the simulation server.
    const response = await fetch("https://api.switchboard.xyz/api/simulate", {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ cluster: param.cluster, jobs: serializedJobs }),
    });
    
    // Check response.
    if (response.ok) {
        const data = await response.json();
        console.log(`✅ Oracle simulation successful`);
        console.log(JSON.stringify(data, null, 2));
        if (!data.result) {
            const errorObj = {result: "❌ Invalid data feed URL or JSON path. Please verify:\n1. The API endpoint is accessible\n2. The JSON path exists in the response\n3. The API returns numeric data", error: true};
            console.log("🔴 EARLY RETURN: Invalid data.result - returning:", JSON.stringify(errorObj));
            return errorObj;
        }
    } else {
        const errorText = await response.text();
        console.log(`❌ Oracle simulation failed (${response.status})`);
        console.log(errorText);
        const errorObj = {result: `❌ Oracle feed validation failed (HTTP ${response.status}).\n\nPossible issues:\n• API endpoint is unreachable\n• API requires authentication\n• JSON path is incorrect\n\nPlease check your data source and try again.`, error: true};
        console.log("🔴 EARLY RETURN: Response not OK - returning:", JSON.stringify(errorObj));
        return errorObj;
    }

    // Get the queue for the network you're deploying on
    let queue = await getDefaultQueue("https://devnet.helius-rpc.com/?api-key=7e5bbc4c-02f5-46ca-b781-468b275b5758");

    // Get the crossbar server client
    const crossbarClient = CrossbarClient.default();
    
    // Upload jobs to Crossbar, which pins valid feeds on ipfs
    const { feedHash } = await crossbarClient.store(queue.pubkey.toBase58(), jobs);
    const [pullFeed, feedKeypair] = PullFeed.generate(queue.program);
    const initIx = await pullFeed.initIx({
        name: "BTC Price Feed", // the feed name (max 32 bytes)
        queue: queue.pubkey, // the queue of oracles to bind to
        maxVariance: 1.0, // the maximum variance allowed for the feed results
        minResponses: 1, // minimum number of responses of jobs to allow
        feedHash: Buffer.from(feedHash.slice(2), "hex"), // the feed hash
        minSampleSize: 1, // The minimum number of samples required for setting feed value
        maxStaleness: 300, // The maximum number of slots that can pass before a feed value is considered stale.
        payer: param.wallet.publicKey, // the payer of the feed
    });

    let latestBlockHash = await queue.program.provider.connection.getLatestBlockhash(
        queue.program.provider.connection.commitment
    );

    const messageV0 = new TransactionMessage({
        payerKey: param.wallet.publicKey,
        recentBlockhash: latestBlockHash.blockhash,
        instructions: [initIx],
    }).compileToV0Message();
    
    const vtx = new VersionedTransaction(messageV0);
    const sim = await queue.program.provider.connection.simulateTransaction(vtx);
    console.log("custom feed simulation:", sim);

    vtx.sign([feedKeypair]);
    const signedTx = await param.wallet.signTransaction(vtx);
    console.log("signedTx:", signedTx);
    
    if (sim.value.err) {
        console.log("Simulation error:", sim.value.err);
        throw new Error("Transaction simulation failed when creating market.");
    }
    const createV0Tx = await queue.program.provider.connection.sendTransaction(signedTx);
    console.log("tx:", createV0Tx);
    
    const vTxSig = await queue.program.provider.connection.confirmTransaction(createV0Tx, "confirmed");
    console.log("confirmation:", vTxSig);

    // const initTx = await asV0Tx({
    //     connection: queue.program.provider.connection,
    //     ixs: [initIx],
    //     payer: walletKeypair.publicKey,
    //     signers: [walletKeypair, feedKeypair],
    //     computeUnitPrice: 200_000,
    //     computeUnitLimitMultiple: 1.5,
    // });

    // // simulate the transaction
    // const simulateResult = await queue.program.provider.connection.simulateTransaction(initTx, {
    //     commitment: "processed",
    // });
    // console.log(simulateResult);

    // const initSig = await queue.program.provider.connection.sendTransaction(
    //     initTx,
    //     {
    //         preflightCommitment: "processed",
    //         skipPreflight: false,
    //     }
    // );

    // console.log(`Feed ${feedKeypair.publicKey} initialized: ${initSig}`);

    console.log("✅ customizeFeed completed successfully");
    const result = {error: false, feedKeypair};
    console.log("✅ Returning result:", JSON.stringify({
        error: result.error,
        feedPublicKey: result.feedKeypair?.publicKey?.toBase58()
    }));
    return result;
    
    } catch (error) {
        console.error("❌ customizeFeed ERROR CAUGHT:", error);
        console.error("❌ Error type:", typeof error);
        console.error("❌ Error message:", error instanceof Error ? error.message : String(error));
        console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack');
        
        const errorResult = {
            result: `Failed to create oracle feed: ${error instanceof Error ? error.message : String(error)}`,
            error: true
        };
        console.error("🔴 Returning error object:", JSON.stringify(errorResult));
        return errorResult;
    } finally {
        console.log("🏁 customizeFeed function ENDED");
    }
} 