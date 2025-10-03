import type { Cluster } from "@solana/web3.js";
import type { GlobalSettingType } from "../../type";
import { global, setClusterConfig } from "../../prediction_market_sdk";

export const initialize = async (cluster: Cluster, param: GlobalSettingType ) => {
    setClusterConfig(cluster);
    await execute();
    const result = await global(param);
    if (result) {
        if (!result.new) {
            console.log("Global is already initialized.", result.globalPDA.toBase58());
        } else {
            console.log("Global is successfuly initialized.", result.globalPDA.toBase58());
        }
    } else {
        console.log("Failed creating gloabal PDA.");
    }
}