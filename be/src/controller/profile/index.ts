import type { Request, Response } from "express";

export const getProfileData = async (req: Request, res: Response) => {
    try {
        // Mock data constants
        const totalProposedMarket = 5;
        const totalreferrals = 12;
        const bettingHistory = [
            { id: 1, market: "Will Bitcoin reach $100k by 2025?", amount: 50, prediction: "Yes", date: "2024-10-01", status: "active" },
            { id: 2, market: "Will AI replace 50% jobs by 2030?", amount: 25, prediction: "No", date: "2024-09-28", status: "won" },
            { id: 3, market: "Will Tesla stock hit $300?", amount: 75, prediction: "Yes", date: "2024-09-25", status: "lost" }
        ];
        const investList = [
            { id: 1, marketName: "Crypto Market Predictions", amountProvided: 500, currentValue: 520, roi: "4%" },
            { id: 2, marketName: "Tech Stock Futures", amountProvided: 300, currentValue: 285, roi: "-5%" }
        ];
        const proposedMarket = [
            { id: 1, title: "Will OpenAI release GPT-5 in 2025?", description: "Prediction about GPT-5 release", status: "pending", proposedDate: "2024-10-01" },
            { id: 2, title: "Will Ethereum reach $5000?", description: "ETH price prediction", status: "approved", proposedDate: "2024-09-30" }
        ];

        const profileData = {
            totalProfileValue: 0,
            activeBet: "1",
            totalBet: 10,
            totalLiquidityProvided: 10,
            earnedFeeLiquidity: 10,
            earnedBet: 10,
            totalProposedMarket, 
            totalreferrals, 
            bettingHistory, 
            fundedMarkets: investList, 
            proposedMarket
        };

        res.status(200).json(profileData);
    } catch (e) {
        console.log("😒 error:", e);
        res.status(500).send("Something went wrong fetching profile Data!");
    }
}